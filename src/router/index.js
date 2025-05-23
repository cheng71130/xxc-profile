import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/home',
		name: 'Home',
		component: () => import('@/views/home/index.vue')
	},
	{
		path: '/visualizationScreen',
		name: 'Screen',
		component: () => import('@/views/visualizationScreen/index.vue')
	},
	{
		path: '/map-cn',
		name: 'Map',
		component: () => import('@/views/map/index.vue')
	},
	{
		path: '/flowDemo',
		name: 'Flow',
		component: () => import('@/views/logicFlow/index.vue')
	},
	{
		path: '/largeFileUpload',
		name: 'largeFileUpload',
		component: () => import('@/views/largeFileUpload/index.vue')
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
