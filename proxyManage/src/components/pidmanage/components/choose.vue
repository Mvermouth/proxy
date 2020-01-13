<template>
  <div>
	   群主微信号:<Input v-model="value" style="width: 100%" />
     RID:<Input v-model="RID" style="width: 100%" />
  </div>
</template>

<script>
const axios = require('axios');
export default {
  data () {
    return {
      value:""
      ,RID:""
    }
  }
/*
{"filters":{"AND":[{"group.ownerCustomID":{"LIKE":"xiangshu86"}},{"OR":[]},{"group.memberCount":{"NE":0}},{"tenantId":{"EQ":"dc90ef20143f437e8144b827c19ec6ea"}}]},"pageNo":1,"pageSize":20,"sort":[{"ignoreCase":false,"property":"ctime","type":"DSC"}]}

*/

  ,mounted:function(){
//     var that = this;
//     axios.post('/im/search-srv/im_group_views/page',{"filters":{"AND":[{"group.ownerCustomID":{"LIKE":"xiangshu86"}},{"OR":[]},{"group.memberCount":{"NE":0}}]},"pageNo":1,"pageSize":20,"sort":[{"ignoreCase":false,"property":"ctime","type":"DSC"}]}
// )
//       .then(function (res) {
//           console.log(res);
//           //that.$emit("test",res);
//       })
//       .catch(function (error) {

//       });
  }
  ,methods:{
    getData:async function(){
      if(!this.value) return false;
      // var params = {"filters":{"AND":[{"group.ownerCustomID":{"LIKE":this.value}},{"OR":[]},{"group.memberCount":{"NE":0}}]},"pageNo":1,"pageSize":1000,"sort":[{"ignoreCase":false,"property":"ctime","type":"DSC"}]}
      var params = {
        filters:{
          "ownerCustomID":{"EQ":this.value}
        }
      }
      var res = await axios.post("/im/search-srv/im_group_views/page",{customID:this.value});

      console.log(res);

      return res;
    }
    ,getRID:function(){
      return this.RID;
    }
  }
}
</script>

<style scoped>
	.test{
		width: 100px;
		height: 100px;
		background: red;
	}
</style>
