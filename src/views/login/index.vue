<template>
  <div>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" maxlength="10" minlength="1"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="15"
            minlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
// 引入
import { mapMutations } from 'vuex'

export default {
  name: 'my-login',
  data () {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 映射mutations里面的updateToken函数
    ...mapMutations(['updateToken']),
    loginFn () {
      // 登录校验
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        // 1 发起登录请求    解构赋值,前后对应,前面的data是key,res是data的值,后面得到的this.loginForm里面的data被拿出来
        const { data: res } = await loginAPI(this.loginForm)
        // 2 登陆失败
        if (res.code !== 0) return this.$message.error(res.message)
        // 3 登陆成功
        this.$message.success(res.message)
        // 调用map映射过来的mutations里面的updateToken函数把toke存储到vuex中
        this.updateToken(res.token)
        // 4 登陆成功后跳转去主页
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('../..//assets/images/1.jpg') center;
  background-size: cover;
  height: 800px;

  .login-box {
    width: 400px;
    height: 270px;
    // background-color: #fff;
    background-color: #00000060;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
