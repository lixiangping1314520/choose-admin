<template>
  <div class="lookmap">
    <div class="addgrouping_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
    </div>
    <div class="lookmap_list">
      <el-table :data="tableData" style="width:60%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="user_name" label="联系人"></el-table-column>
        <el-table-column prop="phone_number" label="联系电话"></el-table-column>
        <el-table-column prop="user_card" label="身份证号码"></el-table-column>
      </el-table>
    </div>
    <div class="lookmap_paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,15,20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="添加手表" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.user_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户身份证号" :label-width="formLabelWidth">
          <el-input v-model="form.user_card" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户联系方式" :label-width="formLabelWidth" prop="phone_number">
          <el-input v-model="form.phone_number" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="Watchsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isvalidPhone } from "../assets/js/validate";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      tableData: [],
      form: {
        user_name:"",
        user_card:"",
        phone_number:""
      },
      dialogVisible: false,
      formLabelWidth: "120px",
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogFormVisible: false,
      page: 1,
      rules: {
        phone_number: [
          { required: true, trigger: "blur", validator: validPhone }
        ]
      }
    };
  },
  mounted() {
    this.findAll();
  },
  methods: {
    //获取手表列表
    findAll() {
      let _this = this;
      _this.$httpRequest({
        path: "/watch/findAll/",
        type: "get",
        args: {
          page: this.page
        },
        success: resp => {
          if (resp.data.msg== "手表信息查询成功") {
           this.tableData=resp.data.date.watch;
           this.total=parseInt(resp.data.totol);
          } else {
          }
        }
      });
    },
    //手表提交
    Watchsubmit() {
      let _this = this;
      _this.$httpRequest({
        path: "/watch/addWatch/",
        type: "post",
        args: {
          user_name: this.form.user_name,
          user_card: this.form.user_card,
          phone_number: this.form.phone_number
        },
        success: resp => {
          if (resp.msg== "手表信息查询成功") {
            this.findAll();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "信息添加成功"
            });
          } else {
            this.$message({
              type: "success",
              message: resp.msg
            });
          }
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    // 分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.page = val;
      this.findAll();
    },
    newgrouping() {
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style scoped lang="scss">
.lookmap {
  width: 100%;
  margin-top: 20px;
  .lookmap_add {
    width: 100%;
  }
  .lookmap_list {
    width: 100%;
    margin-top: 20px;
  }
  .lookmap_paging {
    width: 100%;
    margin-top: 20px;
    float: right;
  }
  .map {
    height: 300px;
    width: 700px;
    margin: 0 auto;
  }
}
</style>