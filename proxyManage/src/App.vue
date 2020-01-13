<template>
  <div id="app" ref="app">
    <router-view/>
  </div>
</template>

<script>
import options from './assets/js/options'
export default {
  name: 'App'
  ,mounted:function(){
  	this.$refs.app.style.height = window.innerHeight + "px";
  	this.$refs.app.style.width = window.innerWidth + "px";
    //本地储存用户信息?
    if(!options.getCookie("key")){
      this.$router.push(`/login`);
    }
  }
}
</script>

<style>
@import './assets/css/gloabCss.css';
#app{
	overflow: hidden;
	position:relative;
}
</style>
