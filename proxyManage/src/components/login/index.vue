<template>
  <div class="login-index" ref="login_ref">
    <div class="formWrap">
      <Tabs :value="value" @on-click="c">
          <TabPane label="登录" name="login">
            <Form ref="formInline" :model="formLogin" :rules="ruleLogin" >
                <FormItem prop="user">
                    <Input type="text" v-model="formLogin.user" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formLogin.password" placeholder="Password">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
            </Form> 
            <Button type="primary" style="width: 100%;" @click="handleLogin">登录</Button>         
          </TabPane>
          <TabPane label="注册" name="reg">
            <Form ref="formReg" :model="formReg" :rules="ruleReg" >
                <FormItem prop="user">
                    <Input type="text" v-model="formReg.user" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formReg.password" placeholder="Password">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="ratio">
                    <Input type="password" v-model="formReg.ratio" placeholder="邀请码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
            </Form> 
            <Button type="primary" style="width: 100%;" @click="handleReg">注册</Button>              
          </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import options from '../../assets/js/options'
export default {
  data () {
    return {
     value:"login"
     ,formLogin: {
          user: '',
          password: ''
      }
     ,formReg: {
          user: '',
          password: ''
          ,ratio:""
      },
      ruleLogin: {
          user: [
              { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请填写密码', trigger: 'blur' },
              { type: 'string', min: 6, message: '最少6位', trigger: 'blur' }
          ]
      }
      ,ruleReg: {
          user: [
              { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请填写密码', trigger: 'blur' },
              { type: 'string', min: 6, message: '最少6位', trigger: 'blur' }
          ],
          ratio:[
            { required: true, message: '请填写邀请码', trigger: 'blur' }
          ]
      }
    }
  }
  ,methods:{
    //登录
    handleLogin:function(){
      var that = this;
      this.$refs["formInline"].validate((valid) => {
          if (!valid) {
              this.$Message.error('请完善表单!');
          } else {
            //ajax请求成功去详情页面
            //this.$router.push(`/index/pidmanage`);
            axios.post("/api/login",this.formLogin).then(function(res){
              if(res && res.status == 200 && res.data && res.data.code == 0){
                options.setCookie("key",res.data.data.key);
                that.$Message.success(res.data && res.data.msg);
                that.$router.push(`/index/pidmanage`);
              } else {
                that.$Message.error(res.data && res.data.msg);
              }
            });
          }
      })      
    }
    //注册
    ,handleReg:function(){
      var that = this;
      this.$refs["formReg"].validate((valid) => {
          if (!valid) {
              this.$Message.error('请完善表单!');
          } else {
            axios.post("/api/reg",this.formReg).then(function(res){
              if(res && res.status == 200 && res.data && res.data.code == 0){
                that.$Message.success(res.data.msg);
                that.value = "login";
              } else {
                that.$Message.error(res.data && res.data.msg);
              }
            })
          }
      })          
    }
    ,c:function(e){
      this.value = e;
    }
  }
  ,mounted:function(){
    //cover
    if(window.innerWidth < 720){
      this.$refs.login_ref.style["background-size"] = "cover";
    }
  }
}
</script>

<style scoped>
 @import './css/index.css';
</style>
