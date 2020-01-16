var express = require('express');
var router = express.Router();
const axios = require('axios');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");
const fs = require('fs')
const baseReqUrl = JSON.parse(fs.readFileSync(`${__dirname}/../configs/baseUrl.json`));
/* 查询群主的群,以及小助手,逻辑
1./im/group/page 查回所有群
2./contact/page 查回群主信息
3. /im/relation/page 根据 群的platformGids 去查处小助手的详细信息
4. /api/fadan/bot/ 查回机器人列表
5. 过过滤匹配,看群是否存在且只有一个淘宝机器人 type == 4
6. 组装后端需要数据到 /im/group/page 这个查回的群的列表.主要为了获取puid以及多少个淘宝机器人,不是且只有一个人,会用disabled禁止
前端页面挑选.

. */
router.post('/search-srv/im_group_views/page', async function(req, res, next) {
  if(!req.body.token){
    res.send(false);
    return;
  }
  var data = await axios.post(`${baseReqUrl.im}/im/group/page`,{
    "filters":{"OR": [{"ownerPlatformUid": {"EQ": req.body.customID}},{"ownerCustomID": {"EQ": req.body.customID}}]}
  });
  var owner = await axios.post(`${baseReqUrl.im}/im/contact/page`,{
    "filters":{"OR": [{"platformUid": {"EQ": req.body.customID}},{"customID": {"EQ": req.body.customID}}]}
  });

	if(data && data.status == 200 && owner && owner.status == 200){
      logger.info('群主信息:"%s"',JSON.stringify(owner.data));
      if(data.data && data.data.data.content && data.data.data.content.length > 0 && owner.data.data.content.length > 0){

        var platformGids = data.data.data.content.map(it => it.platformGid);
        var profiles = await axios.post(`${baseReqUrl.im}/im/relation/page`,{
          "filters":{
            "toPuid": {"IN":platformGids},
            "deleted": {"NE": 1}
          }
        });      
       if(profiles.data && profiles.data.data && profiles.data.data.content && profiles.data.data.content.length > 0){
          var puids = profiles.data.data.content.map(it => it.fromPuid);
          if(puids && puids.length > 0){
            //查询机器人列表
            var robots = await axios({
              method:"get"
              ,url:`${baseReqUrl.robot}/api/fadan/bot/`
              ,data: {page_size:1000}
              ,headers:{"Authorization": `Token ${req.body.token}`}
            });
            var temp = {};
            var puidsBind = {};
            for(var i = 0;i < profiles.data.data.content.length;i++){
              var puid = profiles.data.data.content[i].fromPuid;
              var pgid = profiles.data.data.content[i].toPuid;
              for(var j = 0;j < robots.data.results.length;j++){
                if(puid == robots.data.results[j].puid && robots.data.results[j].type == 4){
                  if(!temp[pgid]) temp[pgid] = 1;
                  else temp[pgid]++;
                  puidsBind[pgid] = puid;
                }
              }
            }
            logger.info('过滤后的群与淘宝机器人的数量关系:"%s"',JSON.stringify(temp));
          }
        }
        for(var i = 0;i < data.data.data.content.length;i++){
          data.data.data.content[i].nickname =  owner.data.data.content[0].nickname;
          data.data.data.content[i].hasTBKrobot = 0;
          data.data.data.content[i].banreson = "";
          data.data.data.content[i].ppuid = "";
          for(var k in temp){
            if(data.data.data.content[i].platformGid == k){
              data.data.data.content[i].hasTBKrobot = temp[k];
              data.data.data.content[i].ppuid = puidsBind[k];
            }
          }
          if(data.data.data.content[i].hasTBKrobot != 1){
             data.data.data.content[i].disabled = true;
             if(data.data.data.content[i].hasTBKrobot == 0){
              data.data.data.content[i].banreson = "群内没有已绑定的机器人";
             }
             if(data.data.data.content[i].hasTBKrobot > 1){
              data.data.data.content[i].banreson = "群内有多个已绑定的机器人";
             }
          }
        }
      }
	  	res.send(data.data.data);
	} else {
      res.send(false)
  }
});

module.exports = router;
