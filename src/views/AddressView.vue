<template>
    <div>
        <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="$router.back()" />
        <div class="list">
            <AddressItem
                v-for="item in userinfo.addresses"
                :key="item.id"
                :address="item"
                @edit="onEdit"
                @delete="onDelete"
            />
            <van-empty v-if="userinfo.addresses.length === 0" description="暂无地址" />
        </div>

        <van-cell-group inset>
            <van-field v-model="form.name" label="姓名" placeholder="请输入收货人" required />
            <van-field v-model="form.phone" label="手机" type="tel" placeholder="请输入手机号" required />
            <van-field v-model="form.province" label="省份" placeholder="如江苏省" required />
            <van-field v-model="form.city" label="城市" placeholder="如苏州市" required />
            <van-field v-model="form.town" label="区县" placeholder="如工业园区" required />
            <van-field v-model="form.detailadd" label="详细地址" placeholder="如街道门牌" required />
            <van-switch-cell v-model="form.isDefault" title="设为默认" />
        </van-cell-group>

        <div class="actions">
            <van-button block type="primary" @click="save">{{ editingId ? '保存修改' : '新增地址' }}</van-button>
            <van-button block type="default" @click="reset">重置表单</van-button>
        </div>
    </div>
</template>
<script>
import { showToast } from 'vant'
import { useUserStore } from '../store/user'
import AddressItem from '../components/AddressItem.vue'

export default {
    name: 'AddressManage',
    components: { AddressItem },
    data() {
        return {
            userinfo: null,
            editingId: null,
            form: this.createEmptyForm()
        }
    },
    beforeMount() {
        this.userinfo = useUserStore()
    },
    methods: {
        createEmptyForm() {
            return {
                name: '',
                phone: '',
                province: '',
                city: '',
                town: '',
                detailadd: '',
                isDefault: false
            }
        },
        onEdit(address) {
            this.editingId = address.id
            this.form = { ...address }
        },
        onDelete(id) {
            this.userinfo.deleteAddress(id)
        },
        save() {
            if (!this.form.name || !this.form.phone || !this.form.detailadd) {
                showToast('请完善必填项')
                return
            }
            const phonePattern = /^1[3-9]\d{9}$/
            if (!phonePattern.test(this.form.phone)) {
                showToast('手机号格式不正确')
                return
            }
            if (this.editingId) {
                this.userinfo.updateAddress(this.editingId, this.form)
            } else {
                this.userinfo.addAddress(this.form)
            }
            this.reset()
        },
        reset() {
            this.editingId = null
            this.form = this.createEmptyForm()
        }
    }
}
</script>
<style scoped>
.list {
    background: #fff;
}
.actions {
    padding: 12px;
    display: flex;
    gap: 10px;
    flex-direction: column;
}
</style>