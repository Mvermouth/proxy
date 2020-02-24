<template>
  <div>
	 <Table :columns="columns" :data="data" :height="height" border></Table>
  </div>
</template>

<script>
const axios = require('axios');
export default {
   props:{
   	rows:{
   		type:Array 
   	}
   }
  ,data () {
    return {
      currentChoose:""
      ,columns: [{
            title: '选择',
            key: 'id',
            width: 70,
            align: 'center',
            render: (h, params) => {
              let id = params.row.id;
              let disabled = params.row.disabled;
              let flag = false;
              if (this.currentChoose === id) {
                flag = true
              } else {
                flag = false
              }
              let self = this
              return h('div', [
                h('Radio', {
                  props: {
                    value: flag
                  },
                  attrs:{
                    disabled
                  },
                  on: {
                    'on-change': () => {
                      self.currentChoose = id;
                      self.selections = [params.row];
                    }
                  }
                })
              ])
            }
          },
          {
              title: '禁选原因',
              key: 'banreson'
          },          
          {
              title: '群名',
              key: 'name'
          },
          {
              title: '群成员',
              key: 'memberCount'
          }
      ],
      data: []
      ,height:500
      ,selections:[]
    }
  }
  ,mounted:function(){
  	this.$nextTick(function () {
  		this.data = this.rows;
  	})
  }
  ,methods:{
  	select:function(selections,row){
		  this.selections = selections;
  	}
  	,getSelections:function(){
  		return this.selections;
  	}
  }
}
</script>

<style scoped>

</style>
