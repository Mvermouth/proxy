var express = require('express');
var router = express.Router();
const axios = require('axios');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");
const fs = require('fs')
const baseReqUrl = JSON.parse(fs.readFileSync(`${__dirname}/../configs/baseUrl.json`));
var uuid = require('../tools/uuid.js');
/*注册逻辑:
1.验证 邀请码是否有效 invitation_code
2.注册账号,返回id registration
3.用id和邀请码,去 reseller 接口绑定
*/
router.post('/reg', async function(req, res, next) {
  //验证邀请码
  if(req.body && req.body.ratio){
    var msg = "";
    try{
      logger.info('邀请码:"%s"',req.body.ratio);
      var data = await axios.get(`${baseReqUrl.robot}/api/tbk/invitation_code/?code=${req.body.ratio}&status=0&deleted=false`);
      logger.info('邀请码请求验证结果:"%s"',data.status);
      logger.info('邀请码结果:"%s"',JSON.stringify(data.data.results));
      if(data.status == 200 && data.data && data.data.count == 1){
        var regRes = await axios.post(`${baseReqUrl.robot}/api/auth/registration/`,{
          username:req.body.user
          ,password:req.body.password
        });
        if(regRes && regRes.status > 199 && regRes.status < 300){
          logger.info('注册请求验证结果:"%s"',regRes.status);
          logger.info('注册结果:"%s"',JSON.stringify(regRes.data));
          var user_id = regRes.data.id;
          var lastDataReq = {
            user_id,
            invitation_code:req.body.ratio
          };
          var lastRes = await axios.post(`${baseReqUrl.robot}/api/tbk/reseller/`,lastDataReq);
          if(lastRes && lastRes.status > 199 && lastRes.status < 300){
            logger.info('reseller请求验证结果:"%s"',lastRes.status);
            logger.info('reseller结果:"%s"',JSON.stringify(lastRes.data));
            res.send({
              code:0
              ,msg:"注册成功"
              ,data:lastRes.data
            });
            return;
          } else {
            logger.error('reseller验证结果:"%s"',lastRes && lastRes.status);
            msg = lastRes && lastRes.status;
          } 
        } else {
          logger.error('注册请求验证结果:"%s"',regRes && regRes.status);
          msg = regRes && regRes.status;
        } 
      } else {
        logger.error('邀请码:"%s"',req.body.ratio + "-有问题");
      }      
    } catch(e){
      logger.error('注册请求验证结果:"%s"',e);
      msg = e;
    }
  }
  res.send({
    code:-1
    ,msg:"注册失败-" + msg
  })
});

//登录
router.post("/login",async function(req, res, next){
  if(req.body && req.body.user && req.body.password){
    var sendData = {
      username:req.body.user
      ,password:req.body.password
    };
    try{
      var ress = await axios.post(`${baseReqUrl.robot}/api/auth/login/`,sendData);
      logger.info('登录请求验证结果:"%s"',ress.status);
      logger.info('登录结果:"%s"',JSON.stringify(ress.data));  
      if(ress && ress.status == 200 && ress.data && ress.data.key){
        res.send({
          code:0
          ,msg:"登录成功"
          ,data:ress.data
        })      
      }
    } catch(e){
      logger.error('登录请求验证结果:"%s"',e);
      res.send({
        code:-1
        ,msg:"登录失败-" + e
      })
    }  
  }
})

