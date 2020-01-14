var express = require('express');
var router = express.Router();
const axios = require('axios');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");
const fs = require('fs')
const baseReqUrl = JSON.parse(fs.readFileSync(`${__dirname}/../configs/baseUrl.json`));
/* GET home page. */
router.post('/search-srv/im_group_views/page', async function(req, res, next) {
  var data = await axios.post(`${baseReqUrl.im}/im/group/page`,{
    "filters":{"OR": [{"ownerPlatformUid": {"EQ": req.body.customID}},{"ownerCustomID": {"EQ": req.body.customID}}]}
  });
  var owner = await axios.post(`${baseReqUrl.im}/im/contact/page`,{
    "filters":{"OR": [{"platformUid": {"EQ": req.body.customID}},{"customID": {"EQ": req.body.customID}}]}
  });
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
