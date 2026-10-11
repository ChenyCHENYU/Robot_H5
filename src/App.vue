<template>
    <VanConfigProvider class="app-provider" :theme="getThemeMode" :theme-vars="themeVarsCache">
        <div class="app-viewport w-full flex flex-col overflow-hidden">
            <C_VirtualStatusBar />
            <!-- 用真实 div 承接 flex-1，避免 routerView v-slot fallthrough
                 把样式传递到子路由组件根元素导致内部滚动失效
                 overflow-y-auto 让非 Layout 的子页面（demo 等）可滚动 -->
            <div class="app-page-scroll w-full flex-1 min-h-0 overflow-x-hidden overflow-y-auto" data-page-scroll>
                <RouterView v-slot="{ Component, route }">
                    <transition :name="transitionName" mode="out-in">
                        <KeepAlive :include="keepAliveComponents" :key="sessionKey" :max="20">
                            <component :is="Component" :key="route.matched[0]?.path" />
                        </KeepAlive>
                    </transition>
                </RouterView>
            </div>
        </div>
    </VanConfigProvider>
</template>

<script setup lang="ts">
    import { useTheme } from '@/hooks/useTheme';
    import { useThemeStore } from '@/store/modules/theme';
    import { useRouteStore } from '@/store/modules/route';
    import { useUserStore } from '@/store/modules/user';
    import { useThemeRuntime } from '@/hooks/useTheme/runtime';

    defineOptions({ name: 'App' });

    const { getThemeMode, getThemeVars } = useTheme();
    const themeStore = useThemeStore();

    useThemeRuntime();
    const routeStore = useRouteStore();
    const userStore = useUserStore();
    const keepAliveComponents = computed(() => ['MainLayout', ...routeStore.keepAliveComponents]);
    const sessionKey = computed(() => `${userStore.getToken}:${userStore.getCompanyId}`);

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());

    // 页面过渡动画名称：关闭动画时返回空字符串（无过渡）
    const transitionName = computed(() =>
        themeStore.isPageAnimate ? themeStore.pageAnimateType : '',
    );
</script>
