<template>
  <div>
    <div v-if="type == 'alias'">备注:<Input v-model="alias" style="width: 100%" /></div>
    <div v-if="type == 'commission_rate'">比率(%):<Input v-model="commission_rate" type="number" max="100" min="1" placeholder="请输入比率" style="width: 100%" /></div>
  </div>
</template>

<script>
import options from '../../../assets/js/options'
export default {
  props:{
    type:{
      type:String
    }
    ,row:{
      type:Object
    }
  }
  ,data () {
    return {
      alias:""
      ,commission_rate:""
    }
  }
  ,mounted:function(){
    if(this.row){
      this.alias = this.row.alias;
      this.commission_rate = this.row.commission_rate*100;
    }
  }
  ,methods:{
    getData:function(){
      if(this.type == "commission_rate"){
        var commission_rate = Number(this.commission_rate);
        if(commission_rate == NaN || commission_rate < 1 || commission_rate > 100){
          this.$Message.warning("请输入1~100以内数字");
          return false;
        }
        this.row.commission_rate = this.commission_rate/100;
      } else if(this.type == "alias"){
        if(!this.alias) {
          this.$Message.warning("请输入备注");
          return false;
        }
        this.row[this.type] = this[this.type];
      }
      return this["row"];
    }
  }
}
</script>

<style scoped>
	.test{
		width: 100px;
		height: 100px;
		background: red;
	}
</style>
