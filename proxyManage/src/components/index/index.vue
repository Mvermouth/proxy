<template>
  <div class="index_full flex" ref="indexBoard">
    <div class="menu" ref="menu_bar">
        <Menu theme="dark" active-name="manage-pidmanage" :open-names="['manage']" width="100%" @on-select="onselect">
            <Submenu name="manage">
                <template slot="title">
                    <Icon type="ios-paper" />
                    管理
                </template>
                <MenuItem name="manage-pidmanage">pid管理</MenuItem>
                <MenuItem name="manage-invitecode">邀请码</MenuItem>
                <MenuItem name="manage-incomemanage">收益列表</MenuItem>
                <MenuItem name="manage-revenueshare">收益分成</MenuItem>
                <!-- <MenuItem name="manage-ownerincome">群主收益</MenuItem> -->
<!--                 <MenuItem name="manage-relations_order">淘宝订单</MenuItem> -->
            </Submenu>
<!--             <Submenu name="account">
                <template slot="title">
                    <Icon type="ios-paper" />
                    账号管理
                </template>
                <MenuItem name="account-accountmanage">修改密码</MenuItem>
            </Submenu> -->
        </Menu>
    </div>
    <div v-if="!isWin" class="menu-phone">
      <Icon type="md-menu" class="menu-phone-icon" @click="showMenu"/>
    </div>
    <div class="content" ref="content">
       <router-view style="width: 100%;height: 100%;"></router-view>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import options from '../../assets/js/options';
export default {
  data () {
    return {
      currModule:"manage-pidmanage"
      ,isWin:true
    }
  }
  ,methods:{
    onselect:function(name){
      this.isHideMenu();
      if(name == this.currModule) return;
      this.currModule = name;
      var url = name.split("-")[1];
      this.$router.push(`/index/${url}`);
    }
    ,showMenu:function(){
      this.$refs.menu_bar.style.left = "0px";
    }
    ,isHideMenu:function(){
      if(this.isWin == false){
        this.$refs.menu_bar.style.left = "-200px";
      }
    }
    ,judgeIsPhone:function(){
      if(window.innerWidth < 720){
        this.isWin = false;
        this.setPhone();
      } else {

      }
    }
    ,setPhone:function(){
      this.$refs.content.style.width = "100%";
      this.$refs.content.style.height = "calc(100% - 50px)";
      this.$refs.indexBoard.className = "index_full";
      this.$refs.menu_bar.className = "menu posi";
    }
  }
  ,mounted:function(){
    if(!options.getCookie("key")){
      this.$router.push(`/login`);
    }
    this.judgeIsPhone();
  }
}
</script>


<style scoped>
 @import './css/index.css';
</style>
