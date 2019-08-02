<template>
  <div class="addinformation">
    <div class="addinformation_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
    </div>
    <div class="addinformation_list">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="ads_context" label="广告名称"></el-table-column>
        <el-table-column prop="address" label="建筑物地址" ></el-table-column>
        <el-table-column prop="floor_name" label="建筑物楼层"></el-table-column>
        <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
        <el-table-column label="操作"  width="180px">
          <template slot-scope="scope">
            <el-button disabled="disabled" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addinformation_paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3,5,10,15,20]"
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="新增信息推送" :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="广告名称" prop="text">
          <el-input placeholder="请输入内容" v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item label="广告图片" prop="adatar">
            <div class="adatar">
          <img :src="form.image?form.image:require('../assets/img/ur.png')" alt="" >
          <input type="file" name="" accept="image/gif,image/jpeg,image/jpg,image/png" @change="fileChange">
          </div>
        </el-form-item>
        <el-form-item label="建筑物" prop="building_id">
          <el-select v-model="form.building_id" @change="getselect_floor" placeholder="请选择建筑楼层">
            <el-option
              v-for="item in select_building"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建筑楼层" prop="floor_id">
          <el-select v-model="form.floor_id" placeholder="请选择建筑楼层" @change="getselect_device">
            <el-option
              v-for="item in select_floor"
              :key="item.floor"
              :label="item.floor"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="标签选择" prop="shop_name">
          <el-select v-model="form.shop_name" placeholder="请标签选择">
            <el-option
              v-for="item in select_device"
              :key="item.id"
              :label="item.geo_name"
              :value="item.geo_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="url地址" prop="url">
          <el-input placeholder="请输入url地址" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select_floor: [],
      select_building: [],
      get_group: [],
      tableData:[],
      select_device:[],
      options: [],
      dialogVisible: false,
      currentPage: 1,
      pageSize: 3,
      total: 0,
      num1:1,
      page: 1,
      options: [{
          value: 's',
          label: '秒'
        }, {
          value: 'm',
          label: '分钟'
        }, {
          value: 'h',
          label: '小时'
        }],
        value4: '',
      form: {
        text: "",
        shop_name: "",
        floor_id: "",
        building_id: "",
        image: "",
        url: "",
        duration:'',
      },
      rules: {
        image: [
          { required: true, message: "请选择图片", trigger: "blur" }
        ],
        url: [
          { required: true, message: "选择url地址", trigger: "blur" }
        ],
        building_id: [
          { required: true, message: "选择建筑物", trigger: "blur" }
        ],
        text: [{ required: true, message: "请输入推送广告名称", trigger: "blur" }],
        shop_name: [{ required: true, message: "请选择店铺名称", trigger: "change" }],
        floor_id: [
          { required: true, message: "请选择建筑物楼层", trigger: "change" }
        ],
        num1:[
            { required: true, message: "请选择广告时间", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    //   this.getselect_floor();
      this.getselect_building();
      this.get_ads();
  },
  methods: {
    handleDelete(index,row){
      console.log(row)
        let _this = this;
      _this.$httpRequest({
        path: "/device/delete_ads/",
        type: "post",
        args:{
               ads_id:row.ads_id
              },
        success: resp => {
           this.get_ads();
           this.$message({
                type: "success",
                message: resp.data
              });
        },
        fail: error => {
          console.log(error.content);
        }
      });
    }, 
    get_ads(){
       let _this = this;
      _this.$httpRequest({
        path: "/device/get_ads/",
        type: "post",
        args: {
          page: this.page
        },
        success: resp => {
          this.tableData = resp.data;
          this.total=resp.total;
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },

       //添加
    newgrouping() {
      this.dialogVisible = true;
    },
    //广告时间
    handleChange(value){
    //  this.form.duration=this.num1+this.value4;
    //  console.log(this.form.duration)
    },
      //建筑物
    getselect_building() {
      let _this = this;
      _this.$httpRequest({
        path: "room/select_building/",
        type: "post",
        args: {
          page: this.page
        },
        success: resp => {
          this.select_building = resp.data;
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    //建筑物楼层
    getselect_floor() {
      let _this = this;
      _this.$httpRequest({
        path: "room/select_floor/",
        type: "post",
        args: {
          building_id: this.form.building_id
        },
        success: resp => {
          this.select_floor = resp.data;
          this.total = resp.total;
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    //设备下拉框
    getselect_device(){
      let _this = this;
      _this.$httpRequest({
        path: "/location/get_destname/",
        type: "post",
        args: {
          floor_id: this.form.floor_id
        },
        success: resp => {
          this.select_device = resp.data;
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
     handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.page = val;
      this.get_ads();
    },
     //添加信息推送
     onSubmit() {
       this.form.duration=this.num1+this.value4;
       console.log(this.form.duration)
       let _this=this;
        _this.$httpRequest({
              path: "/device/add_ads/",
              type: "post",
              args:this.form,
              success: resp => {
                this.dialogVisible = false;
                this.get_ads();
                this.$message({
                  type: 'success',
                  message:resp.data,
                }); 
              },
              fail: error => {
              }
            }); 
    },
      //添加图片
     fileChange(e) { 
            var that = this;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                that.form.image  = e.target.result;
            }
            reader.readAsDataURL(file);
        },
    
  }
};
</script>

<style scoped lang="scss">
.addinformation {
  width: 100%;
  margin-top: 20px;
  .addinformation_f {
    width: 700px;
  }
  .addinformation_list {
    width: 100%;
    margin-top: 20px;
  }
  #allmap {
    height: 500px;
    overflow: hidden;
  }
  .el-input {
    width: 400px;
    float: left;
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


