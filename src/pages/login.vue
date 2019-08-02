<template>
  <div id="login">
    <div class="login_t">
      <h1>室内导航后台系统</h1>
    </div>
    <div class="login-form-box">
      <el-form ref="form" :model="form">
        <el-form-item>
          <span>欢迎登录</span>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item class="password-item">
          <el-input v-model="form.password" placeholder="密码"   type="password"></el-input>
        </el-form-item>
        <el-form-item class="checked-item">
          <el-checkbox v-model="checked">忘记密码</el-checkbox>
      </el-form-item>
        <el-form-item class="botton_login">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    name: "login",
  data () {
      return{
        form:{
          account: 'admin',
          password:'admin',
          check:true,
        },
        checked: true,
      }
  },
  methods:{
      login () {
        this.$router.push({
          path:'/addtype'
        })
      }
  }
}
</script>

<style scoped lang="less">
#login{
  width: 100%;
  height: 100%;
  background:url(../assets/img/bg@2x.png)no-repeat;
  overflow: hidden;
  background-size:100% 100%; 
  .login_t{
    height:80px;
    width: 400px;
    padding:10px 30px;
    background-color: white;
    position: absolute;
    border-radius: 4px 4px 0 0;
    // left: 45%;
    right: 0;
    bottom: 400px;
    margin-right:40px;
    text-align: center;
  }
.login-form-box{
  height: 280px;
  width: 400px;
  padding:10px 30px 30px 30px;
  background-color: white;
  border-radius: 0 0 4px 4px;
  position: absolute;
  // left: 45%;
  right: 0;
  bottom: 100px;
  margin-right:40px;
  text-align: center;
  span{
    text-align: center;
    font-family: Arial;
    font-weight: bold;
    font-size: 23px;
  }
}
.password-item{
  margin-bottom: 5px;
}
.checked-item{
 float: left;
}
.el-button--primary{
  width: 200px;
}
.botton_login{
  width: 100%;
  clear: both;
}
  .remember{
    float: left;
  }
  }
</style>
