import { acceptHMRUpdate, defineStore } from 'pinia';
import { store } from '@/store';
import { setting, type IThemeState } from '@/utils/const/theme';
import { decryptAES } from '@miracle-web/utils';

const { themeMode, themeColor, themeColorList, isPageAnimate, pageAnimateType, fontScale, followSystem } = setting;


export const useThemeStore = defineStore('app-theme-store', {
    state: (): IThemeState => ({
        themeMode,
        themeColor,
        themeColorList,
        isPageAnimate,
        pageAnimateType,
        fontScale,
        followSystem,
    }),
    getters: {
        getThemeMode(): 'light' | 'dark' {
            return this.themeMode;
        },
        getThemeColor(): string {
            return this.themeColor;
        },
        getThemeColorList(): string[] {
            return this.themeColorList;
        },
        getIsPageAnimate(): boolean {
            return this.isPageAnimate;
        },
        getPageAnimateType(): string {
            return this.pageAnimateType;
        },
        getFontScale(): number {
            return this.fontScale;
        },
        getFollowSystem(): boolean {
            return this.followSystem;
        },
    },
    actions: {
        setThemeMode(mode: 'light' | 'dark'): void {
            this.themeMode = mode;
        },
        setPageAnimateType(type: string): void {
            this.pageAnimateType = type;
        },
        setFontScale(scale: number): void {
            this.fontScale = Math.min(1.15, Math.max(0.85, scale));
        },
        setFollowSystem(follow: boolean): void {
            this.followSystem = follow;
        },
    },
    // 开启数据缓存
    persist: {
        key: 'THEME-SETTING',
        storage: window.localStorage,
        serializer: {
            serialize: JSON.stringify,
            deserialize: (value: string) => {
                try { return JSON.parse(value); }
                catch {
                    // 兼容旧版本生产环境的加密主题数据。
                    try { return JSON.parse(decryptAES(value)); }
                    catch { return { ...setting }; }
                }
            },
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
}

// Need to be used outside the setup
export function useThemeStoreWithOut() {
    return useThemeStore(store);
}
