<template>
<div class="abnormal">
  <!-- <div class="abnormal_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
  </div> -->
  <div class="abnormal_list">
    <el-table
    :data="tableData"
    style="width: 100%">
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
      prop="second_number"
      label="选卡人联系方式"
      width="180">
    </el-table-column>
    <el-table-column
      prop="first_number"
      label="新卡号码"
      width="180">
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">提交</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="abnormal_paging">
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
</div>
</template>
<script>
export default {
    data(){
        return{
          tableData: [],
          currentPage: 1,
          pageSize: 5,
          total:0,
          page:1,
          form: {
        user_name: "",
        user_card: "",
        phone_number: ""
      },
          dialogFormVisible:false,
          formLabelWidth: "120px",
        }
    },
    mounted(){
     this.findAll();
    },
    methods:{
       findAll() {
      let _this = this;
      _this.$httpRequest({
        path: "/abnormal/findAll/",
        type: "get",
        args: {
          page: this.page
        },
        success: resp => {
          if (resp.data.msg== "异常信息查询成功") {
            console.log(resp.data.date.abnormal)
           this.tableData=resp.data.date.abnormal;
           this.total=parseInt(resp.data.totol);
          } else {
          }
        }
      });
    },
    handleEdit(index,row){
      console.log(row)
        let _this=this;
        //  this.$prompt('请输入理由', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(({ value }) => {
           _this.$httpRequest({
              path: "/abnormal/insertabnormal",
              type: "get",
              args:{
                id:row.id,
              },
              success: resp => {
                if(resp.data.msg=='异常信息删除成功'){
                  this.$message({
                      type: 'success',
                      message:resp.data.msg,
                    });
                  _this.findAll();
                }else{
                  this.$message({
                      type: 'success',
                      message:resp.data.msg,
                    });
                }
              },
              fail: error => {
                console.log(error.content);
              }
            });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消输入'
        //   });       
        // });
    },
      handleDelete(index,row){
        let _this=this;
        _this.$httpRequest({
              path: "/abnormal/delabnormal/",
              type: "get",
              args:{
                first_number:row.first_number
              },
              success: resp => {
                if(resp.data.msg=='异常信息删除成功'){
                  this.$message({
                      type: 'success',
                      message:resp.data.msg,
                    });
                  _this.findAll();
                }else{
                  this.$message({
                      type: 'success',
                      message:resp.data.msg,
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
        this.findAll()
      },
      newgrouping(){
          this.dialogFormVisible=true;
      },
    }
    
}
</script>
<style scoped lang="scss">
.abnormal{
    width: 100%;
    margin-top: 20px;
    .abnormal_add{
        width: 100%;
    }
    .abnormal_list{
        width: 100%;
        margin-top: 20px;
    }
    .abnormal_paging{
        width: 100%;
        margin-top: 20px;
    }
}
</style>