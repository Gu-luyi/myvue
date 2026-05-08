import { createRouter,createWebHashHistory } from 'vue-router'
const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/denglu',
            name: 'denglu',
            component: () => import('../views/DengluView.vue')
        },
        {
            path:'/index',
            name:"index",
            component:()=>import('../views/IndexView.vue'),
        },
        {
            path:'/order',
            name: 'order',
            component:()=>import('../views/OrderView.vue')
        },
        {
            path:'/jiesuan',
            name: 'checkout',
            component:()=>import('../views/JiesuanView.vue'),
        },
		{
			path: '/food/:id',
			name: 'food',
			component: () => import('../views/FoodInfoView.vue')
        },{
            path:'/my',
            component:()=>import('../views/MyView.vue')
        },
        {
            path: '/address',
            name: 'address',
            component: () => import('../views/AddressView.vue')
        }
    ]
})
export default router