<template>
  <div class="addtype">
    <div class="addtype_add">
      <el-button type="primary" @click="open">新增</el-button>
    </div>
    <div class="addtype_list">
      <el-table :data="tableData" style="width: 40%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column label="操作">
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
  data() {
    return {
      currentPage4: 4,
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      page: 1,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  mounted() {
    this.Typequeries();
  },
  methods: {
    //删除类型
    handleDelete(index,row){
      let _this = this;
      _this.$httpRequest({
        path: "/room/delete_building_type/",
        type: "post",
        args:{
                name:row.name
              },
        success: resp => {
           this.Typequeries()
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
    Typequeries() {
      let _this = this;
      _this.$httpRequest({
        path: "/room/get_building_type/",
        type: "post",
        args:{
                page:this.page
              },
        success: resp => {
          this.tableData = resp.data;
           this.total=resp.total
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    handleSizeChange(val) {
      },
      handleCurrentChange(val) {
        this.page=val
         this.Typequeries();
      },
    open() {
      let _this = this;
      this.$prompt("请输入类型", "添加类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // inputPattern: //,
        inputErrorMessage: "添加类型不正确"
      })
        .then(({ value }) => {
          _this.$httpRequest({
            path: "/room/add_building_type/",
            type: "post",
            args: {
              name: value
            },
            success: resp => {
              this.Typequeries();
              this.$message({
                type: "success",
                message: resp.data
              });
            },
            fail: error => {
              console.log(error.content);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  }
};
</script>
<style scoped lang="scss">
.addtype {
  width: 100%;
  margin-top: 20px;
  .addtype_add {
    width: 100%;
  }
  .addtype_list {
    width: 100%;
    margin-top: 20px;
  }
  .addtype_paging {
    width: 100%;
    margin-top: 20px;
  }
}
.v-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.01) !important;
}
</style>
