<template>
    <van-config-provider :theme="getThemeMode" :theme-vars="themeVarsCache">
        <div class="h-screen w-full flex flex-col overflow-hidden">
            <CVirtualStatusBar />
            <routerView v-slot="{ Component }" class="w-full flex-1 overflow-hidden">
                <component :is="Component" />
            </routerView>
        </div>
    </van-config-provider>
</template>

<script setup lang="ts">
    import { useTheme } from '@/hooks/useTheme';

    const { getThemeMode, getThemeVars } = useTheme();

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());
</script>
