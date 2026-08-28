import type { ComponentPublicInstance, FunctionalComponent, VNodeChild, PropType as VuePropType } from 'vue';

declare global {
    const __APP_INFO__: {
        pkg: {
            name: string;
            version: string;
            description: string;
            dependencies: Recordable<string>;
            devDependencies: Recordable<string>;
        };
        lastBuildTime: string;
    };

    declare interface Window {
        eruda: any;
        [key: string]: any;
    }

    // vue
    declare type PropType<T> = VuePropType<T>;

    declare type Recordable<T = any> = Record<string, T>;

    declare type ReadonlyRecordable<T = any> = {
        readonly [key: string]: T;
    };

    type VueNode = VNodeChild | JSX.Element;

    export type Writable<T> = {
        -readonly [P in keyof T]: T[P];
    };

    type Nullable<T> = T | null;

    type NonNullable<T> = T extends null | undefined ? never : T;

    type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };
    type TimeoutHandle = ReturnType<typeof setTimeout>;

    type IntervalHandle = ReturnType<typeof setInterval>;

    interface Indexable<T = any> {
        [key: string]: T;
    }

    interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    interface WheelEvent {
        path?: EventTarget[];
    }

    interface ImportMetaEnv extends ViteEnv {
        __: unknown;
    }

    interface ViteEnv {
        VITE_ENV: string;
        VITE_PORT: number;
        VITE_PUBLIC_PATH: string;
        VITE_GLOB_APP_TITLE: string;
        VITE_GLOB_APP_SHORT_NAME: string;
        VITE_USE_MOCK: boolean;
        VITE_OUTPUT_DIR: string;
        VITE_GLOB_API_URL: string;
        VITE_GLOB_API_URL_PREFIX: string;
        VITE_GLOB_APP_ID: string;
        VITE_GLOB_UPLOAD_URL: string;
        VITE_GLOB_IMG_URL_PREFIX: string;
        VITE_PROXY: [string, string][];
        /** 应用运行模式：standalone（独立）| integrated（集成到 mbase） */
        VITE_APP_MODE: 'standalone' | 'integrated';
        /** wl-mbase 门户完整来源，例如 https://ytiop-sit.walsin.com.cn */
        VITE_MBASE_ORIGIN?: string;
        /** 公司上下文同步：server 兼容现有平台；explicit 要求业务接口显式携带 companyId */
        VITE_MBASE_COMPANY_SYNC_MODE?: 'server' | 'explicit';
        /** server 模式下的平台切换公司接口 */
        VITE_MBASE_CHANGE_COMPANY_API?: string;
    }
}

declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
        icon?: string;
        keepAlive?: boolean;
        /** App/PDA 返回键在这些业务根页退出子应用，而不是继续回退 H5 历史。 */
        mbaseRoot?: boolean;
    }
}
