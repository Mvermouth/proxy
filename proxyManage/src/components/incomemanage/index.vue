<template>
  <div class="index_full pd5">
    <div class="tableWrap" ref="tableWrap">
      <Table @on-row-dblclick="rowDblclick" :columns="columns" :data="data" :height="height" border></Table>
    </div>
    <div class="tablePage">
      <page-s v-on:changepage="changepage" :pageObj="pageObj"></page-s>
    </div>
  </div>
</template>

<script>
import pageS from '@/assets/components/page.vue'
const axios = require('axios');
import options from '../../assets/js/options'
export default {
  components:{
    pageS
  }
	,data () {
     return {
      columns: [
          {
              title: '淘宝订单',
              key: 'trade_id'
          },
          {
              title: '收入',
              key: 'fee'
          },
          {
              title: '创建时间',
              key: 'create_time'
          }
      ],
      data: []
      ,height:0
      ,pageObj:{}
      ,page:1
      ,"page-size":20
    }
  }
  ,methods:{
    getPageList:async function(){
      var data  = await axios.post("/api/getCommission_fee",{
        pobj:{
          page:this.page
          ,page_size:this["page-size"]
        },
        token:options.getCookie("key")
      });
      console.log(data);
      if(data.data && data.data.results && data.data.results.length > 0){
        var pageObj = {
            total:data.data.count
            ,current:this.page
            ,"page-size":this["page-size"]
        };
        this.data = data.data.results;
        this.pageObj = pageObj;
      } else this.$Message.error("查询失败");
    }
    ,changepage:function(page){
      this.page = page;
      this.getPageList();
    }
    ,rowDblclick:function(row){
      console.log(row);
    }
  }
  ,mounted:function(){
    this.$nextTick(function () {
      this.height = this.$refs.tableWrap.clientHeight;
      this.getPageList();
    })
  }
}
</script>

<style scoped>
 @import './css/index.css';
</style>
