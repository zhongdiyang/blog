<template>
  <div class="container demo-1">
    <div class="content">
      <div id="large-header" class="large-header">
        <canvas id="demo-canvas"></canvas>
        <div class="login" :animated="false">
          <Tabs v-model="activeName" @tab-click="handleClick">
            <TabPane label="登录" name="login">
              <Form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="80" class="demo-ruleForm">
                <FormItem label="名称" prop="name">
                  <Input v-model="ruleForm.name"></Input>
                </FormItem>
                <FormItem label="密码" prop="pass">
                  <Input type="password" v-model="ruleForm.pass" auto-complete="off"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="submitForm('ruleForm')">登录</Button>
                  <Button @click="resetForm('ruleForm')">重置</Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane label="注册" name="register">
              <register></register>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/vendor/EasePack.min.js'
import '@/assets/vendor/rAF.js'
import '@/assets/vendor/demo-1.js'
import register from './register'
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
    return {
      activeName: 'login',
      ruleForm: {
        name: 'zdy',
        pass: 'z123123',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入您的名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    const _this = this
    let loginToken = localStorage.getItem('loginToken')
    let userInfo = localStorage.getItem('userInfo')
    // 判断用户是否已经登录
    if (loginToken && loginToken.split('&&expireTime:')[1] > new Date() && userInfo) {
      this.$http.post('/api/check_token', {
        id: JSON.parse(userInfo).id
      }, {
        headers: {
          token: loginToken.split('&&expireTime:')[0]
        }
      })
        .then((res) => {
          console.log(res)
          if (res.data.status === 'success') {
            const msg = this.$Message.loading({
              content: '用户已登录，正在跳转，请稍后',
              duration: 0
            })
            setTimeout(msg, 2000)
            setTimeout(() => {
              _this.$router.push({
                path: '/admin'
              })
            }, 2000)
          } else {
            if (_this.$route.name === 'register') {
              _this.activeName = 'register'
            }
          }
        })
    } else {
      if (this.$route.name === 'register') {
        this.activeName = 'register'
      }
    }
  },
  methods: {
    // 选项卡切换
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/login', {
            name: this.ruleForm.name,
            password: this.ruleForm.pass
          })
            .then((res) => {
              if (res.status === 200 && res.data.status === 'success') {
                const msg = this.$Message.loading({
                  content: '登录成功，正在跳转...',
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
              } else {
                this.$Notice.error({
                  title: '登录失败！用户名/密码错误！'
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {
    register
  }
}
</script>

<style lang="less">
@import './login.less';
.el-tabs__item {
  text-align: center;
  width: 60px;
}
.login {
  min-width: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 20px 30px;
  transform: translate(-50%,-50%);
  margin-top: -30px;
}
.ivu-tabs-nav .ivu-tabs-tab{
  color: #fff;
}
.ivu-form-item-content .ivu-btn-primary {
  margin-right: 50px;
}
.ivu-form .ivu-form-item-label{
  color: #fff;
}
.ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #0cd20f;
}
.ivu-form-item-error-tip {
  color: #ffeb3b;
}
.ivu-form-item-error .ivu-input {
  border-color: #ffeb3b;
}
.container, .content, .large-header{
  width: 100%;
  height: 100%;
}
</style>
