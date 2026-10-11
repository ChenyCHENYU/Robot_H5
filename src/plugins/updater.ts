import { Updater } from '@/utils/updater';
import { showConfirmDialog } from 'vant';

export const useUpdater = () => {
    if (import.meta.env.DEV) return;
    const updater = new Updater();
    updater.on('update', () => {
        void showConfirmDialog({
            title: '发现新版本', message: '当前工作完成后，可刷新使用新版本。',
            confirmButtonText: '立即刷新', cancelButtonText: '稍后',
        }).then(() => window.location.reload()).catch(() => undefined);
    });
    window.addEventListener('pagehide', () => updater.stopTiming(), { once: true });
    if (import.meta.hot) import.meta.hot.dispose(() => updater.stopTiming());
};
