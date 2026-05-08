<template>
  <div>
    <div class="header">
      <van-image round width="72" height="72" :src="avatarFallback" />
      <div>
        <p class="name">{{ user.name }}</p>
        <p class="meta">{{ user.gender }} · {{ user.education }}</p>
        <p class="meta">{{ user.phone }}</p>
      </div>
      <van-button size="small" type="primary" plain @click="openProfileDialog">编辑资料</van-button>
    </div>

    <van-cell-group>
      <van-cell title="地址管理" is-link @click="goAddress" />
      <van-cell title="订单列表" is-link @click="goOrders" />
      <van-cell title="手机号" :value="user.phone" is-link @click="openPhoneDialog" />
      <van-cell title="客服中心" value="9:00-22:00" is-link @click="contact" />
      <van-cell title="协议说明" is-link @click="showPolicy('协议说明')" />
      <van-cell title="隐私政策" is-link @click="showPolicy('隐私政策')" />
    </van-cell-group>

    <div class="exit">
      <van-button block type="danger" @click="exit">退出账号</van-button>
    </div>

    <van-dialog v-model:show="editingPhone" title="修改手机号" show-cancel-button @confirm="savePhone">
      <van-field v-model="tempPhone" label="新手机号" placeholder="请输入" type="tel" />
    </van-dialog>

    <van-dialog v-model:show="editingProfile" title="修改资料" show-cancel-button @confirm="saveProfile">
      <van-cell-group inset>
        <van-field v-model="tempProfile.name" label="姓名" placeholder="请输入" />
        <van-field v-model="tempProfile.gender" label="性别" placeholder="男 / 女" />
        <van-field v-model="tempProfile.education" label="学历" placeholder="如 大学本科" />
        <van-field v-model="tempProfile.phone" label="手机号" type="tel" placeholder="11位手机号" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { showToast } from 'vant'
import { useUserStore } from '../store/user'

export default {
  name: 'MyView',
  data() {
    return {
      store: null,
      editingPhone: false,
      editingProfile: false,
      tempPhone: '',
      tempProfile: {
        name: '',
        gender: '',
        education: '',
        phone: ''
      }
    }
  },
  computed: {
    user() {
      return this.store || {}
    },
    avatarFallback() {
      return this.store?.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    }
  },
  beforeMount() {
    this.store = useUserStore()
    this.tempPhone = this.store.phone
  },
  methods: {
    goAddress() {
      this.$router.push({ name: 'address' })
    },
    goOrders() {
      this.$router.push({ name: 'order' })
    },
    openPhoneDialog() {
      this.tempPhone = this.store.phone
      this.editingPhone = true
    },
    contact() {
      showToast('客服：9:00-22:00，稍后可接入人工')
    },
    showPolicy(title) {
      showToast(`${title}，敬请查阅`)
    },
    openProfileDialog() {
      this.tempProfile = {
        name: this.store.name,
        gender: this.store.gender,
        education: this.store.education,
        phone: this.store.phone
      }
      this.editingProfile = true
    },
    exit() {
      this.store.logout()
      showToast('已退出')
      this.$router.replace({ name: 'denglu' })
    },
    savePhone() {
      const pattern = /^1[3-9]\d{9}$/
      if (!pattern.test(this.tempPhone)) {
        showToast('手机号格式不正确')
        return false
      }
      this.store.updateProfile({ phone: this.tempPhone })
      showToast('已更新')
      return true
    },
    saveProfile() {
      if (!this.tempProfile.name) {
        showToast('请填写姓名')
        return false
      }
      const pattern = /^1[3-9]\d{9}$/
      if (!pattern.test(this.tempProfile.phone)) {
        showToast('手机号格式不正确')
        return false
      }
      this.store.updateProfile({
        name: this.tempProfile.name,
        gender: this.tempProfile.gender,
        education: this.tempProfile.education,
        phone: this.tempProfile.phone
      })
      showToast('资料已更新')
      return true
    }
  }
}
</script>
<style scoped>
.header {
  display: flex;
  gap: 12px;
  padding: 16px;
  align-items: center;
  background: linear-gradient(90deg, #fff1eb, #ffe7e0);
}
.name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}
.meta {
  margin: 2px 0;
  color: #666;
  font-size: 13px;
}
.exit {
  padding: 16px;
}
</style>
