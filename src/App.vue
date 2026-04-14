<template>
    <van-config-provider :theme="getThemeMode" :theme-vars="themeVarsCache">
        <div class="h-screen w-full flex flex-col overflow-hidden">
            <CVirtualStatusBar />
            <!-- 用真实 div 承接 flex-1/overflow-hidden，避免 routerView v-slot fallthrough
                 把 overflow:hidden 传递到子路由组件根元素导致内部滚动失效 -->
            <div class="w-full flex-1 min-h-0 overflow-hidden">
                <routerView v-slot="{ Component }">
                    <component :is="Component" />
                </routerView>
            </div>
        </div>
    </van-config-provider>
</template>

<script setup lang="ts">
    import { useTheme } from '@/hooks/useTheme';

    const { getThemeMode, getThemeVars } = useTheme();

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());
</script>
