import { createApp } from 'vue';
import App from './App.vue';
import router, { setupRouter } from './router';
import { setupStore } from '@/store';
import { setupPlugins } from '@/plugins';
import { h5Core } from '@robot-h5/core';
import h5Config from './h5.config';

async function bootstrap() {
    const app = createApp(App);
    // 挂载状态管理
    setupStore(app);
    // 挂载路由
    setupRouter(app);
    // 挂载插件
    setupPlugins(app);
    // 挂载 H5 通用能力（拍照/定位/上传/签名等）
    app.use(h5Core, h5Config);

    await router.isReady();
    // 路由准备就绪后挂载APP实例
    app.mount('#app', true);

    // 等待首帧渲染完成后，平滑退出 App Shell 加载屏
    requestAnimationFrame(() => {
        const shell = document.getElementById('app-shell');
        if (shell) {
            shell.classList.add('shell-exit');
            shell.addEventListener('transitionend', () => {
                shell.remove();
                document.getElementById('app-shell-style')?.remove();
            }, { once: true });
        }
    });
}

void bootstrap();
