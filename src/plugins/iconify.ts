/**
 * 将本地安装的 @iconify-json/* 图标集注册到 @iconify/vue 运行时。
 *
 * 背景：@iconify/vue 的 <Icon> 组件默认在首次渲染时通过网络请求
 *   https://api.iconify.design/<prefix>.json 获取图标数据，即使项目已通过
 *   npm 安装了 @iconify-json/* 包，这些包仅被 @unocss/preset-icons 用于
 *   编译期 CSS 生成，并不会自动注册到 Iconify JS 运行时。
 *
 * 解决方案：在应用启动时同步调用 addCollection，将所有图标数据预注册到
 *   内存缓存中，后续 <Icon> 渲染时直接命中缓存，完全离线、零延迟。
 */
import { addCollection } from '@iconify/vue';

// ---- 按需引入各图标集 JSON ----
import bxs from '@iconify-json/bxs/icons.json';
import carbon from '@iconify-json/carbon/icons.json';
import ic from '@iconify-json/ic/icons.json';
import iconamoon from '@iconify-json/iconamoon/icons.json';
import mage from '@iconify-json/mage/icons.json';
import mdi from '@iconify-json/mdi/icons.json';
import mingcute from '@iconify-json/mingcute/icons.json';
import ph from '@iconify-json/ph/icons.json';
import tabler from '@iconify-json/tabler/icons.json';

export function setupIconify() {
    // 注册全部图标集到运行时内存
    [bxs, carbon, ic, iconamoon, mage, mdi, mingcute, ph, tabler].forEach((collection) => {
        addCollection(collection as Parameters<typeof addCollection>[0]);
    });
}
