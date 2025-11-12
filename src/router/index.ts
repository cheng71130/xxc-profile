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
        meta: { preload: true },
    },
    {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/mine/index.vue'),
        meta: { preload: true },
    },
    {
        path: '/flowDemo',
        name: 'Flow',
        component: () => import('@/views/logicFlow/index.vue'),
        meta: { preload: true },
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
        meta: { preload: true },
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

// 首屏加载完成后，预加载重要路由
router.isReady().then(() => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            routes.forEach((route) => {
                if (route.meta?.preload) {
                    // 提前加载
                    route.component();
                }
            });
        });
    } else {
        setTimeout(() => {
            routes.forEach((route) => {
                if (route.meta?.preload) {
                    route.component();
                }
            });
        }, 2000);
    }
});

export default router;
