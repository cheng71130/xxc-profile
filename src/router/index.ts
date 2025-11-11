import { createRouter, createWebHistory } from 'vue-router';
// 直接导入，不使用懒加载
import Screen from '@/views/visualizationScreen/index.vue'
import Mine from '@/views/mine/index.vue'
import Flow from '@/views/logicFlow/index.vue'
import Gallery from '@/views/gallery/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
    },
    {
        path: '/visualizationScreen',
        name: 'Screen',
        component: Screen,
    },
    {
        path: '/mine',
        name: 'Mine',
        component: Mine,
    },
    {
        path: '/flowDemo',
        name: 'Flow',
        component: Flow,
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: Gallery,
    },
    {
        path: '/3d_model',
        name: '3d_model',
        component: () => import('@/views/others/3d_model/index.vue'),
    },
    {
        path: '/3d_urdf',
        name: '3d_urdf',
        component: () => import('@/views/others/3d_urdf/index.vue'),
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/others/test/index.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
