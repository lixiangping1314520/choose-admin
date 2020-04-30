<template>
  <div id="home">
    <div class="app_header">
      <div class="project_info">
        <span class="project_name">联通选卡后台系统</span>
      </div>
      <div class="header_right">
        <!-- <img @click="information" src="@/assets/img/userImg.png" alt=""> -->
        <span class="user_name">李香萍</span>
        <span class="dividing_line"></span>
        <span class="user_role">研发部</span>
        <span class="exit" @click="buttonexit">退出</span>
      </div>
    </div>
    <div class="aside-col">
      <el-menu
        class="menu"
        :default-active="$route.path"
        router
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>手机号码管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/phonenumber">手机号码查看</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
         <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">选卡管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/selectedcard">选卡列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
         <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">异常查询</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/abnormal">添加信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">买手表管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/Addwatch">添加买手表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
         <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">入网协议</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/Servicecontract">查看列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="main-col">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import appheader from "@/components/header";
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
       form: {
        user_name: "",
        user_card: "",
        phone_number: ""
      },
    };
  },
  components: {
    appheader
  },
  methods: {
    buttonexit() {
      	var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					// this.$cookie.delete('user') 
					_this.$router.push('/');
				}).catch(() => {

				});
    },
    changeCollapse() {
      var mainCol = document.getElementsByClassName("main-col")[0];
      console.log(mainCol)
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        mainCol.style.left = "90px";
        mainCol.style.width = "calc(100% - 110px)";
      } else {
        mainCol.style.left = "220px";
        mainCol.style.width = "calc(100% - 240px)";
      }
    }
  }
};
</script>

<style scoped lang="scss">
// #home::after{
//   content:"."; clear: both; height: 0; overflow: hidden; visibility: hidden; display: block;
// }
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
      cursor: pointer;
    }
    .user_role {
      color: rgb(181, 181, 181);
      font-size: 13px;
      cursor: pointer;
    }
    .user_name {
      cursor: pointer;
    }
    .exit {
      cursor: pointer;
    }
  }
}
.el-menu .el-menu-item-group .el-menu-item-group__title{
  padding: 0px 0 0px 0px !important;
}
// .el-menu-item-group__title{
//     padding: 0px 0 0px 0px !important;
//     line-height: normal;
//     font-size: 12px;
//     color: #909399;
// }
.menu {
  height: 100px;
}
.el-menu-item {
  text-align: left;
  border-top: 1px solid gray;
}
.el-submenu {
  width: 200px;
  text-align: left;
  border-bottom: 1px solid gray;
}
.aside-col {
  display: inline-block;
  float: left;
  width: 200px;
}
.main-col {
    display: inline-block;
    padding: 0 20px;
    width: calc(100% - 240px);
    margin-bottom: 40px;
}
</style>
