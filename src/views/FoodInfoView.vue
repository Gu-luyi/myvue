<template>
	<div class="page">
		<van-nav-bar
			:title="dish?.name || '菜品信息'"
			left-text="返回"
			left-arrow
			@click-left="$router.back()"
		/>

		<div v-if="dish" class="content">
			<van-image :src="dish.image || dish.thumb" width="100%" height="200" fit="cover" lazy-load />

			<van-cell-group inset title="基本信息">
				<van-cell title="名称" :value="dish.name" />
				<van-cell title="分类" :value="dish.category" />
				<van-cell title="价格" :value="`¥${formatMoney(dish.price)}`" />
				<van-cell title="预计送达" :value="dish.etaMinutes != null ? `${dish.etaMinutes}分钟` : '—'" />
				<van-cell title="距离" :value="dish.distanceKm != null ? `${dish.distanceKm}km` : '—'" />
			</van-cell-group>

			<van-cell-group v-if="dish.detail" inset title="菜品介绍">
				<van-cell :label="dish.detail" />
			</van-cell-group>
		</div>

		<van-empty v-else description="未找到该菜品" />
	</div>
</template>

<script>
import { useOrderStore } from '../store/order'

export default {
	name: 'FoodInfoView',
	data() {
		return {
			orderStore: null
		}
	},
	computed: {
		dishId() {
			const id = this.$route?.params?.id
			return id != null ? Number(id) : null
		},
		dish() {
			if (!this.orderStore || this.dishId == null) return null
			return (this.orderStore.dishes || []).find(d => Number(d.id) === this.dishId) || null
		}
	},
	beforeMount() {
		this.orderStore = useOrderStore()
		this.orderStore.ensureSeedData()
	},
	methods: {
		formatMoney(v) {
			const n = Number(v)
			return Number.isFinite(n) ? n.toFixed(2) : '0.00'
		}
	}
}
</script>

<style scoped>
.page {
	padding-bottom: 24px;
}
.content {
	padding: 10px 0;
}
</style>
