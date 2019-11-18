<template>
  <div class="deit">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 数据管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>项目列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="cantainer">
        <el-table
          style="width: 100%;"
          :data="projectList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        >
          <!-- <el-table-column type="index" width="50"></el-table-column> -->
          <el-table-column label="编号" prop="id" width="60"></el-table-column>
          <el-table-column label="项目名称" prop="projectName" width="180"></el-table-column>
          <el-table-column label="队伍名称" prop="teamName" width="150"></el-table-column>
          <el-table-column label="图片链接" prop="imageUrl" width="240"></el-table-column>
          <el-table-column label="开源地址" prop="githubUrl" width="240"></el-table-column>
          <el-table-column label="开始时间" :formatter="dateFormat" prop="beginDate" width="100"></el-table-column>
          <el-table-column label="结束时间" :formatter="dateFormat" prop="endDate" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index,scope.row)"
                type="text"
                size="small"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="projectList.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"; // 格式化代码
export default {
  name: "projectlist",
  data() {
    return {
      currentPage: 1, //初始页
      pagesize: 10, //	每页的数据
      projectList: []
    };
  },
  created() {
    this.handleProjectList();
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      // console.log(this.pagesize);
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      // console.log(this.currentPage);
    },
    handleProjectList() {
      this.$axios
        .get("pall")
        .then(resp => {
          this.projectList = resp.data.data;
        })
        .catch(response => {
          this.$notify.error({
            title: "请求失败",
            message: "网络错误，请求后端api失败或token失效，请重新登录",
            duration: 1000
          });
        });
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    deleteRow(index, row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete("/delProject/" + row.id)
            .then(resp => {
              this.projectList.splice(index, 1);
              this.handleProjectList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
