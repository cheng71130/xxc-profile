import { createRouter, createWebHistory } from 'vue-router'
import Map from '../views/map/index.vue'
import Screen from '../views/visualizationScreen/index.vue'
import Flow from '../views/logicFlow/index.vue'

const routes = [
	{
		path: '/visualizationScreen',
		name: 'Screen',
		component: Screen
	},
	{
		path: '/map-cn',
		name: 'Map',
		component: Map
	},
	{
		path: '/flowDemo',
		name: 'Flow',
		component: Flow
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
