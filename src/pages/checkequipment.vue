<template>
<div class="checkequipment">
  <div class="checkequipment_list">
    <el-table
    :data="tableData"
    style="width:100%">
    <el-table-column
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column
      prop="date"
      label="设备名称"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="建筑物名称"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="建筑物楼层"
      >
    </el-table-column>
     <el-table-column
      prop="name"
      label="设备分组"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="mac地址"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="设备坐标点"
      >
    </el-table-column>
     <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">2D查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="checkequipment_paging">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '公司'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '公司'
        }],
        }
    }
    
}
</script>
<style scoped lang="scss">
.checkequipment{
    width: 100%;
    margin-top: 20px;
    .checkequipment_add{
        width: 100%;
    }
    .checkequipment_list{
        width: 100%;
        margin-top: 20px;
    }
    .checkequipment_paging{
        width: 100%;
        margin-top: 20px;
        float:right;
    }
}
</style>