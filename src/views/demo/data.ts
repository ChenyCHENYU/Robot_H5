export interface MenuItem {
    title: string;
    desc: string;
    route: string;
    icon: string;
    color: string;
}

export const menuItems: MenuItem[] = [
  {
    title: '主题设置',
    desc: '切换颜色与暗黑模式',
    route: '/themeSetting',
    icon: 'ph:palette-bold',
    color: '#34C759',
  },
  {
    title: '状态缓存',
    desc: 'keep-alive 组件状态持久化',
    route: '/keepAliveDemo',
    icon: 'ph:arrows-counter-clockwise-bold',
    color: '#0071E3',
  },
  {
    title: '404 页面',
    desc: '异常页面兜底方案',
    route: '/404',
    icon: 'ph:warning-bold',
    color: '#FF3B30',
  },
  {
    title: '自定义指令',
    desc: 'Vue 指令扩展合集',
    route: '/directives',
    icon: 'ph:terminal-bold',
    color: '#8E8E93',
  },
  {
    title: 'SVG 图标',
    desc: '矢量图标资源库',
    route: '/svgIcon',
    icon: 'ph:image-bold',
    color: '#FF9500',
  },
  {
    title: 'UnoCSS 样式',
    desc: '原子化工具类演示',
    route: '/unoCss',
    icon: 'ph:paint-brush-bold',
    color: '#FF2D55',
  },
  {
    title: '滚动位置缓存',
    desc: '离开返回恢复位置',
    route: '/scrollCache',
    icon: 'ph:scroll-bold',
    color: '#5AC8FA',
  },
  {
    title: '下拉刷新列表',
    desc: 'Pull-to-refresh 列表',
    route: '/pullRefreshList',
    icon: 'ph:list-bold',
    color: '#007AFF',
  },
  {
    title: '渲染性能优化',
    desc: 'rAF 分片渲染策略',
    route: '/requestAnimationFrame',
    icon: 'ph:lightning-bold',
    color: '#FFCC00',
  },
  {
    title: '弹出层组合',
    desc: 'ActionSheet / Popup / Dialog',
    route: '/popupDemo',
    icon: 'ph:stack-bold',
    color: '#5856D6',
  },
  {
    title: '手势交互',
    desc: '滑动删除 · 拖拽排序 · 滑动操作',
    route: '/gestureDemo',
    icon: 'ph:hand-swipe-right-bold',
    color: '#FF2D55',
  },
  {
    title: '骨架屏',
    desc: 'Skeleton 加载占位方案',
    route: '/skeletonDemo',
    icon: 'ph:layout-bold',
    color: '#8E8E93',
  },
  {
    title: '表单验证',
    desc: '联动校验 · 异步规则 · 多步骤',
    route: '/formDemo',
    icon: 'ph:clipboard-text-bold',
    color: '#30D158',
  },
];
