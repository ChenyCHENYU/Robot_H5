import type { RouteRecordRaw } from 'vue-router';

const Layout = () => import('@/layout/index.vue');

const menuRouteList: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '',
        redirect: '/dashboard',
        component: Layout,
        children: [
            {
                path: '/dashboard',
                name: 'DashboardPage',
                meta: {
                    title: '首页',
                    icon: 'ph:house-bold',
                    keepAlive: true,
                },
                component: () => import('@/views/dashboard/index.vue'),
            },
            {
                path: '/demo',
                name: 'DemoPage',
                meta: {
                    title: '组件',
                    icon: 'ph:squares-four-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/demo/index.vue'),
            },
            {
                path: '/template',
                name: 'TemplatePage',
                meta: {
                    title: '模板',
                    icon: 'ph:browsers-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/template/index.vue'),
            },
            {
                path: '/hooks',
                name: 'HooksPage',
                meta: {
                    title: '能力',
                    icon: 'ph:atom-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/hooks/index.vue'),
            },
            {
                path: '/mine',
                name: 'Mine',
                meta: {
                    title: '我的',
                    icon: 'ph:user-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/mine/index.vue'),
            },
        ],
    },
];

export default menuRouteList;
