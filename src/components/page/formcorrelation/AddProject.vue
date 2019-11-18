<template>
  <div class="deit">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 发布
        </el-breadcrumb-item>
        <el-breadcrumb-item>发布获奖项目</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="cantainer">
        <div class="formbox">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="ruleForm.projectName"></el-input>
            </el-form-item>
            <el-form-item label="队伍名称" prop="teamName">
              <el-input v-model="ruleForm.teamName"></el-input>
            </el-form-item>
            <el-form-item label="项目图片" prop="imageUrl">
              <el-input placeholder="请填写可访问的图片直链" v-model="ruleForm.imageUrl"></el-input>
            </el-form-item>
            <el-form-item label="项目源码" prop="githubUrl">
              <el-input placeholder="Github地址或码云地址" v-model="ruleForm.githubUrl"></el-input>
            </el-form-item>
            <el-form-item label="项目周期" required>
              <el-col :span="11">
                <el-form-item prop="beginDate">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="ruleForm.beginDate"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="ruleForm.endDate"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="项目介绍" prop="desc">
              <el-input type="textarea" rows="10" v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        projectName: "",
        teamName: "",
        imageUrl: "",
        githubUrl: "",
        beginDate: "",
        endDate: "",
        desc: ""
      },
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        teamName: [
          { required: true, message: "请输入队伍名称", trigger: "blur" }
        ],
        imageUrl: [
          { required: true, message: "请输入完整图片直链", trigger: "blur" }
        ],
        githubUrl: [
          { required: true, message: "请输入完整开源地址", trigger: "blur" }
        ],
        beginDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填简述项目信息", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          this.$axios
            .post("/addProject", this.ruleForm)
            .then(resp => {
              if (resp.data.code == 200) {
                this.$message.success("发布成功");
                this.resetForm(formName);
              }
            })
            .catch(() => {
              this.$message.error("发布失败");
            });
        } else {
          this.$message.error("提交失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.formbox {
  width: 600px;
}
</style>
