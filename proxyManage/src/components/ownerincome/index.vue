<template>
  <div class="index_full pd5">
    <div class="tableHead">
      <Input style="width: 180px;float: left;margin-right: 5px;margin-top: -1px;" search enter-button="搜索" placeholder="请输入RID" @on-search="onSearch"/>
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
              title: '订单号',
              key: 'trade_id'
          },
          {
              title: '收益',
              key: 'fee'
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
      ,RID:""
    }
  }
  ,components:{
    pageS
  }
  ,methods:{
    onSearch:function(RID){
      console.log(RID);
      if(!RID){
        this.$Message.warning("请输入RID");
        return;
      }
      this.RID = RID;
      this.getPageList();
    }
  	,changepage:function(page){
      this.page = page;
      this.getPageList();
    }
    ,getPageList:async function(){
      if(!this.RID) {
        this.$Message.warning("请输入RID");//2276974690
        return;
      }
      var data  = await axios.post("/api/relation_fee",{
        pobj:{
          page:this.page
          ,page_size:this["page-size"]
          ,filters:{
            rid:{
              EQ:this.RID
            }
          }
        }
        //token:options.getCookie("key")
      });
      if(data.data && data.data.content && data.data.content.length > 0){
        var pageObj = {
            total:data.data.total
            ,current:this.page
            ,"page-size":this["page-size"]
        };
        this.data = data.data.content;
        this.pageObj = pageObj;
      } else if(data.data && data.data.content && data.data.content.length == 0){
         this.data = [];
         this.pageObj = {};
         this.$Message.warning("没有数据");
      } else {
         this.data = [];
         this.pageObj = {};
         this.$Message.error("查询失败");
      }
    }
  }
  ,mounted:function(){
    this.$nextTick(async function () {
      this.height = this.$refs.tableWrap.clientHeight;
      //this.getPageList();
    })
  }
}
</script>

<style scoped>
 @import './css/index.css';
</style>
