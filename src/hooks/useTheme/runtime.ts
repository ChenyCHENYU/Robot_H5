import { onScopeDispose, watch } from 'vue';
import { useThemeStore } from '@/store/modules/theme';

/** 主题副作用属于应用生命周期，离开设置页后依然生效。 */
export function useThemeRuntime() {
    const theme = useThemeStore();
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => { if (theme.followSystem) theme.setThemeMode(system.matches ? 'dark' : 'light'); };
    if (system.addEventListener) system.addEventListener('change', syncSystem);
    else system.addListener(syncSystem);
    onScopeDispose(() => {
        if (system.removeEventListener) system.removeEventListener('change', syncSystem);
        else system.removeListener(syncSystem);
    });
    watch(() => theme.followSystem, syncSystem, { immediate: true });
    watch(() => [theme.themeMode, theme.themeColor, theme.fontScale] as const, ([mode, color, scale]) => {
        const root = document.documentElement;
        root.classList.toggle('dark', mode === 'dark');
        root.classList.toggle('light', mode === 'light');
        root.style.setProperty('--ds-accent', color);
        root.style.setProperty('--ds-accent-hover', color);
        root.style.setProperty('--ds-accent-light', `${color}18`);
        root.style.setProperty('--ds-accent-bg', `${color}18`);
        root.style.setProperty('--ds-font-scale', String(scale));
    }, { immediate: true });
}
