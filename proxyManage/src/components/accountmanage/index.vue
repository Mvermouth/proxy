<template>
  <div class="index_full pd5 other">

		<div class="editPasswordWrap">
	        <Form ref="password" :model="formPassword" :rules="rulePassword" >
	            <FormItem prop="oldPassword">
	                <Input type="password" v-model="formPassword.oldPassword" placeholder="旧密码">
	                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
	                </Input>
	            </FormItem>
	            <FormItem prop="newPassword">
	                <Input type="password" v-model="formPassword.newPassword" placeholder="新密码">
	                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
	                </Input>
	            </FormItem>
	        </Form> 
	        <Button type="primary" style="width: 100%;" @click="handleEdit">确认修改</Button>   
		</div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  data () {
    return {
     formPassword:{
     	oldPassword:""
     	,newPassword:""
     }
     ,rulePassword:{
          oldPassword: [
              { required: true, message: '请填写旧密码', trigger: 'blur' }
          ],
          newPassword: [
              { required: true, message: '请填写新密码', trigger: 'blur' },
              { type: 'string', min: 6, message: '最少6位', trigger: 'blur' }
          ]
      }
    }
  }
  ,mounted:function(){

  }
  ,methods:{
  	handleEdit:function(){

  	}
  }
}
</script>

<style scoped>
.other{
	display: flex;
	justify-content: center;
	align-items: center;
  background: url("./images/bg.jpeg") no-repeat;
  background-size:100% 100%;
}
.editPasswordWrap{
	width: 500px;
	height:192px;
	border: 1px solid #ccc;
	border-radius: 5px;
	overflow: hidden;
	background: rgba(228, 218, 218, 0.52);
	padding: 20px;
}
</style>
