import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import('@/views/visualizationScreen/index.vue'),
    },
    {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/mine/index.vue'),
    },
    {
        path: '/flowDemo',
        name: 'Flow',
        component: () => import('@/views/logicFlow/index.vue'),
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
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
