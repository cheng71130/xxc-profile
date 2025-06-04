import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		redirect: '/home'
	},
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
		path: '/mine',
		name: 'Mine',
		component: () => import('@/views/mine/index.vue')
	},
	{
		path: '/flowDemo',
		name: 'Flow',
		component: () => import('@/views/logicFlow/index.vue')
	},
	{
		path: '/gallery',
		name: 'Gallery',
		component: () => import('@/views/gallery/index.vue')
	},
	// {
	// 	path: '/largeFileUpload',
	// 	name: 'largeFileUpload',
	// 	component: () => import('@/views/components/largeFileUpload/index.vue')
	// },
	{
		path: '/CAD_txt',
		name: 'CAD_txt',
		component: () => import('@/views/CAD_txt/index.vue')
	},
	{
		path: '/3dModel',
		name: '3dModel',
		component: () => import('@/views/3dModel/index.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
