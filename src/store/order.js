import { defineStore } from 'pinia'

import fishThumb from '../assets/foods/鱼香肉丝.webp'
import burgerThumb from '../assets/foods/汉堡.webp'
import sushiThumb from '../assets/foods/寿司.webp'
import strawberryCakeThumb from '../assets/foods/草莓蛋糕.webp'
import bobaMilkTeaThumb from '../assets/foods/珍珠奶茶.webp'
import puddingThumb from '../assets/foods/布丁.webp'
import matchaIceCreamThumb from '../assets/foods/抹茶冰淇淋.webp'
import pizzaThumb from '../assets/foods/披萨.webp'
import kungPaoChickenThumb from '../assets/foods/宫保鸡丁.webp'

const SEED_VERSION = 3
const DEFAULT_DISHES = [
	{
		id: 1,
		name: '鱼香肉丝',
		price: 26,
		category: '中餐',
		etaMinutes: 25,
		distanceKm: 2.1,
		thumb: fishThumb,
		detail: '经典川味家常菜，酸甜微辣，配米饭很香。'
	},
	{
		id: 2,
		name: '汉堡',
		price: 18,
		category: '西式',
		etaMinutes: 20,
		distanceKm: 2.8,
		thumb: burgerThumb,
		detail: '现烤面包胚搭配多汁肉饼，简单满足。'
	},
	{
		id: 3,
		name: '寿司',
		price: 32,
		category: '日料',
		etaMinutes: 30,
		distanceKm: 3.5,
		thumb: sushiThumb,
		detail: '米饭与海味的清爽组合，口感丰富。'
	},
	{
		id: 4,
		name: '草莓蛋糕',
		price: 28,
		category: '甜品饮品',
		etaMinutes: 20,
		distanceKm: 1.9,
		thumb: strawberryCakeThumb,
		detail: '绵软蛋糕胚搭配清甜草莓，甜而不腻。'
	},
	{
		id: 5,
		name: '珍珠奶茶',
		price: 16,
		category: '甜品饮品',
		etaMinutes: 15,
		distanceKm: 1.5,
		thumb: bobaMilkTeaThumb,
		detail: 'Q 弹珍珠配香浓奶茶，冰热皆宜。'
	},
	{
		id: 6,
		name: '布丁',
		price: 12,
		category: '甜品饮品',
		etaMinutes: 15,
		distanceKm: 1.7,
		thumb: puddingThumb,
		detail: '细腻顺滑的口感，淡奶香回味。'
	},
	{
		id: 7,
		name: '抹茶冰淇淋',
		price: 14,
		category: '甜品饮品',
		etaMinutes: 15,
		distanceKm: 2.0,
		thumb: matchaIceCreamThumb,
		detail: '抹茶清香微苦，奶味柔和，夏日解暑。'
	},
	{
		id: 8,
		name: '披萨',
		price: 36,
		category: '西式',
		etaMinutes: 35,
		distanceKm: 3.8,
		thumb: pizzaThumb,
		detail: '拉丝芝士与丰富配料，热乎更好吃。'
	},
	{
		id: 9,
		name: '宫保鸡丁',
		price: 28,
		category: '中餐',
		etaMinutes: 28,
		distanceKm: 2.6,
		thumb: kungPaoChickenThumb,
		detail: '香辣开胃，鸡丁配花生更有层次。'
	}
]

