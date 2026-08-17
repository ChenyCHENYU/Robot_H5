import type { RouteRecordRaw } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum';

const Layout = () => import('@/layout/index.vue');

export const RootRoute: RouteRecordRaw = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
        title: 'Root',
    },
};

export const LoginRoute: RouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
        title: '登录',
    },
};

export const GetCodeRoute: RouteRecordRaw = {
    path: '/getCode',
    name: 'GetCode',
    component: () => import('@/views/login/getCode/index.vue'),
    meta: {
        title: '获取验证码',
    },
};

export const ErrorPageRoute: RouteRecordRaw = {
    path: '/:path(.*)*',
    name: PageEnum.ERROR_PAGE_NAME,
    component: Layout,
    meta: {
        title: 'ErrorPage',
    },
    children: [
        {
            path: '/:path(.*)*',
            name: 'ErrorPageSon',
            component: () => import('@/views/exception/index.vue'),
            meta: {
                title: 'ErrorPage',
            },
        },
    ],
};
