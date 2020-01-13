var express = require('express');
var router = express.Router();
const axios = require('axios');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");

/* GET home page. */
router.post('/search-srv/im_group_views/page', async function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req.body);
  //res.send("999")
  console.log("123");
//  axios.post('http://120.77.202.187:5765/search-srv/im_group_views/page',{"filters":{"AND":[{"OR":[]},{"group.memberCount":{"NE":0}},{"tenantId":{"EQ":"dc90ef20143f437e8144b827c19ec6ea"}}]},"pageNo":1,"pageSize":20,"sort":[{"ignoreCase":false,"property":"ctime","type":"DSC"}]}
// )
//   .then(function (re) {
//       //console.log(re);
//       console.log("ppp");
      // if(re && re.status == 200){
      // 	console.log(re.data);
      // }
//       res.send(re.data)
//   })
//   .catch(function (error) {

//   });
	//var data = await axios.post('http://120.77.202.187:5765/search-srv/im_group_views/page',req.body.params);
  var data = await axios.post('http://120.77.202.187:6111/im/group/page',{
    "filters":{"OR": [{"ownerPlatformUid": {"EQ": req.body.customID}},{"ownerCustomID": {"EQ": req.body.customID}}]}
  });
  var owner = await axios.post('http://120.77.202.187:6111/im/contact/page',{
    "filters":{"OR": [{"platformUid": {"EQ": req.body.customID}},{"customID": {"EQ": req.body.customID}}]}
  });
  //req.body.customID
	console.log(data.data);
  console.log(owner.data);
	if(data && data.status == 200 && owner && owner.status == 200){
      logger.info('群主信息:"%s"',JSON.stringify(owner.data));
      if(data.data && data.data.data.content && data.data.data.content.length > 0 && owner.data.data.content.length > 0){
        for(var i = 0;i < data.data.data.content.length;i++){
          data.data.data.content[i].nickname =  owner.data.data.content[0].nickname;
        }
      }
	  	res.send(data.data.data);
	} else {
      res.send(false)
  }
});

module.exports = router;
