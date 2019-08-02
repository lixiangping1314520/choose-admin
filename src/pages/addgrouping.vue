<template>
<div class="addgrouping">
  <div class="addgrouping_add">
      <el-button type="primary" @click="newgrouping">新增</el-button>
  </div>
  <div class="addgrouping_list">
    <el-table
    :data="tableData"
    style="width: 60%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="name"
      label="分组名称"
      width="180">
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          disabled="disabled"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
          page:1
        }
    },
    mounted(){
     this.get_group();
    },
    methods:{
      get_group(){
        let _this=this;
        _this.$httpRequest({
              path: "/device/get_group/",
              type: "post",
              args:{
                page:this.page
              },
              success: resp => {
                this.tableData=resp.data,
                // this.currentPage=resp.number,
                this.total=resp.total
              },
              fail: error => {
                console.log(error.content);
              }
            }); 
      },
      handleDelete(index,row){
        console.log(row.name)
        let _this=this;
        _this.$httpRequest({
              path: "/device/delete_group/",
              type: "post",
              args:{
                name:row.name
              },
              success: resp => {
                console.log(resp)
                 this.$message({
                      type: 'success',
                      message:resp.data
                    });
                this.get_group();
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
        this.get_group()
      },
      newgrouping(){
        let _this=this;
        this.$prompt('请输入设备分组', '添加设备分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: //,
          inputErrorMessage: '添加设备分组不正确'
        }).then(({ value }) => {
          _this.$httpRequest({
              path: "/device/add_group/",
              type: "post",
               args:{
                  name:value,
                },
              success: resp => {
                  console.log(resp.data)
                   this.$message({
                      type: 'success',
                      message:resp.data
                    });
              },
              fail: error => {
                console.log(error.content);
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    }
    }
    
}
</script>
<style scoped lang="scss">
.addgrouping{
    width: 100%;
    margin-top: 20px;
    .addgrouping_add{
        width: 100%;
    }
    .addgrouping_list{
        width: 100%;
        margin-top: 20px;
    }
    .addgrouping_paging{
        width: 100%;
        margin-top: 20px;
    }
}
</style>



