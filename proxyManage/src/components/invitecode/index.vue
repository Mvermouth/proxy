<template>
  <div class="index_full pd5">
    <div class="tableHead">
      <Button type="primary" @click="createInviteCode">创建邀请码</Button> 
      <Button type="primary" @click="getPageList">刷新</Button> 
    </div>
    <div class="tableWrap" ref="tableWrap">
      <Table :columns="columns" :data="data" :height="height" border></Table>
    </div>
    <div class="tablePage">
      <page-s v-on:changepage="changepage" :pageObj="pageObj"></page-s>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import options from '../../assets/js/options';
import number from './components/number.vue';
import pageS from '@/assets/components/page.vue'
export default {
  data () {
    return {
      columns: [
          {
              type: 'index',
              width: 60,
              title: '序号',
              align: 'center'
          },
          {
              title: '邀请码',
              key: 'code'
          },
          {
              title: '是否注册',
              key: 'statusText'
          },
          {
              title: '创建者',
              key: 'create_by'
          },
          {
              title: '创建时间',
              key: 'create_time'
          }
      ],
      data: []
      ,pageObj:{}
      ,page:1
      ,"page-size":20     
      ,height:0
    }
  }
  ,components:{
    number
    ,pageS
  }
  ,methods:{
  	createInviteCode:function(){
        var that = this;
        var opt = {
            render: () => {
              var h = that.$createElement;
                return h('number')
            }
            ,width:"200px;"
            ,onOk:async function(comp){
              var totel = await comp.getNumber();
  			if(!totel) {
  				that.$Message.error("请输入合法数字");
  				return;
  			}
  			if(totel > 10 || totel < 1){
  				that.$Message.error("请输入1~10以内数字");
  				return;
  			}
  			that.createCode(totel);
            }
        };
        opt = options.handle(opt);
        this.$Modal.confirm(opt);
  	}
  	,createCode:async function(totel){
  		var res = await axios.post("/api/createCode",{totel,token:options.getCookie("key"),user:options.getCookie("user")});
      if(res && res.data && res.data.code == 0){
        this.$Message.success("创建成功");
      } else {
        this.$Message.error("创建失败");
      }
      this.getPageList();
  	}
    ,changepage:function(page){
      this.page = page;
      this.getPageList();
    }
    ,getPageList:async function(){
      var data  = await axios.post("/api/getCode",{
        pobj:{
          page:this.page
          ,page_size:this["page-size"]
        },
        token:options.getCookie("key")
      });
      if(data.data && data.data.results && data.data.results.length > 0){
        var pageObj = {
            total:data.data.count
            ,current:this.page
            ,"page-size":this["page-size"]
        };
        this.data = data.data.results;
        this.pageObj = pageObj;
      } else if(data.data && data.data.results && data.data.results.length == 0){
         this.$Message.warning("没有数据");
      } else {
        this.$Message.error("查询失败");
      }
    }
  }
  ,mounted:function(){
    this.$nextTick(async function () {
      this.height = this.$refs.tableWrap.clientHeight;
      this.getPageList();
    })
  }
}
</script>

<style scoped>
 @import './css/index.css';
</style>
