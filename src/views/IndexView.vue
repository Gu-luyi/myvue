<template>
    <div class="page">
        <div class="top">
            <van-search v-model="keyword" placeholder="请输入搜索关键词" shape="round" />
        </div>

        <div class="section">
            <van-tabs v-model:active="activeCategory" swipeable>
                <van-tab v-for="c in categories" :key="c" :title="c" :name="c" />
            </van-tabs>
        </div>

        <div class="section">
            <van-swipe :autoplay="3000" lazy-render>
                <van-swipe-item v-for="(img, idx) in banners" :key="idx">
                    <van-image :src="img" width="100%" height="160" fit="cover" lazy-load />
                </van-swipe-item>
            </van-swipe>
        </div>

        <div class="section sort">
            <van-dropdown-menu>
                <van-dropdown-item v-model="sortKey" :options="sortOptions" />
            </van-dropdown-menu>
        </div>

        <div class="list">
            <van-empty v-if="displayDishes.length === 0" description="暂无菜品" />

            <van-card
                v-for="dish in displayDishes"
                :key="dish.id"
                :title="dish.name"
                :desc="dishDesc(dish)"
                :price="formatMoney(dish.price)"
                @click="goDish(dish)"
            >
                <template #thumb>
                    <van-image
                        :src="dish.thumb"
                        width="88"
                        height="88"
                        fit="cover"
                        lazy-load
                    />
                </template>
                <template #footer>
                    <span v-if="pickedCount(dish.id)" class="picked">已选 {{ pickedCount(dish.id) }}</span>
                    <van-button size="small" type="primary" @click.stop="add(dish)">加入订单</van-button>
                </template>
            </van-card>
        </div>
    </div>
</template>
<script>
import { showToast } from 'vant'
import { useOrderStore } from '../store/order'

import banner1 from '../assets/lunbo/1.webp'
import banner2 from '../assets/lunbo/2.webp'
import banner3 from '../assets/lunbo/3.webp'
import banner4 from '../assets/lunbo/4.webp'

export default {
    name: 'IndexView',
    data() {
        return {
            keyword: '',
            activeCategory: '全部',
            sortKey: 'default',
            orderStore: null,
            banners: [
                banner1,
                banner2,
                banner3,
                banner4
            ]
        }
    },
    computed: {
        dishes() {
            return this.orderStore?.dishes || []
        },
        categories() {
            const set = new Set((this.dishes || []).map(d => d.category).filter(Boolean))
            return ['全部', ...Array.from(set)]
        },
        sortOptions() {
            return [
                { text: '综合排序', value: 'default' },
                { text: '派送时间', value: 'eta' },
                { text: '距离', value: 'distance' }
            ]
        },
        cartCountMap() {
            const map = new Map()
            const cart = this.orderStore?.cart || []
            cart.forEach(i => map.set(i.id, i.count || 0))
            return map
        },
        displayDishes() {
            const kw = (this.keyword || '').trim().toLowerCase()
            let list = (this.dishes || []).slice()

            if (this.activeCategory && this.activeCategory !== '全部') {
                list = list.filter(d => d.category === this.activeCategory)
            }

            if (kw) {
                list = list.filter(d => String(d.name || '').toLowerCase().includes(kw))
            }

            if (this.sortKey === 'eta') {
                list.sort((a, b) => (a.etaMinutes ?? 9999) - (b.etaMinutes ?? 9999))
            } else if (this.sortKey === 'distance') {
                list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
            } else {
                list.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            }

            return list
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
        },
        dishDesc(dish) {
            const eta = dish.etaMinutes != null ? `${dish.etaMinutes}分钟` : '—'
            const dist = dish.distanceKm != null ? `${dish.distanceKm}km` : '—'
            const cat = dish.category || '未分类'
            return `${cat} · 派送${eta} · 距离${dist}`
        },
        pickedCount(id) {
            return this.cartCountMap.get(id) || 0
        },
        add(dish) {
            this.orderStore.addToCart(dish.id, 1)
            showToast('已加入订单')
        },
        goDish(dish) {
            this.$router.push({ name: 'food', params: { id: String(dish.id) } })
        }
    }
}
</script>
<style scoped>
.page {
    padding-bottom: 60px;
}
.top {
    padding: 10px 12px;
}
.section {
    margin-bottom: 10px;
}
.sort {
    padding: 0 12px;
}
.list {
    padding: 0 12px 12px;
}
.picked {
    margin-right: 10px;
}
</style>