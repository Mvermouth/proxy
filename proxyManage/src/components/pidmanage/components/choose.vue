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
  ,mounted:function(){

  }
  ,methods:{
    getData:async function(){
      if(!this.value) return false;
      var params = {
        filters:{
          "ownerCustomID":{"EQ":this.value}
        }
      }
      var res = await axios.post("/im/search-srv/im_group_views/page",{customID:this.value});
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
