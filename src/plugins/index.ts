// 引入uno全局样式
import 'virtual:uno.css';
// uno 样式重置
import '@unocss/reset/tailwind-compat.css';
// 引入 svg-icons
import 'virtual:svg-icons-register';
// 引入nprogress样式
import 'nprogress/nprogress.css';
// 引入全局样式
import '@/styles/common.scss';

import NativeCallJs from '@/services/nativeCallJs';
import { vantPlugins } from './miracleComponents';

import { useDirectives } from '@miracle-web/utils';
import { useDevtool } from './devtool';
import { useUpdater } from './updater';

window.NativeCallJs = NativeCallJs;

import inputTop from '@/utils/inputTop';

inputTop.init();

export const setupPlugins = app => {
    vantPlugins(app); // UI组件
    useDirectives(app); // 指令
    useDevtool(); // 禁止开发工具
    useUpdater(); // 检测更新
};
