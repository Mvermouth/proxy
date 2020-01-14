<template>
  <div>
	<Page :total="pageObj.total" :current="pageObj.current" :page-size="pageObj['page-size']" @on-change="changePage" />
  </div>
</template>

<script>
export default {
  data () {
    return {
     value:1
    }
  }
  ,props:{
  	pageObj:{
  		type:Object
  	}
  }
  ,mounted:function(){

  }
  ,methods:{
  	changePage:function(page){
		 this.$emit("changepage",page);
  	}
  }
}
</script>

<style scoped>

</style>
