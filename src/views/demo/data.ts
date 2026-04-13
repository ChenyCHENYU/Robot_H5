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
        title: 'keep-alive 缓存',
        desc: '页面状态持久化示例',
        route: '/editNickname',
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
        title: '项目依赖',
        desc: '可视化依赖树',
        route: '/dependence',
        icon: 'ph:package-bold',
        color: '#AF52DE',
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
];
