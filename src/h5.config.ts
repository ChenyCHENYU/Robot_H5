import { defineH5Config } from '@robot-h5/core';
import { useUserStoreWidthOut } from '@/store/modules/user';

/**
 * @robot-h5/core 配置
 *
 * 通过 defineH5Config 声明式配置，在 main.ts 中 app.use(h5Core, h5Config) 一行注册。
 * 所有 Hook（useCamera / useLocation / useFileUpload 等）自动读取此配置。
 */
export default defineH5Config({
    // 文件上传配置
    upload: {
        action: '/api/file/upload',
        headers: (): Record<string, string> => {
            const userStore = useUserStoreWidthOut();
            const token = userStore.getToken;
            return token ? { Authorization: `Bearer ${token}` } : {};
        },
    },

    // 图片压缩
    image: {
        maxSize: 1024, // KB
        quality: 0.8,
    },

    // GPS 定位
    location: {
        coordType: 'gcj02',
        timeout: 10000,
    },
});
