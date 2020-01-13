var express = require('express');
var router = express.Router();
const axios = require('axios');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");
const baseReqUrl = "http://47.106.70.21:8000"
/*注册逻辑:
1.验证 邀请码是否有效 invitation_code
2.注册账号,返回id registration
3.用id和邀请码,去 reseller 接口绑定
*/
router.post('/reg', async function(req, res, next) {
  //验证邀请码
  if(req.body && req.body.ratio){
    logger.info('邀请码:"%s"',req.body.ratio);
    var data = await axios.get(`${baseReqUrl}/api/tbk/invitation_code/?code=${req.body.ratio}&status=0&deleted=false`);
    console.log(data.data);
    logger.info('邀请码请求验证结果:"%s"',data.status);
    if(data.status == 200 && data.data && data.data.count == 1){
      logger.info('邀请码结果:"%s"',JSON.stringify(data.data.results));
      try{
        var regRes = await axios.post(`${baseReqUrl}/api/auth/registration/`,{
          username:req.body.user
          ,password:req.body.password
        });
        console.log(regRes);
        if(regRes && regRes.status > 199 && regRes.status < 300){
          logger.info('注册请求验证结果:"%s"',regRes.status);
          logger.info('注册结果:"%s"',JSON.stringify(regRes.data));
          var user_id = regRes.data.id;
          var lastDataReq = {
            user_id,
            invitation_code:req.body.ratio
          };
          var lastRes = await axios.post(`${baseReqUrl}/api/tbk/reseller/`,lastDataReq);
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
          } 
        } else {
          logger.error('注册请求验证结果:"%s"',regRes && regRes.status);
        }        
      } catch(e){
        logger.error('注册请求验证结果:"%s"',e);
      }
      console.log();
    } else {
      logger.error('注册请求验证结果:"%s"',data.status);
    }
  }
  //res.send("999")
    res.send({
      code:-1
      ,msg:"注册失败"
    })
});

//登录
router.post("/login",async function(req, res, next){
  console.log(req.body);
  if(req.body && req.body.user && req.body.password){
    var sendData = {
      username:req.body.user
      ,password:req.body.password
    };
    console.log(sendData);
    try{
      var ress = await axios.post(`${baseReqUrl}/api/auth/login/`,sendData);
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
        ,msg:"登录失败"
      })
    }  
  }
})

//绑定
router.post("/binding",async function(req, res, next){
  console.log(req.body.data);
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
      }     
      var params = {
         method: "post"
        ,url:`${baseReqUrl}/api/tbk/binding/`
        ,data:sendData
        ,headers:{"Authorization": `Token ${req.body.token}`}       
      } 
      var ps = JSON.stringify(params);
      evals = eval(`axios(${ps})`);
      urls.push(evals);


      console.log("_______________________________________________________")
      console.log(sendData);
      // var ress = await axios.post(`${baseReqUrl}/api/tbk/binding/`,sendData,{
      //   "headers":{"Authorization": "Token 103e731394e08daf185621326fb42f38a2e2abbf"}
      // });
      // try{
        // var ress = await axios({
        //           method: 'post'
        //           ,url: `${baseReqUrl}/api/tbk/binding/`
        //           ,data: sendData
        //           ,headers:{"Authorization": `Token ${req.body.token}`}
        //         });    
      //   //         //console.log(ress);
      //   //         console.log(ress.data);  
      //   var ress = await axios.all(urls);  
      // } catch(e){
      //   console.log(e);
      //   logger.error('错误:"%s"绑定请求结果:"%s"',JSON.stringify(e.response.data));
      // }
    }

    try{ 
      var ress = await axios.all(urls);  
      console.log(ress);
      res.send({
        code:0
        ,data:ress.data
      });
    } catch(e){
      console.log(e);
      logger.error('错误:"%s"绑定请求结果:"%s"',JSON.stringify(e.response.data));
      res.send({code:-1,msg:JSON.stringify(e.response.data)});
    }


    // console.log(sendData);
    // // var ress = await axios.post(`${baseReqUrl}/api/tbk/binding/`,sendData);
    // res.send("999");
  }
})
//绑定列表
router.post("/getBinding",async function(req, res, next){
    console.log(req.body);
    var ress = await axios({
      method: 'get'
      ,url: `${baseReqUrl}/api/tbk/binding/`
      ,data: req.body.pobj
      ,headers:{"Authorization": `Token ${req.body.token}`}
    });    
    console.log(ress.data);
    res.send(ress.data);
});
//收益列表
router.post("/getCommission_fee",async function(req, res, next){
    console.log(req.body);
  try{
    //获取reseller列表,带token过去,后端帮过滤
    var resellers = await axios({
      method: 'get'
      ,url: `${baseReqUrl}/api/tbk/reseller/`
      //,data: req.body.pobj
      ,headers:{"Authorization": `Token ${req.body.token}`}
    });  
    if(resellers && resellers.data && resellers.data.result.length == 1){
      var reseller = resellers.data.result[0];
      console.log(resellers.data); 
      req.body.pobj.user_id = reseller.user_id;
      var ress = await axios({
        method: 'get'
        ,url: `${baseReqUrl}/api/tbk/commission_fee/`
        ,data: req.body.pobj
        ,headers:{"Authorization": `Token ${req.body.token}`}
      });    
      console.log(ress.data);
      res.send(ress.data);
    }
  } catch(e){
    res.send({code:-1,msg:JSON.stringify(e.response.data)});
  }
});


module.exports = router;
