<template>
  <div class="index_full pd5">
    <div class="tableHead">
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
    }
  }
  ,components:{
    pageS
  }
  ,methods:{
    changepage:function(page){
      this.page = page;
      this.getPageList();
    }
    ,getPageList:async function(){
      var data  = await axios.post("/api/reseller_fee",{
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
