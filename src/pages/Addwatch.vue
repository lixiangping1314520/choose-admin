<template>
  <div class="fillmap">
    <div class="fillmap_f">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="建筑名称">
          <el-input type="text" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="建筑头像">
            <div class="adatar">
          <img :src="form.avatar?form.avatar:require('../assets/img/ur.png')" alt="" >
          <input type="file" name="" accept="image/gif,image/jpeg,image/jpg,image/png" @change="fileChange">
          </div>
        </el-form-item>
        <el-form-item label="建筑类型">
          <el-select v-model="form.type" placeholder="请选择建筑类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中心点坐标">
          <!-- <span>{{userlocation.lng}},{{userlocation.lat}}</span> -->
          <el-input placeholder="请输入内容" type="text" v-model="form.center_coordinate" disabled="disabled"></el-input>
          <el-button type="primary" @click="outerVisible=true">地图选择</el-button>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input type="text" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="四个坐标点">
          <el-input placeholder="请输入内容" v-model="form.outline_coordinate" disabled="disabled"></el-input>
          <el-button type="primary" @click="dialogVisible=true">地图选择</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="展示中心点坐标地图" :visible.sync="outerVisible" :modal-append-to-body='false'>
      <div v-if="outerVisible">
        <b-map-component></b-map-component>
        <div><el-button type="primary" @click="bmapbutton">确定</el-button></div>
      </div>
      <!-- <div><P>经纬度:{{userlocation.lng}},{{userlocation.lat}}地址:{{address}} <el-button type="primary" @click="bmapbutton">确定</el-button></P></div> -->
    </el-dialog>
    <el-dialog title="展示四个坐标点地图" :visible.sync="dialogVisible" :modal-append-to-body='false'>
      <div v-if="dialogVisible">
        <Bmaplongitude></Bmaplongitude>
        <div><el-button type="primary" @click="fourlongitudebutton">确定</el-button></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import BMap from "BMap";
// import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
 import BMapComponent from './BMapComponent';
 import Bmaplongitude from './Bmaplongitude'
export default {
  data() {
    return {
      fileList: [],
      outerVisible:false,
      dialogVisible:false,
      longitude:{},
      userlocation:{},
      showMapComponent:true,
      options:[],
      form: {
        name: "",
        type: "",
        address:"",
        avatar:'',
        center_coordinate:"",
        outline_coordinate:"",
      }
    };
  },
  components: {
  BMapComponent,
  Bmaplongitude,
  },
  mounted() {
    this.select_building();
  },
  methods: {
      //建筑物类型
     select_building(){
        let _this=this;
        _this.$httpRequest({
              path: "/room/select_building_type/",
              type: "post",
              success: resp => {
                this.options=resp.data
              },
              fail: error => {
                console.log(error.content);
              }
            });     
      },
    onSubmit() {
      let _this=this;
        _this.$httpRequest({
              path: "/room/add_building/",
              type: "post",
              args:this.form,
              success: resp => {
                this.$message({
                  type: 'success',
                  message:resp.data,
                });
                this.form={
                   name: "",
                    type: "",
                    address:"",
                    avatar:'',
                    center_coordinate:"",
                    outline_coordinate:"",
                }
              },
              fail: error => {
                console.log(error.content);
              }
            }); 
    },
    cancelMap(){
    this.showMapComponent=false;
    },
    confirmMap(){
      this.showMapComponent=false;
      
    },
     //添加图片
     fileChange(e) { 
            var that = this;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                that.form.avatar  = e.target.result;
            }
            reader.readAsDataURL(file);
        },
    fourlongitudebutton(){
      var userloc=JSON.parse(this.$cookie.get('list'))
      var lise=""
      for ( var i = 0; i <userloc.length; i++){
           this.form.outline_coordinate+=userloc[i].lng+' '+userloc[i].lat+',';
        }
        this.dialogVisible=false;
    },
    bmapbutton(){
          this.form.address=this.$cookie.get('address');
          var userlocation=JSON.parse(this.$cookie.get('userlocation')||'{}');
          this.form.center_coordinate=(userlocation.lng+','+userlocation.lat);
          console.log(this.form.userlocation)
            this.outerVisible=false;
            console.log("12");
            console.log(this.$cookie.get('address'))
            console.log(JSON.parse(this.$cookie.get('userlocation')||'{}'))
         },
    handlePreview() {},
    handleRemove() {},
    goback() {
      this.$router.go(-1);
    },
  }
};
</script>

<style scoped lang="scss">
.fillmap {
  width: 100%;
  margin-top: 20px;
  #allmap {
    height: 325px !important;
    overflow: hidden;
  }
  .el-input {
    width: 400px;
    float: left;
  }
  .el-button--primary {
    margin-left: 10px;
  }
   .adatar {
        position: relative;
        width:168px;
        height:168px;
        img {
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
            border-radius: 1%;
        }
        input {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius:1%;
            outline: none;
            opacity: 0;
            cursor: pointer;
            &:focus {
                box-shadow: none;
            }
        }
   }
}
</style>

