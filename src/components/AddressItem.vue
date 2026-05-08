<template>
  <van-cell
    :title="displayName"
    :label="fullAddress"
    :border="false"
  >
    <template #right-icon>
      <div class="actions">
        <van-tag v-if="address.isDefault" type="success" plain>默认</van-tag>
        <van-button size="mini" type="default" @click.stop="$emit('edit', address)">编辑</van-button>
        <van-button size="mini" type="danger" @click.stop="$emit('delete', address.id)">删除</van-button>
      </div>
    </template>
  </van-cell>
</template>
<script>
export default {
  name: 'AddressCard',
  props: {
    address: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  computed: {
    displayName() {
      return `${this.address.name} ${this.address.phone}`
    },
    fullAddress() {
      return `${this.address.province}${this.address.city}${this.address.town}${this.address.detailadd}`
    }
  }
}
</script>
<style scoped>
.actions {
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>
