<template>
    <van-config-provider :theme="getThemeMode" :theme-vars="themeVarsCache">
        <div class="h-screen w-full flex flex-col">
            <CVirtualStatusBar />
            <routerView v-slot="{ Component, route }" class="w-full flex-1 overflow-hidden">
                <keep-alive :include="keepAliveComponents">
                    <component
                        :is="Component"
                        :key="route.name"
                    />
                </keep-alive>
            </routerView>
        </div>
    </van-config-provider>
</template>

<script setup lang="ts">
    import { useRouteStore } from '@/store/modules/route';
    import { useTheme } from '@/hooks/useTheme';

    const routeStore = useRouteStore();
    const { getThemeMode, getThemeVars } = useTheme();

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());

    // 需要缓存的路由组件
    const keepAliveComponents = computed(() => routeStore.keepAliveComponents);
</script>
