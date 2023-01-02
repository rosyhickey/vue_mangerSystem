<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetPwdFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from '@/api'
export default {
  name: 'UserPwd',
  data () {
    // 检查新旧密码是否相同
    const samePwd = (rule, value, callback) => {
      // value就是校验规则所对应的输入框的值(新密码)
      if (value === this.pwdForm.old_pwd) {
        return callback(new Error('新旧密码不能相同!'))
      }
      // 什么都不传给callback就是检验通过
      callback()
    }
    // 检查两次新密码是否相同
    const rePwd = (rule, value, callback) => {
      // value就是校验规则所对应的输入框的值(重复密码)
      if (value !== this.pwdForm.new_pwd) {
        return callback(new Error('两次新密码不一致!'))
      }
      callback()
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          // 添加自定义校验规则samePwd, trigger: 'blur'意思是失去焦点时进行检验
          // 自定义校验规则语法: validator:规则名, trigger:触发类型
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须是6-15位的非空字符串', trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    updatePwdFn () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return false // 未通过检验
        const { data: res } = await updatePwdAPI(this.pwdForm)
        console.log(res)
        if (res.code !== 0) return this.$message.error('更新密码失败!')
        this.$message.success('更新密码成功!')
        this.$refs.pwdFormRef.resetFields()
        // 更新完密码后强制退出并清空token和信息
        this.$store.commit('updateUserInfo', {})
        this.$store.commit('updateToken', '')
        this.$router.push('/login')
      })
    },
    resetPwdFn () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
