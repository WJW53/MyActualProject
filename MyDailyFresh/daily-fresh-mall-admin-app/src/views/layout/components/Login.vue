<template>
  <div class="login">
    <a-form-model
      class="login-form"
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item has-feedback label="Email" prop="email">
        <a-input v-model="loginForm.email" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="Password" prop="password">
        <a-input
          v-model="loginForm.password"
          type="password"
          autocomplete="off"
        />
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitForm('loginForm')">
          Submit
        </a-button>
        <a-button style="margin-left: 10px" @click="resetForm('loginForm')">
          Reset
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import api from "@/api/user";
export default {
  data() {
    let emailReg = /^[\w-]+@[\w.-]+.com$/;
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Please input the email"));
      }
      if (emailReg.test(value)) {
        return callback();
      } else {
        return callback(new Error("邮箱格式不正确!"));
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        password: "",
        email: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "change" }],
        email: [{ validator: checkEmail, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .login(this.loginForm)
            .then((res) => {
              console.log(res);
              this.$store.dispatch("setUserInfo",res);//成功之后改变状态数据,写在前面
              this.$router.push({
                //成功之后就路由跳转
                name: "Home",
              });
            })
            .catch((error) => {
              //$message.error是vue提供的一个错误弹窗
              this.$message.error(error);
            });
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less">
@import url("~@/assets/css/login.less");
</style>