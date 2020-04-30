<template>
<div class="phonenumber">
  <div class="phonenumber_list">
    <el-table
    :data="tableData"
    style="width:40%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="phone_number"
      label="电话号码"
      >
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handldelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="phonenumber_paging">
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
        }
    },
    mounted(){
      this.findAll();
    },
    methods:{
      handldelete:function(index,row){
        console.log(row)
        let _this = this;
      _this.$httpRequest({
        path: "/number/delNumber/",
        type: "get",
        args: {
          phone_number:row.phone_number,
        },
        success: resp => {
          console.log(resp.data.msg)
          if (resp.data.msg=="删除成功") {
             this.$message({
                      type: 'success',
                      message:resp.data.msg,
                    });
            _this.findAll();
          } else {
             this.$message({
                type: 'success',
                message:resp.data.msg,
                });
          }
        }
      });
      },
      findAll() {
      let _this = this;
      _this.$httpRequest({
        path: "/number/findAll/",
        type: "get",
        args: {
          page: this.page
        },
        success: resp => {
          if (resp.data.msg== "电话信息查询成功") {
           this.tableData=resp.data.date.phone;
            console.log(this.tableData)
           this.total=parseInt(resp.data.totol);
          } else {
          }
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
    }
    
}
</script>
<style scoped lang="scss">
.phonenumber{
    width: 100%;
    margin-top: 20px;
    .phonenumber_list{
        width: 100%;
        margin-top: 20px;
    }
    .phonenumber_paging{
        width: 100%;
        margin-top: 20px;
        float:right;
    }
    .map{
      height:300px;
      width:700px;
      margin:0 auto;
    }
}
</style>