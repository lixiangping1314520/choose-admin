<template>
  <div class="addequipment">
    <div class="addequipment_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
    </div>
    <div class="addequipment_list">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="mac" label="mac地址"></el-table-column>
        <el-table-column prop="address" label="建筑物地址" ></el-table-column>
        <el-table-column prop="floor" label="建筑物楼层"></el-table-column>
        <el-table-column prop="building_type" label="建筑物类型"></el-table-column>
        <el-table-column label="设备类型">
          <template slot-scope="scope">
             <el-tag type="success" v-if="scope.row==1">网关</el-tag>
             <el-tag type="success" v-else>标签</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="设备坐标点"></el-table-column>
        <el-table-column label="操作"  width="180px">
          <template slot-scope="scope">
            <el-button disabled="disabled" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addgrouping_paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,15,20]"
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="新增楼层" :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input placeholder="请输入内容" v-model="form.name"></el-input>
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
          <el-select v-model="form.floor_id" placeholder="请选择建筑楼层">
            <el-option
              v-for="item in select_floor"
              :key="item.floor"
              :label="item.floor"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备分组" prop="group_id">
          <el-select v-model="form.group_id" placeholder="请选择分组">
            <el-option
              v-for="item in get_group"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-radio-group v-model="form.device_type">
            <el-radio :label="1">标签</el-radio>
            <el-radio :label="0" disabled="disabled">网管</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="mac地址" prop="mac">
          <el-input placeholder="请输入mac地址" v-model="form.mac"></el-input>
        </el-form-item>
        <el-form-item label="设备坐标点" prop="position">
          <el-input placeholder="请输入内容" v-model="form.position"></el-input>
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
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
export default {
  data() {
    return {
      select_floor: [],
      select_building: [],
      get_group: [],
      tableData:[],
      options: [],
      dialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      page: 1,
      form: {
        name: "",
        mac: "",
        floor_id: "",
        group_id: "",
        device_type: 1,
        position: "",
        building_id: ""
      },
      rules: {
        position: [
          { required: true, message: "请选择坐标点", trigger: "blur" }
        ],
        building_id: [
          { required: true, message: "选择建筑物", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        mac: [{ required: true, message: "请输入mac地址", trigger: "change" }],
        floor_id: [
          { required: true, message: "请选择建筑物楼层", trigger: "change" }
        ],
        group_id: [{ required: true, message: "请选择分组", trigger: "blur" }],
        device_type: [
          { required: true, message: "请选择标签", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getselect_building();
    this.allget_group();
    this.get_device();
  },
  methods: {
    //建筑物列表
    get_device(){
      let _this = this;
      _this.$httpRequest({
        path: "/device/get_device/",
        type: "post",
        args: {
          page: this.page
        },
        success: resp => {
          this.tableData = resp.data;
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
    //设备分组
    allget_group() {
      let _this = this;
      _this.$httpRequest({
        path: "/device/get_group/",
        type: "post",
        success: resp => {
          this.get_group = resp.data;
          this.dialogVisible = false;
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.page = val;
      this.get_device();
    },
    onSubmit() {
      let _this = this;
      _this.$httpRequest({
        path: "/device/add_device/",
        type: "post",
        args: this.form,
        success: resp => {
          this.$message({
            type: "success",
            message: resp.data
          });
          this.get_device();
          this.form = {
            name: "",
            mac: "",
            floor_id: "",
            group_id: "",
            device_type: 1,
            position: "",
            building_id: ""
          };
        },
        fail: error => {
          console.log(error.content);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.addequipment {
  width: 100%;
  margin-top: 20px;
  .addequipment_f {
    width: 700px;
  }
  .addequipment_list {
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
}
</style>