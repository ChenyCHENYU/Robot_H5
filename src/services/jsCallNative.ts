import router from '@/router';
import { judgeSystem } from '@miracle-web/utils';

const { isAndroid, isiOS, isMobile } = judgeSystem();

/**
 * @description 封装 JS 调用原生 App 的方法
 * @example JsCallNative.back();
 */
export default class JsCallNative {
    static AppKey = 'android';

    /** 返回上一页 */
    static back() {
        try {
            if (!isMobile) {
                router.go(-1);
            }
            if (isAndroid) {
                (window as Record<string, any>)[this.AppKey].back();
            }
            if (isiOS) {
                window.webkit.messageHandlers.back.postMessage({});
            }
        } catch {
            router.go(-1);
        }
    }
}