const useOrderStore = defineStore(
	'order',
	{
		state() {
			return {
				seedVersion: SEED_VERSION,
				// 菜品基础信息（用于结算/订单列表展示名称与单价）
				dishes: DEFAULT_DISHES,
				// 当前待结算清单（购物车）
				cart: [],
				cartCreatedAt: null,
				// 订单列表
				orders: []
			}
		},
		getters: {
			cartItems(state) {
				return (state.cart || []).map(i => {
					const dish = (state.dishes || []).find(d => d.id === i.id) || {}
					return {
						...i,
						name: dish.name,
						price: dish.price
					}
				})
			},
			cartTotal(state) {
				const dishes = state.dishes || []
				return (state.cart || []).reduce((sum, i) => {
					const dish = dishes.find(d => d.id === i.id)
					const price = dish?.price ?? 0
					return sum + price * (i.count || 0)
				}, 0)
			},
			unpaidOrders(state) {
				return (state.orders || []).filter(o => !o.paid)
			},
			paidOrders(state) {
				return (state.orders || []).filter(o => !!o.paid)
			}
		},
		actions: {
			ensureSeedData() {
				// pinia-plugin-persistedstate 会覆盖初始 state；用 seedVersion 做一次性迁移
				const versionMismatch = this.seedVersion !== SEED_VERSION
				const needReset = versionMismatch || !Array.isArray(this.dishes) || this.dishes.length !== DEFAULT_DISHES.length
				if (!needReset) return

				this.seedVersion = SEED_VERSION
				this.dishes = DEFAULT_DISHES

				// 版本更新：清空旧数据，避免旧订单/购物车与新菜品不匹配
				if (versionMismatch) {
					this.orders = []
					this.cart = []
					this.cartCreatedAt = null
					return
				}

				// 如果旧购物车里有不存在的菜品 id，就清空，避免结算/列表显示异常
				const ids = new Set((this.dishes || []).map(d => d.id))
				if ((this.cart || []).some(i => !ids.has(i.id))) {
					this.cart = []
					this.cartCreatedAt = null
				}
			},
			getOrderById(id) {
				const orderId = Number(id)
				return (this.orders || []).find(o => o.id === orderId)
			},
			setCart(items) {
				this.cart = Array.isArray(items) ? items : []
				if ((this.cart || []).length > 0) {
					this.cartCreatedAt = this.cartCreatedAt || Date.now()
				} else {
					this.cartCreatedAt = null
				}
			},
			addToCart(dishId, count = 1) {
				const wasEmpty = (this.cart || []).length === 0
				const id = Number(dishId)
				const delta = Number(count) || 1
				const existing = (this.cart || []).find(i => i.id === id)
				if (existing) {
					existing.count = (existing.count || 0) + delta
				} else {
					this.cart.push({ id, count: delta })
				}
				if (wasEmpty && (this.cart || []).length > 0) {
					this.cartCreatedAt = Date.now()
				}
			},
			incCartItem(dishId) {
				this.addToCart(dishId, 1)
			},
			decCartItem(dishId) {
				const id = Number(dishId)
				const item = (this.cart || []).find(i => i.id === id)
				if (!item) return
				item.count = (item.count || 0) - 1
				if (item.count <= 0) {
					this.cart = (this.cart || []).filter(i => i.id !== id)
				}
				if ((this.cart || []).length === 0) {
					this.cartCreatedAt = null
				}
			},
			removeCartItem(dishId) {
				const id = Number(dishId)
				this.cart = (this.cart || []).filter(i => i.id !== id)
				if ((this.cart || []).length === 0) {
					this.cartCreatedAt = null
				}
			},
			clearCart() {
				this.cart = []
				this.cartCreatedAt = null
			},
			reorder(id) {
				const order = this.getOrderById(id)
				if (!order) return
				this.cart = (order.items || []).map(i => ({ id: i.id, count: i.count }))
				this.cartCreatedAt = (this.cart || []).length > 0 ? Date.now() : null
			},
			createOrderFromCart(payload = {}) {
				const items = (this.cart || []).map(i => ({ id: i.id, count: i.count }))
				const total = this.cartTotal

				const nextId = Math.max(...(this.orders || []).map(o => o.id), 0) + 1
				const order = {
					id: nextId,
					createdAt: Date.now(),
					paid: false,
					paidAt: null,
					items,
					total,
					address: payload.address || null,
					remark: payload.remark || '',
					cutleryCount: payload.cutleryCount ?? 0,
					deliveryTime: payload.deliveryTime || ''
				}
				this.orders.push(order)
				return order
			},
			payOrder(id, payload = {}) {
				const order = this.getOrderById(id)
				if (!order) return false

				// 允许在支付时补充/更新信息
				if (payload.address) order.address = payload.address
				if (typeof payload.remark === 'string') order.remark = payload.remark
				if (typeof payload.cutleryCount === 'number') order.cutleryCount = payload.cutleryCount
				if (typeof payload.deliveryTime === 'string') order.deliveryTime = payload.deliveryTime

				order.paid = true
				order.paidAt = Date.now()
				return true
			}
		},
		persist: true
	}
)

export { useOrderStore }

