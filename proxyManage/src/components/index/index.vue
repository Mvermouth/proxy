<template>
  <div class="index_full flex">
    <div class="menu">
        <Menu theme="dark" active-name="manage-pidmanage" :open-names="['manage']" width="100%" @on-select="onselect">
            <Submenu name="manage">
                <template slot="title">
                    <Icon type="ios-paper" />
                    管理
                </template>
                <MenuItem name="manage-pidmanage">pid管理</MenuItem>
                <MenuItem name="manage-incomemanage">收益列表</MenuItem>
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
    <div class="content">
       <router-view style="width: 100%;height: 100%;"></router-view>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  data () {
    return {
      currModule:"manage-pidmanage"
    }
  }
  ,methods:{
    onselect:function(name){
      if(name == this.currModule) return;
      this.currModule = name;
      var url = name.split("-")[1];
      this.$router.push(`/index/${url}`);
    }
  }
  ,mounted:function(){

  }
}
</script>


<style scoped>
 @import './css/index.css';
</style>
