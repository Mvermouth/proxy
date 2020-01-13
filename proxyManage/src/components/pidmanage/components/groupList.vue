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
              title: '群名',
              key: 'name'
          },
          {
              title: '群成员',
              key: 'memberCount'
          }
      ],
      data: []
      ,height:"500px"
      ,selections:[]
    }
  }
  ,mounted:function(){
	console.log(this.rows);
	this.$nextTick(function () {
		this.data = this.rows;
		// if(this.rows && this.rows.length > 0){
		// 	for(var i = 0;i < this.rows.length;i++){
		// 		this.data.push(this.rows[i].group);
		// 	}
		// }
	})
  }
  ,methods:{
  	select:function(selections,row){
		console.log(selections);
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
