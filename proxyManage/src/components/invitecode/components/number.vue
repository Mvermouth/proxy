<template>
  <div>
	   数量:<Input v-model="value" style="width: 100%" type="number" max="10" min="1" placeholder="请输入数量"/>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  data () {
    return {
     value:1
    }
  }
  ,methods:{
  	getNumber:function(){
  		var totel = Number(this.value);
  		if(totel != NaN){
  			return totel;
  		} else return null;
  	}
  }
  ,mounted:function(){

  }
}
</script>

<style scoped>

</style>
