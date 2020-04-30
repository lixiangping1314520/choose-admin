<template>
<div class="selectedcard">
  <div class="selectedcard_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
  </div>
  <div class="selectedcard_list">
    <el-table
    :data="tableData"
    style="width:100%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="user_name"
      label="姓名"
      width="180">
    </el-table-column>
     <el-table-column
      prop="user_card"
      label="身份证"
      width="180">
    </el-table-column>
     <el-table-column
      prop="phone_number"
      label="联系号码"
      width="180">
    </el-table-column>
    <el-table-column
      prop="number"
      label="新卡"
      width="180">
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          disabled="disabled"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="selectedcard_paging">
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,15,20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      >
    </el-pagination>
  </div>
  <el-dialog title="选卡提交表单" :visible.sync="dialogFormVisible">
  <el-form :model="form" :rules="rules">
    <el-form-item label="联系人" :label-width="formLabelWidth" prop="user_name">
      <el-input v-model="form.user_name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="新卡号码" :label-width="formLabelWidth" prop="user_number">
      <el-input v-model="form.number" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="身份证" :label-width="formLabelWidth" prop="user_card">
      <el-input v-model="form.user_card" auto-complete="off"></el-input>
    </el-form-item>
     <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone_number">
      <el-input v-model="form.phone_number" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="selectedcardsubmit">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>
<script>
import { isvalidPhone,isvalidname,isvalidcard} from "../assets/js/validate";
var validcard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (!isvalidcard(value)) {
    callback(new Error("请输入正确的身份证号码"));
  } else {
    callback();
  }
};
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
var validname = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入姓名"));
  } else if (!isvalidname(value)) {
    callback(new Error("请输入正确中文姓名"));
  } else {
    callback();
  }
};
export default {
    data(){
        return{
           form: {
              number:'',
              user_name:'',
              user_card:'',
              phone_number:'',
           },
        formLabelWidth: '120px',
          tableData: [],
          currentPage: 1,
          pageSize: 5,
          total:0,
          dialogFormVisible: false,
          page:1,
          rules: {
        phone_number: [
          { required: true, trigger: "blur", validator: validPhone },
        ],
        number: [
          { required: true, trigger: "blur", validator: validPhone },
        ],
         user_name: [
          { required: true, trigger: "blur", validator: validname },
        ],
         user_card: [
          { required: true, trigger: "blur", validator: validcard },
        ],
      }
        }
    },
    mounted(){
      this.findAll();
    },
    methods:{
      handleDelete(index,row){
    
      },
      //分页获取卡号信息
      findAll() {
      let _this = this;
      _this.$httpRequest({
        path: "/phone/findAll/",
        type: "get",
        args: {
          page: this.page
        },
        success: resp => {
          if (resp.data.msg== "选号信息查询成功") {
            console.log(resp.data.totol)
           this.tableData=resp.data.date.phone;
           this.total=parseInt(resp.data.totol);
          } else {
          }
        }
      });
    },
    //新增啊卡号
      selectedcardsubmit(){
        let _this = this;
      _this.$httpRequest({
        path: "/phone/addNumber/",
        type: "post",
        args: {
          user_name: this.form.user_name,
          user_card: this.form.user_card,
          phone_number: this.form.phone_number,
          number: this.form.number
        },
        success: resp => {
          console.log(resp.msg)
          if (resp.msg != "ok") {
            this.$message({
              type: "success",
              message: resp.msg
            });
          } else {
            this.findAll();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "信息添加成功"
            });
          }
        },
        fail: error => {
          console.log(error.content);
        }
      });
      },
       // 分页
     handleSizeChange(val) {
      },
      handleCurrentChange(val) {
        this.page=val
        this.findAll();
      },
      newgrouping(){
          this.dialogFormVisible=true;
      },
    }
    
}
</script>
<style scoped lang="scss">
.selectedcard{
    width: 100%;
    margin-top: 20px;
    .selectedcard_add{
        width: 100%;
    }
    .selectedcard_list{
        width: 100%;
        margin-top: 20px;
    }
    .selectedcard_paging{
        width: 100%;
        margin-top: 20px;
    }
}
</style>