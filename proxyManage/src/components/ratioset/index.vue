<template>
  <div class="index_full pd5">
    <div class="tableHead">
      <Input style="width: 180px;float: left;margin-right: 5px;margin-top: -1px;" v-model="alias" search enter-button="搜索" placeholder="请输入备注" @on-search="onSearch"/>
      <Button type="primary" @click="getPageList">刷新</Button> 
    </div>
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
import edit from './components/edit.vue'
export default {
    components:{
    	pageS
    	,edit
    }
	,data () {
	 var that = this;
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
              key: 'invitation_code'
          },
          {
              title: '备注',
              key: 'alias'
          },
          {
              title: '比率(%)',
              key: 'commission_rate'
              ,render:(h,params) => {
              	return h("div",params.row.commission_rate*100);
              }
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                            	that.handleEdit("commission_rate",params.row);
                            }
                        }
                    }, '修改比率'),
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                            	that.handleEdit("alias",params.row);
                            }
                        }
                    }, '修改备注')
                ]);
          }
        }
      ],
      data: []
      ,height:0
      ,pageObj:{}
      ,page:1
      ,"page-size":20
      ,alias:""
    }
  }
  ,methods:{
    onSearch:function(alias){
      if(!alias){
        this.$Message.warning("请输入备注");
        return;
      }
      //this.alias = alias;
      this.getPageList();
    }
    ,getPageList:async function(){
      var filters = {};
      if(this.alias){
      	filters.alias = {
      		"EQ":this.alias
      	}
      }
      var data  = await axios.post("/api/resellerPage",{
        pobj:{
          page:this.page
          ,page_size:this["page-size"]
          ,filters
        },
        token:options.getCookie("key")
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
      } else this.$Message.error("查询失败");
    }
    ,changepage:function(page){
      this.page = page;
      this.getPageList();
    }
    ,rowDblclick:function(row){

    }
    //处理修改,
    ,handleEdit:function(type,row){
	    var that = this;
	    var opt = {
	        render: () => {
	          var h = that.$createElement;
	            return h('edit',{props:{
	            	type,row
	            }})
	        }
	        ,width:"200px;"
	        ,loading:true
	        ,onOk:async function(comp){
	            var data = await comp.getData();
	            if(data) that.ajaxEdit(data);
	        }
	    };
	    opt = options.handle(opt);
	    this.$Modal.confirm(opt);
    }
    //ajax
    ,ajaxEdit:async function(data){
      var res  = await axios.post("/api/resellerPUT",{
        data,
        token:options.getCookie("key")
      });
      if(res.data == true){
      	this.alias = "";
      	this.$Message.success("修改成功");
      } else {
      	this.$Message.error("修改失败");
      }
      this.$Modal.remove();
      this.getPageList();
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
