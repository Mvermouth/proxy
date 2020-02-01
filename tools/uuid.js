const fs = require('fs')
const baseReqUrl = JSON.parse(fs.readFileSync(`${__dirname}/../configs/baseUrl.json`));
var uuid = {};
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
const axios = require('axios');
uuid.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
}

uuid.getUuid = async function(token){
  //&code=${uuid_}
	var uuid_ = this.uuid(6,16);
	console.log("uuid_:" + uuid_);
  //uuid_ = "5738F9";
	var res = await axios.get(`${baseReqUrl.robot}/api/tbk/invitation_code/?page_size=1000&page=1&code=${uuid_}`,{
      headers:{"Authorization": `Token ${token}`}
  }); 
  // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`");
  // console.log(res);
  if(res && res.data && res.data.results.length == 0){

  } else {
	  uuid_ = await this.getUuid(token);
  }
  return uuid_;
}

module.exports = uuid;