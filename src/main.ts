import { createApp } from 'vue';
import App from './App.vue';
import router, { setupRouter } from './router';
import { setupStore } from '@/store';
import { setupPlugins } from '@/plugins';
import { h5Core } from '@robot-h5/core';
import h5Config from './h5.config';
import { applyMbaseHostClass, installMbaseNavigation } from '@/platform/mbase';

async function bootstrap() {
    applyMbaseHostClass();
    const app = createApp(App);
    // 挂载状态管理
    setupStore(app);
    // 先初始化通用能力与可信门户 origin，再安装首路由导航上报。
    app.use(h5Core, h5Config);
    // 在首个路由完成前安装：返回缓存页时也会重新上报标题和导航状态。
    installMbaseNavigation(router);
    // 挂载路由
    setupRouter(app);
    // 挂载插件
    setupPlugins(app);
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
