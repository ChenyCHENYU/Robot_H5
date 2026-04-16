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
                name: 'Demo',
                meta: {
                    title: 'Demo',
                    icon: 'ph:squares-four-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/demo/index.vue'),
            },
            {
                path: '/chart',
                name: 'Chart',
                meta: {
                    title: '图表',
                    icon: 'ph:chart-bar-bold',
                    keepAlive: false,
                },
                component: () => import('@/views/chart/index.vue'),
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
