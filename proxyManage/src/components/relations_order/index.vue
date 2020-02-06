<template>
  <div class="index_full pd5">
    <div class="tableWrap" ref="tableWrap">
      <Table :columns="columns" :data="data" :height="height" border></Table>
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
   props:{
    row:{
      type:Object 
    }
   }
  ,components:{
    pageS
  }
	,data () {
     return {
      columns: [
          {
              type: 'index',
              width: 60,
              title: '序号',
              align: 'center'
          },
          {
              title: '标题',
              key: 'item_title',
              width: 230
          },
          {
              title: '商品图片',
              key: 'item_img',
              width:100,
              render:(h,params) =>{
                return h("img",{
                  attrs:{
                    src:params.row.item_img
                    ,width:100
                    ,height:100
                  }
                })
              }
          },
          {
              title: '付款预估收入',
              key: 'pub_share_pre_fee'
          },
          {
              title: '订单状态',
              key: 'tk_status_text'
          },
          {
              title: '原价格',
              key: 'item_price'
          },
          {
              title: '付款价格',
              key: 'alipay_total_price'
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
      var data  = await axios.post("/api/getRelationList",{
        pobj:{
          page:this.page
          ,page_size:this["page-size"]
          ,"relation_id":this.row.rid
        },
        token:options.getCookie("key")
      });
      if(data.data && data.data.results && data.data.results.length > 0){
        var pageObj = {
            total:data.data.count
            ,current:this.page
            ,"page-size":this["page-size"]
            ,rid:this.row.rid
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
