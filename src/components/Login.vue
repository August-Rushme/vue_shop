/*eslint-disable*/
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box"><img src="../assets/logo.png" alt="" /></div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginForm_rules"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont iconyonghu"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont iconicon-mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFormLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单的验证规则对象
      loginForm_rules: {
        //验证用户名
        username: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '用户名长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        //验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetFormLogin() {
      // console.log(this)
      //通过$refs获取对象的引用
      //resetFields()对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        //登录成功后将要token保存到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        //通过编程式导航跳转到home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    width: 130px;
    height: 130px;
    left: 50%;
    padding: 10px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
.login_form {
  position: absolute;
  width: 100%;
  padding: 20px;
  bottom: 0;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
