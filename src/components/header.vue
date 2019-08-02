<template>
  <div class="app_header">
    <div class="project_info">
      <span class="project_name">仓库管理系统</span>
    </div>
    <div class="header_right">
      <!-- <img @click="information" src="@/assets/img/userImg.png" alt=""> -->
      <span class="user_name">{{user.name||'无'}}</span>
      <span class="dividing_line"></span>
      <span class="user_role">{{user.department||'无'}}</span>
      <span class="exit" @click="buttonexit">退出</span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show:false,
      user: {},
    }
  },
  created(){
    var user = JSON.parse(this.$cookie.get('user')||'{}')
    console.log(user)
    this.user=user
  },
  methods: {
    buttonexit(){
      	var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					this.$cookie.delete('user') 
					_this.$router.push('/login');
				}).catch(() => {

				});
    },
    information(){
      var _this = this;
      _this.$router.push('/information/information');
    },
  },
}
</script>

<style lang="scss" scoped>
.app_header {
  background: #0b223a;
  height: 60px;
  line-height: 60px;
  padding: 0 30px;
  color: white;
  .project_info {
    font-size: 20px;
    float: left;
  }
  .header_right {
    float: right;
    line-height: 60px;
    height: 60px;
    font-size: 14px;
    img {
      width: 65px;
      height: 60px;
      border-radius: 50%;
      vertical-align: top;
      cursor:pointer
    }
    .user_role {
      color: rgb(181,181,181);
      font-size: 13px;
      cursor:pointer
    }
    .user_name{
     cursor:pointer
    }
    .exit{
      cursor:pointer
    }
  }
}
</style>