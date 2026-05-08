<template>
  <div class="auth">
    <div class="panel">
      <h3>立即体验</h3>
      <van-field v-model="form.name" label="昵称" placeholder="请输入昵称" />
      <van-field v-model="form.phone" label="手机号" type="tel" placeholder="用于登录验证" />
      <van-field v-model="form.code" label="验证码" placeholder="1234" />
      <van-button block type="primary" @click="login">登录 / 注册</van-button>
      <van-button block type="default" class="ghost" @click="quickFill">一键体验</van-button>
    </div>
  </div>
</template>
<script>
import { showToast } from 'vant'
import { useUserStore } from '../store/user'

export default {
  name: 'DengluView',
  data() {
    return {    
      form: {
        name: '',
        phone: '',
        code: ''
      },
      demo: {
        name: '张三',
        phone: '13800001234',
        code: '1234'
      },
      store: null
    }
  },
  beforeMount() {
    this.store = useUserStore()
  },
  methods: {
    login() {
      if (!this.form.name) {
        showToast('请填写昵称')
        return
      }
      const pattern = /^1[3-9]\d{9}$/
      if (!pattern.test(this.form.phone)) {
        showToast('手机号格式不正确')
        return
      }
      if (!this.form.code) {
        showToast('请输入验证码')
        return
      }
      this.store.login({ name: this.form.name, phone: this.form.phone })
      showToast('欢迎回来')
      this.$router.replace({ name: 'index' })
    },
    quickFill() {
      this.form = { ...this.demo }
      this.login()
    }
  }
}
</script>
<style scoped>
.guide {
  color: #fff;
}
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #ff8a7a, #ffb199);
  padding: 20px;
}

.panel {
  padding: 20px 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.panel h3 {
  margin: 0 0 12px;
}
.ghost {
  margin-top: 10px;
}
</style>