//绑定
router.post("/binding",async function(req, res, next){
  if(!req.body.token){
    res.send({code:-1});
    return;
  }
  if(req.body && req.body.data.length > 0){
    var urls = [];
    var evals = "";
    for(var i = 0;i < req.body.data.length;i++){
      var sendData = {
        rid:req.body.RID
        ,puid:req.body.data[i].ownerPlatformUid
        ,"pgid": req.body.data[i].platformGid
        ,"group_name": req.body.data[i].name
        ,"nickname":req.body.data[i].nickname
        ,ppuid:req.body.data[i].ppuid
      }     

      var params = {
         method: "post"
        ,url:`${baseReqUrl.robot}/api/tbk/binding/`
        ,data:sendData
        ,headers:{"Authorization": `Token ${req.body.token}`}       
      } 
      var ps = JSON.stringify(params);
      evals = eval(`axios(${ps})`);
      urls.push(evals);
    }

    try{ 
      var ress = await axios.all(urls);  
      res.send({
        code:0
        ,data:ress.data
      });
    } catch(e){
      logger.error('错误:"%s"绑定请求结果:"%s"',JSON.stringify(e.response.data));
      res.send({code:-1,msg:JSON.stringify(e.response.data)});
    }
  }
})
//绑定列表
router.post("/getBinding",async function(req, res, next){
    try{
      //获取reseller列表,带token过去,后端帮过滤
      var resellers = await axios({
        method: 'get'
        ,url: `${baseReqUrl.robot}/api/tbk/reseller/`
        //,data: req.body.pobj
        ,headers:{"Authorization": `Token ${req.body.token}`}
      }); 
      if(resellers && resellers.data && resellers.data.result.length == 1){
        logger.info('resellerId:"%s"',JSON.stringify(resellers.data.result[0]));
        var reseller_id = resellers.data.result[0].id;
        var ress = await axios.get(`${baseReqUrl.robot}/api/tbk/binding/?reseller_id=${reseller_id}&page_size=${req.body.pobj.page_size}&page=${req.body.pobj.page}`,{
          headers:{"Authorization": `Token ${req.body.token}`}
        });  
        res.send(ress.data);        
      } else {
        res.send(false);
      }

    }catch(e){
      logger.error('错误:"%s"绑定列表结果:"%s"',JSON.stringify(e.response.data));
      res.send(false);
    }
});
//收益列表
router.post("/getCommission_fee",async function(req, res, next){
  try{
    //获取reseller列表,带token过去,后端帮过滤
    var resellers = await axios({
      method: 'get'
      ,url: `${baseReqUrl.robot}/api/tbk/reseller/`
      //,data: req.body.pobj
      ,headers:{"Authorization": `Token ${req.body.token}`}
    });  
    if(resellers && resellers.data && resellers.data.result.length == 1){
      var reseller = resellers.data.result[0];
      req.body.pobj.reseller_id = reseller.id;
      var ress = await axios.get(`${baseReqUrl.robot}/api/tbk/tbk_relation_order/?page_size=${req.body.pobj.page_size}&page=${req.body.pobj.page}&reseller_id=${req.body.pobj.reseller_id}`,{
        headers:{"Authorization": `Token ${req.body.token}`}
      });  
      res.send(ress.data);
    }
  } catch(e){
    logger.error('错误:"%s"收益列表:"%s"',JSON.stringify(e.response.data));
    res.send({code:-1,msg:JSON.stringify(e.response.data)});
  }
});

//订单列表淘宝客
router.post("/getRelationList",async function(req, res, next){
  try{
    var ress = await axios.get(`${baseReqUrl.robot}/api/tbk/tbk_relation_order/?page_size=${req.body.pobj.page_size}&page=${req.body.pobj.page}`,{
      headers:{"Authorization": `Token ${req.body.token}`}
    });  
    res.send(ress.data);
  } catch(e){
    logger.error('错误:"%s"订单列表淘宝客:"%s"',JSON.stringify(e.response.data));
    res.send({code:-1,msg:JSON.stringify(e.response.data)});
  }
});

//创建邀请码
router.post("/createCode",async function(req,res,next){
  try{
    var resellers = await axios({
      method: 'get'
      ,url: `${baseReqUrl.robot}/api/tbk/reseller/`
      //,data: req.body.pobj
      ,headers:{"Authorization": `Token ${req.body.token}`}
    });  
    if(resellers && resellers.data && resellers.data.result.length == 1){
      var reseller = resellers.data.result[0];
      for(var i = 0;i < req.body.totel;i++){
        var code = await uuid.getUuid(req.body.token);
        logger.info(`用户 ${req.body.user} 创建邀请码:"%s"`,code);
        var params = {
          code
          ,create_by:req.body.user
          ,status:0
          ,reseller_id:reseller.id
        }
        var uuidRes = await axios({
          method: 'post'
          ,url: `${baseReqUrl.robot}/api/tbk/invitation_code/`
          ,headers:{"Authorization": `Token ${req.body.token}`}
          ,data: params
        });
      }
      res.send({
        code:0
      });
    }    
  } catch(e){
    logger.error('错误:"%s"创建邀请码:"%s"',JSON.stringify(e));
    res.send({code:-1,msg:JSON.stringify(e)});
  }
})

//邀请码列表
router.post("/getCode",async function(req, res, next){
  try{
    var resellers = await axios({
      method: 'get'
      ,url: `${baseReqUrl.robot}/api/tbk/reseller/`
      ,headers:{"Authorization": `Token ${req.body.token}`}
    });  
    if(resellers && resellers.data && resellers.data.result.length == 1){
      var reseller = resellers.data.result[0];
      var ress = await axios.get(`${baseReqUrl.robot}/api/tbk/invitation_code/?page_size=${req.body.pobj.page_size}&page=${req.body.pobj.page}&reseller_id=${reseller.id}`,{
        headers:{"Authorization": `Token ${req.body.token}`}
      });  
      if(ress.data && ress.data.results){
        var hash = {
          0:"未注册"
          ,1:"已注册"
        }
        for(var i = 0;i < ress.data.results.length;i++){
          ress.data.results[i].statusText = hash[ress.data.results[i].status];
        }
      }
      res.send(ress.data);
    } else {
      res.send(false);
    }
  } catch(e){
    logger.error('错误:"%s"邀请码列表:"%s"',JSON.stringify(e));
    res.send({code:-1,msg:JSON.stringify(e)});
  }
});

module.exports = router;
