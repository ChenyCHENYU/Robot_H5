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
    path: '/keepAliveDemo',
    name: 'KeepAliveDemo',
    meta: {
      title: '状态缓存',
      keepAlive: true,
    },
    component: () => import('@/views/demo/keep-alive/index.vue'),
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
    path: '/about',
    name: 'About',
    meta: {
      title: '关于',
    },
    component: () => import('@/views/mine/about/index.vue'),
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
  {
    path: '/popupDemo',
    name: 'PopupDemo',
    meta: {
      title: '弹出层组合',
    },
    component: () => import('@/views/demo/popup/index.vue'),
  },
  {
    path: '/gestureDemo',
    name: 'GestureDemo',
    meta: {
      title: '手势交互',
    },
    component: () => import('@/views/demo/gesture/index.vue'),
  },
  {
    path: '/skeletonDemo',
    name: 'SkeletonDemo',
    meta: {
      title: '骨架屏',
    },
    component: () => import('@/views/demo/skeleton/index.vue'),
  },
  {
    path: '/formDemo',
    name: 'FormDemo',
    meta: {
      title: '表单验证',
    },
    component: () => import('@/views/demo/form/index.vue'),
  },
  {
    path: '/cFormDemo',
    name: 'CFormDemo',
    meta: {
      title: '表单组件',
    },
    component: () => import('@/views/demo/c-form/index.vue'),
  },
  {
    path: '/cTableDemo',
    name: 'CTableDemo',
    meta: {
      title: '表格组件',
    },
    component: () => import('@/views/demo/c-table/index.vue'),
  },
  {
    path: '/customerArchive',
    name: 'CustomerArchive',
    meta: {
      title: '客户档案',
    },
    component: () => import('@/views/demo/customer/index.vue'),
  },
  {
    path: '/customerDetail',
    name: 'CustomerDetail',
    meta: {
      title: '客户档案详情',
    },
    component: () => import('@/views/demo/customer/detail.vue'),
  },
  {
    path: '/customerForm',
    name: 'CustomerForm',
    meta: {
      title: '新增客户',
    },
    component: () => import('@/views/demo/customer/form.vue'),
  },
];

export default routeModuleList;
