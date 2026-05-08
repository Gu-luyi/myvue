import { defineStore } from 'pinia'

const useUserStore = defineStore('userinfo', {
    // state存储共享的数据
    state() {
        return {
            isAuthed: false,
            name: '张三',
            age: 24,
            gender: '男',
            education: '大学本科',
            phone: '13800001234',
            avatar: '',
            addresses: [
                {
                    id: 1,
                    name: '张三',
                    phone: '13800001234',
                    province: '江苏省',
                    city: '苏州市',
                    town: '常熟市',
                    detailadd: '东南街道湖山路99号',
                    isDefault: true
                },
                {
                    id: 2,
                    name: '李四',
                    phone: '13800005678',
                    province: '江苏省',
                    city: '苏州市',
                    town: '吴中区',
                    detailadd: '独墅湖大道 88 号',
                    isDefault: false
                }
            ]
        }
    },
    actions: {
        login(payload) {
            this.isAuthed = true
            this.updateProfile(payload)
        },
        logout() {
            this.isAuthed = false
        },
        updateProfile(payload) {
            this.name = payload.name || this.name
            this.age = payload.age || this.age
            this.gender = payload.gender || this.gender
            this.education = payload.education || this.education
            this.phone = payload.phone || this.phone
        },
        addAddress(addr) {
            const nextId = Math.max(...this.addresses.map(a => a.id), 0) + 1
            const record = { ...addr, id: nextId, isDefault: !!addr.isDefault }
            if (record.isDefault) {
                this.addresses = this.addresses.map(a => ({ ...a, isDefault: false }))
            }
            this.addresses.push(record)
        },
        updateAddress(id, addr) {
            this.addresses = this.addresses.map(a => {
                if (a.id !== id) return a
                const updated = { ...a, ...addr }
                return updated
            })
            if (addr.isDefault) {
                this.addresses = this.addresses.map(a => ({ ...a, isDefault: a.id === id }))
            }
        },
        deleteAddress(id) {
            this.addresses = this.addresses.filter(a => a.id !== id)
            if (!this.addresses.some(a => a.isDefault) && this.addresses.length > 0) {
                this.addresses[0].isDefault = true
            }
        },
        setDefaultAddress(id) {
            this.addresses = this.addresses.map(a => ({ ...a, isDefault: a.id === id }))
        }
    }
})

// 导出创建的对象
export { useUserStore }