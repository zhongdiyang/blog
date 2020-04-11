<template>
  <Form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="80" class="demo-ruleForm">
    <FormItem label="名称" prop="name">
      <Input v-model="ruleForm.name"></Input>
    </FormItem>
    <FormItem label="密码" prop="pass">
      <Input type="password" v-model="ruleForm.pass" auto-complete="off"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="checkPass">
      <Input type="password" v-model="ruleForm.checkPass" auto-complete="off"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="submitForm('ruleForm')">注册</Button>
      <Button @click="resetForm('ruleForm')">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      let ls = this.isSimplePwd(value)
      console.log('validatePass3', value, ls)
      if (ls === 0 || ls === 1) {
        callback(new Error('当前密码安全强度太弱!'))
      } else {
        callback()
      }
    }
    // 验证用户使用的名字是否占用
    var validateName = (rule, value, callback) => {
      this.$http.post('/api/verifyName', {
        name: value
      })
        .then((res) => {
          if (res.data.data === 0) {
            callback()
          } else {
            callback(new Error('用户名已占用！请重新输入!'))
          }
        })
    }
    return {
      activeName: 'register',
      ruleForm: {
        name: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入您的名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' },
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { required: true, validator: validatePass3, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/add_user', {
            name: this.ruleForm.name,
            password: this.ruleForm.pass
          }).then((res) => {
            if (res.status === 200 && res.data.data.token) {
              const msg = this.$Message.loading({
                content: '注册成功，正在跳转...',
                duration: 0
              })
              setTimeout(msg, 2000)
              const userInfo = {
                id: res.data.data.userInfo.id,
                name: res.data.data.userInfo.name
              }
              this.$store.commit('loginSuccess', userInfo)
              // 将过期时间拼接到token后
              localStorage.setItem('loginToken', res.data.data.token + '&&expireTime:' + Math.floor(Date.now() + 3600 * 24 * 7 * 1000))
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
              setTimeout(() => {
                this.$router.push({
                  path: '/admin'
                })
              }, 2000)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    isSimplePwd (s) {
      /**
      *简单验证密码强度
      *通过检测是否含有 数字、小写字母、大写字母、特殊字符 存在其中一个返回结果加一
      *如果返回值小于3 则说明密码过于简单
      */
      if (s.length < 6) {
        return 0
      }
      var ls = 0
      if (s.match(/([a-z])+/)) {
        ls++
      }
      if (s.match(/([0-9])+/)) {
        ls++
      }
      if (s.match(/([A-Z])+/)) {
        ls++
      }
      if (s.match(/[^a-zA-Z0-9]+/)) {
        ls++
      }
      return ls
    }
  }
}

</script>
