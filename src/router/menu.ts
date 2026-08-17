import type { RouteRecordRaw } from 'vue-router';

const Layout = () => import('@/layout/index.vue');

const menuRouteList: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: '/home',
                name: 'HomePage',
                meta: {
                    title: '首页',
                    icon: 'ph:house-bold',
                    keepAlive: true,
                },
                component: () => import('@/views/home/index.vue'),
            },
            {
                path: '/mine',
                name: 'MinePage',
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
