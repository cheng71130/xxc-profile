import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 扩展路由元信息类型
declare module 'vue-router' {
    interface RouteMeta {
        preload?: boolean;
        priority?: number;
        startTime?: number;
    }
}

const routes: RouteRecordRaw[] = [
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
        meta: { preload: true, priority: 2 },
    },
    {
        path: '/mine',
        name: 'Mine',
        component: () => import('@/views/mine/index.vue'),
        meta: { preload: true, priority: 1 },
    },
    {
        path: '/flowDemo',
        name: 'Flow',
        component: () => import('@/views/logicFlow/index.vue'),
        meta: { preload: true, priority: 3 },
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
        meta: { preload: true, priority: 2 },
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

/**
 * 预加载路由组件
 */
function preloadRoutes() {
    const preloadPromises: Promise<unknown>[] = [];

    // 按优先级排序
    const sortedRoutes = routes
        .filter((route) => route.meta?.preload)
        .sort((a, b) => {
            const priorityA = (a.meta?.priority ?? 99) as number;
            const priorityB = (b.meta?.priority ?? 99) as number;
            return priorityA - priorityB;
        });

    sortedRoutes.forEach((route) => {
        if (typeof route.component === 'function') {
            const componentLoader = route.component as () => Promise<unknown>;
            const promise = componentLoader().catch((err: unknown) => {
                console.warn(`[预加载失败] ${route.path}:`, err);
            });
            preloadPromises.push(promise);
        }
    });

    return Promise.all(preloadPromises);
}

/**
 * 在首屏加载完成后触发预加载
 */
router.isReady().then(() => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(
            () => {
                preloadRoutes().then(() => {
                    console.log('[路由预加载] 所有组件加载完成');
                });
            },
            { timeout: 2000 }
        );
    } else {
        setTimeout(() => {
            preloadRoutes();
        }, 1000);
    }
});

/**
 * 路由切换性能监控（开发环境）
 */
if (import.meta.env.DEV) {
    router.beforeEach((to, _from, next) => {
        to.meta.startTime = performance.now();
        next();
    });

    router.afterEach((to) => {
        const startTime = to.meta.startTime ?? performance.now();
        const duration = performance.now() - startTime;
        if (duration > 300) {
            console.warn(`🐌 路由切换慢: ${to.path} 耗时 ${duration.toFixed(0)}ms`);
        }
    });
}

export default router;
