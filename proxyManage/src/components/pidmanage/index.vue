<template>
  <div class="index_full pd5">
    <div class="tableHead">
      <Button type="primary" @click="createRelation">创建关系</Button> 
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
import pageS from '@/assets/components/page.vue'
import choose from './components/choose.vue'
import groupList from './components/groupList.vue'
const axios = require('axios');
import options from '../../assets/js/options'
//Vue.component('choose',choose);
export default {
  components:{
    choose
    ,pageS
    ,groupList
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
              title: '群名',
              key: 'group_name'
          },
          {
              title: '群主微信名',
              key: 'nickname'
          },
          {
              title: '群主微信号',
              key: 'puid'
          },
          {
            title:"RID"
            ,key:"rid"
          },
          {
              title: '创建时间',
              key: 'create_time'
          }
      ],
      data: []
      ,height:0
      ,allocationModal:false
      ,pageObj:{}
      ,page:1
      ,"page-size":20
    }
  }
  ,methods:{
    createRelation:function(){
      //this.allocationModal = true;
      //xiangshu86

      /*
客户wxid去查,小助手的群且包含这个wxid,获得群列表,
绑定 群名,id,rid
      */
      var that = this;
      var opt = {
          render: () => {
            var h = that.$createElement;
              return h('choose')
          }
          ,width:"200px;"
          ,loading:true
          ,onOk:async function(comp){
            var data = await comp.getData();
            var RID = await comp.getRID();
            this.$children[0].$children[2].loading = false;
            console.log(data);
            console.log(that.$Modal);
            console.log(that);
            console.log(this)
            // console.log(this.$children[0].$children[2].loading);
            // this.$children[0].$children[2].loading = false;
            // const vm = that.vmInstances.find(it => it.$children[0].classes && typeof (it.$children[0].classes) === 'string' && it.$children[0].classes.endsWith('-modal'))
            // console.log(vm);
            //that.$Modal.props.value = false
            // that.$nextTick(() => {that.l = false});
            // setTimeout(() => {
            //     this.loading=false;
            //     that.l = false
            // }, 100);
            //debugger;
            //that.$Modal.remove()
            if(data == false || !RID){
              that.$Message.error("请输入");
            } else {
              if(data && data.data && data.data.content && data.data.content.length > 0){
                that.showGroupLists(data.data.content,RID);
              } else that.$Message.error("查询失败");
            }
          }
      };
      opt = options.handle(opt);
      this.$Modal.confirm(opt);
    }
    ,changepage:function(page){
      console.log("pppppppp");
      console.log(page);
      this.page = page;
      this.getPageList();
    }
    ,showGroupLists:function(rows,RID){
      var that = this;
      this.$Modal.remove();
      var opt = {
          render: () => {
            var h = that.$createElement;
              return h('groupList',{props:{
                rows
              }})
          }       
          ,width:"800px;" 
          ,onOk:async function(comp){
            var data = comp.getSelections();
            if(data && data.length > 0){
              var temp =  {data,RID,token:options.getCookie("key")};
              var res = await axios.post("/api/binding",temp);
              if(res && res.data && res.data.code == 0){
                that.$Message.success("绑定成功");
                that.getPageList();
              } else {
                that.$Message.error(res.data.msg);
              }
              console.log(res);
            }

          }
      }
      opt = options.handle(opt);
      this.$nextTick(function () {
        setTimeout(()=>{
          this.$Modal.confirm(opt);
        },300);
      });
    }
    ,getPageList:async function(){
      var data  = await axios.post("/api/getBinding",{
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
