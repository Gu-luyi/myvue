<template>
  <div>
    <van-nav-bar title="订单列表" />
    <van-tabs v-model:active="tab">
    <van-tab title="全部" name="all">
      <div v-if="allOrders.length === 0" class="empty"><van-empty description="暂无订单" /></div>
      <div v-for="order in allOrders" :key="order.id" class="order-card">
        <p class="time">下单时间：{{ formatTime(order.createdAt) }}</p>
        <div v-for="item in mapItems(order.items || [])" :key="item.id" class="row">
          <span>{{ item.name }}</span>
          <span>x{{ item.count }} · ¥{{ item.price }}</span>
        </div>
        <p class="total">合计：¥{{ Number(order.total || 0).toFixed(2) }}</p>
        <div class="ops">
          <van-button
            v-if="!order.paid"
            size="small"
            type="primary"
            @click="goPay(order)"
          >去结算</van-button>
          <van-button
            v-else
            size="small"
            type="primary"
            plain
            @click="reorder(order.id)"
          >再来一单</van-button>
        </div>
      </div>
    </van-tab>
      <van-tab title="未付款" name="unpaid">
        <div v-if="unpaid.length === 0" class="empty"><van-empty description="暂无未付款订单" /></div>
        <div v-for="order in unpaid" :key="order.id" class="order-card">
          <p class="time">下单时间：{{ formatTime(order.createdAt) }}</p>
          <div v-for="item in mapItems(order.items)" :key="item.id" class="row">
            <span>{{ item.name }}</span>
            <span>x{{ item.count }} · ¥{{ item.price }}</span>
          </div>
          <p class="total">合计：¥{{ order.total.toFixed(2) }}</p>
          <div class="ops">
            <van-button size="small" type="primary" @click="goPay(order)">去结算</van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="已付款" name="paid">
        <div v-if="paid.length === 0" class="empty"><van-empty description="暂无已付款订单" /></div>
        <div v-for="order in paid" :key="order.id" class="order-card">
          <p class="time">下单时间：{{ formatTime(order.createdAt) }}</p>
          <div v-for="item in mapItems(order.items)" :key="item.id" class="row">
            <span>{{ item.name }}</span>
            <span>x{{ item.count }} · ¥{{ item.price }}</span>
          </div>
          <p class="total">合计：¥{{ order.total.toFixed(2) }}</p>
          <div class="ops">
            <van-button size="small" type="primary" plain @click="reorder(order.id)">再来一单</van-button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { useOrderStore } from '../store/order'

export default {
  name: 'OrderView',
  data() {
    return {
      tab: 'unpaid',
      orderStore: null
    }
  },
  computed: {
  allOrders() {
    const list = (this.orderStore?.orders || []).slice()
    const cart = this.orderStore?.cart || []
    if (cart.length > 0) {
      list.push({
        id: '__cart__',
        createdAt: this.orderStore?.cartCreatedAt || Date.now(),
        items: cart,
        total: this.orderStore?.cartTotal || 0,
        paid: false,
        isCart: true
      })
    }
    return this.sortByTime(list)
  },
    unpaid() {
    const list = (this.orderStore?.unpaidOrders || []).slice()
    const cart = this.orderStore?.cart || []
    if (cart.length > 0) {
      list.unshift({
        id: '__cart__',
        createdAt: this.orderStore?.cartCreatedAt || Date.now(),
        items: cart,
        total: this.orderStore?.cartTotal || 0,
        paid: false,
        isCart: true
      })
    }
    return this.sortByTime(list)
    },
    paid() {
    return this.sortByTime(this.orderStore?.paidOrders || [])
    }
  },
  beforeMount() {
    this.orderStore = useOrderStore()
	this.orderStore.ensureSeedData()
  },
  methods: {
	sortByTime(list) {
		return (Array.isArray(list) ? list.slice() : []).sort((a, b) => (b?.createdAt ?? 0) - (a?.createdAt ?? 0))
	},
    formatTime(ts) {
      const d = new Date(ts)
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    mapItems(items) {
      return items.map(i => {
        const dish = this.orderStore.dishes.find(d => d.id === i.id) || {}
        return { ...i, name: dish.name, price: dish.price }
      })
    },
    goPay(order) {
    if (order?.isCart) {
      this.$router.push({ name: 'checkout' })
      return
    }
    this.$router.push({ name: 'checkout', query: { orderId: order.id } })
    },
    reorder(id) {
      this.orderStore.reorder(id)
      this.$router.push({ name: 'checkout' })
    }
  }
}
</script>
<style scoped>
.order-card {
  background: #fff;
  margin: 10px;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.time {
  color: #999;
  margin: 0 0 6px;
}
.row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  font-size: 14px;
}
.total {
  text-align: right;
  font-weight: 600;
  margin: 8px 0;
  color: #ff6b00;
}
.ops {
  text-align: right;
}
.empty {
  padding: 30px 0;
}
</style>
