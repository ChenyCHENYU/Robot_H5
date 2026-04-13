// Vant 函数组件样式
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

// 桌面端适配
import '@vant/touch-emulator';

export const vantPlugins = (_app: ReturnType<typeof import('vue').createApp>) => {
    // Vant 组件通过 auto-import-resolver 按需引入，无需手动注册
};
