import type { RouteRecordRaw } from 'vue-router';

const routeModuleList: Array<RouteRecordRaw> = [
    {
        path: '/requestAnimationFrame',
        name: 'RequestAnimationFrame',
        meta: {
            title: '渲染性能优化',
            keepAlive: false,
        },
        component: () => import('@/views/demo/raf/index.vue'),
    },
    {
        path: '/pullRefreshList',
        name: 'PullRefreshList',
        meta: {
            title: '列表刷新加载',
            keepAlive: false,
        },
        component: () => import('@/views/demo/pull-refresh/index.vue'),
    },
    {
        path: '/scrollCache',
        name: 'ScrollCache',
        meta: {
            title: '滚动缓存',
            keepAlive: true,
        },
        component: () => import('@/views/demo/scroll-cache/index.vue'),
    },
    {
        path: '/unoCss',
        name: 'UnoCss',
        meta: {
            title: 'unoCss',
        },
        component: () => import('@/views/demo/unocss/index.vue'),
    },
    {
        path: '/svgIcon',
        name: 'SvgIcon',
        meta: {
            title: 'svg图标',
        },
        component: () => import('@/views/demo/svg-icon/index.vue'),
    },
    {
        path: '/webview',
        name: 'Webview',
        meta: {
            title: 'miracle-webview',
        },
        component: () => import('@/components/C_WebSite/index.vue'),
    },
    {
        path: '/dependence',
        name: 'Dependence',
        meta: {
            title: '项目依赖',
        },
        component: () => import('@/views/demo/dependence/index.vue'),
    },
    {
        path: '/openInstall',
        name: 'OpenInstall',
        meta: {
            title: 'openInstall',
        },
        component: () => import('@/views/demo/openinstall/index.vue'),
    },
    {
        path: '/directives',
        name: 'Directives',
        meta: {
            title: '指令合集',
        },
        component: () => import('@/views/demo/directives/index.vue'),
    },
    {
        path: '/editUserInfo',
        name: 'EditUserInfo',
        meta: {
            title: '编辑个人信息',
        },
        component: () => import('@/views/mine/edit-user-info/index.vue'),
    },
    {
        path: '/editNickname',
        name: 'EditNickname',
        meta: {
            title: '修改昵称(该页面已缓存)',
            keepAlive: true,
        },
        component: () => import('@/views/mine/edit-nickname/index.vue'),
    },
    {
        path: '/editSign',
        name: 'EditSign',
        meta: {
            title: '修改签名',
        },
        component: () => import('@/views/mine/edit-sign/index.vue'),
    },
    {
        path: '/accountSetting',
        name: 'AccountSetting',
        meta: {
            title: '账号与安全',
        },
        component: () => import('@/views/mine/account/index.vue'),
    },
    {
        path: '/changePassword',
        name: 'ChangePassword',
        meta: {
            title: '修改登录密码',
        },
        component: () => import('@/views/mine/change-password/index.vue'),
    },
    {
        path: '/themeSetting',
        name: 'ThemeSetting',
        meta: {
            title: '主题设置',
        },
        component: () => import('@/views/mine/theme/index.vue'),
    },
];

export default routeModuleList;
