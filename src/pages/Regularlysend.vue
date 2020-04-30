<template>
<div class="Regularlysend">
  <div class="addgrouping_add">
    <el-button type="primary" @click="newgrouping">新增</el-button>
  </div>
  <div class="Regularlysend_list">
    <el-table
    :data="tableData"
    style="width:60%">
    <el-table-column
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="date"
      label="电话号码"
      >
    </el-table-column>
     <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handldelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="Regularlysend_paging">
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
  <el-form :model="form">
    <el-form-item label="选卡人姓名" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="选卡人新卡" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="新卡人身份证" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
     <el-form-item label="选卡人联系方式" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>
<script>
export default {
    data(){
        return{
            tableData: [{
          date: '2016-05-03'
        }],
        dialogVisible: false,
        formLabelWidth: '120px',
        form: {
          name: ''
           },
        currentPage: 1,
          pageSize: 5,
          total:0,
          dialogFormVisible: false,
          page:1,  
        }
    },
    mounted(){
    },
    methods:{
       newgrouping(){
          this.dialogFormVisible=true;
      },
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {
        this.page=val
        // this.get_group()
      },
    }
    
}
</script>
<style scoped lang="scss">
.Regularlysend{
    width: 100%;
    margin-top: 20px;
    .Regularlysend_add{
        width: 100%;
    }
    .Regularlysend_list{
        width: 100%;
        margin-top: 20px;
    }
    .Regularlysend_paging{
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