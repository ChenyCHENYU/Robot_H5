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
  // ─── Chart（从 TabBar 移入子页面） ─────────────────
  {
    path: '/chart',
    name: 'Chart',
    meta: {
      title: 'ECharts 图表',
    },
    component: () => import('@/views/chart/index.vue'),
  },
  // ─── Template 子页面 ──────────────────────────────
  {
    path: '/template/:domain',
    name: 'TemplateDomain',
    meta: {
      title: '模板模块',
    },
    component: () => import('@/views/template/domain/index.vue'),
  },
  // ─── Hooks 演示页面 ──────────────────────────────
  {
    path: '/hooks/camera',
    name: 'HookCamera',
    meta: { title: '拍照相册' },
    component: () => import('@/views/hooks/camera/index.vue'),
  },
  {
    path: '/hooks/location',
    name: 'HookLocation',
    meta: { title: 'GPS 定位' },
    component: () => import('@/views/hooks/location/index.vue'),
  },
  {
    path: '/hooks/qr-scanner',
    name: 'HookQrScanner',
    meta: { title: '扫码识别' },
    component: () => import('@/views/hooks/qr-scanner/index.vue'),
  },
  {
    path: '/hooks/nfc',
    name: 'HookNfc',
    meta: { title: 'NFC' },
    component: () => import('@/views/hooks/nfc/index.vue'),
  },
  {
    path: '/hooks/file-upload',
    name: 'HookFileUpload',
    meta: { title: '文件上传' },
    component: () => import('@/views/hooks/file-upload/index.vue'),
  },
  {
    path: '/hooks/file-download',
    name: 'HookFileDownload',
    meta: { title: '文件下载' },
    component: () => import('@/views/hooks/file-download/index.vue'),
  },
  {
    path: '/hooks/file-preview',
    name: 'HookFilePreview',
    meta: { title: '文件预览' },
    component: () => import('@/views/hooks/file-preview/index.vue'),
  },
  {
    path: '/hooks/signature',
    name: 'HookSignature',
    meta: { title: '手写签名' },
    component: () => import('@/views/hooks/signature/index.vue'),
  },
  {
    path: '/hooks/audio-recorder',
    name: 'HookAudioRecorder',
    meta: { title: '录音' },
    component: () => import('@/views/hooks/audio-recorder/index.vue'),
  },
  {
    path: '/hooks/video-recorder',
    name: 'HookVideoRecorder',
    meta: { title: '视频录制' },
    component: () => import('@/views/hooks/video-recorder/index.vue'),
  },
  {
    path: '/hooks/bluetooth',
    name: 'HookBluetooth',
    meta: { title: '蓝牙连接' },
    component: () => import('@/views/hooks/bluetooth/index.vue'),
  },
  {
    path: '/hooks/offline-storage',
    name: 'HookOfflineStorage',
    meta: { title: '离线存储' },
    component: () => import('@/views/hooks/offline-storage/index.vue'),
  },
  {
    path: '/hooks/push-notification',
    name: 'HookPushNotification',
    meta: { title: '推送通知' },
    component: () => import('@/views/hooks/push-notification/index.vue'),
  },
  {
    path: '/hooks/watermark',
    name: 'HookWatermark',
    meta: { title: '图片水印' },
    component: () => import('@/views/hooks/watermark/index.vue'),
  },
  {
    path: '/hooks/permission',
    name: 'HookPermission',
    meta: { title: '权限管理' },
    component: () => import('@/views/hooks/permission/index.vue'),
  },
];

export default routeModuleList;
