<template>
	<div class="page">
		<van-nav-bar title="结算" left-text="返回" left-arrow @click-left="$router.replace({ name: 'index' })" />

		<van-cell-group inset>
			<van-cell
				title="收货地址"
				:label="addressLabel"
				is-link
				@click="goAddress"
			/>
		</van-cell-group>

		<van-cell-group inset title="菜品清单">
			<van-empty v-if="items.length === 0" description="暂无结算菜品" />
			<van-cell v-for="item in items" :key="item.id" :title="item.name">
				<template #value>
					x{{ item.count }} · ¥{{ formatMoney(item.price) }}
				</template>
			</van-cell>
			<van-cell title="合计" :value="`¥${formatMoney(totalPrice)}`" />
		</van-cell-group>

		<van-cell-group inset title="备注">
			<van-field v-model.number="cutleryCount" label="餐具份数" type="digit" placeholder="如 2" />
			<van-field v-model="deliveryTime" label="送达时间" placeholder="如 12:30" />
			<van-field v-model="remark" label="备注" type="textarea" rows="2" autosize placeholder="如少辣/不放香菜" />
		</van-cell-group>

		<van-submit-bar
			:price="totalPriceCents"
			button-text="提交订单"
			@submit="submit"
		/>
	</div>
</template>

<script>
import { showToast } from 'vant'
import { useUserStore } from '../store/user'
import { useOrderStore } from '../store/order'

export default {
	name: 'JiesuanView',
	data() {
		return {
			userStore: null,
			orderStore: null,
			remark: '',
			cutleryCount: 0,
			deliveryTime: ''
		}
	},
	computed: {
		orderId() {
			const id = this.$route?.query?.orderId
			return id ? Number(id) : null
		},
		selectedAddress() {
			const list = this.userStore?.addresses || []
			return list.find(a => a.isDefault) || list[0] || null
		},
		addressLabel() {
			const a = this.selectedAddress
			if (!a) return '请选择收货地址'
			return `${a.name} ${a.phone}｜${a.province}${a.city}${a.town}${a.detailadd}`
		},
		items() {
			if (this.orderId) {
				const order = this.orderStore?.getOrderById?.(this.orderId)
				const dishes = this.orderStore?.dishes || []
				return (order?.items || []).map(i => {
					const dish = dishes.find(d => d.id === i.id) || {}
					return { ...i, name: dish.name || '未知菜品', price: dish.price ?? 0 }
				})
			}
			return this.orderStore?.cartItems || []
		},
		totalPrice() {
			return this.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.count) || 0), 0)
		},
		totalPriceCents() {
			return Math.round(this.totalPrice * 100)
		}
	},
	beforeMount() {
		this.userStore = useUserStore()
		this.orderStore = useOrderStore()
		this.orderStore.ensureSeedData()

		if (this.orderId) {
			const order = this.orderStore.getOrderById(this.orderId)
			if (order) {
				this.remark = order.remark || ''
				this.cutleryCount = order.cutleryCount ?? 0
				this.deliveryTime = order.deliveryTime || ''
			}
		}
	},
	methods: {
		formatMoney(v) {
			const n = Number(v)
			return Number.isFinite(n) ? n.toFixed(2) : '0.00'
		},
		goAddress() {
			this.$router.push({ name: 'address' })
		},
		submit() {
			if (!this.selectedAddress) {
				showToast('请先选择收货地址')
				return
			}
			if (this.items.length === 0) {
				showToast('暂无可提交的菜品')
				return
			}

			const payload = {
				address: this.selectedAddress,
				remark: this.remark,
				cutleryCount: Number(this.cutleryCount) || 0,
				deliveryTime: this.deliveryTime
			}

			if (this.orderId) {
				const ok = this.orderStore.payOrder(this.orderId, payload)
				if (!ok) {
					showToast('订单不存在或已失效')
					return
				}
			} else {
				const order = this.orderStore.createOrderFromCart(payload)
				this.orderStore.payOrder(order.id, payload)
				this.orderStore.clearCart()
			}

			showToast('提交成功')
			this.$router.replace({ name: 'order' })
		}
	}
}
</script>

<style scoped>
.page {
	padding-bottom: 60px;
}
</style>

