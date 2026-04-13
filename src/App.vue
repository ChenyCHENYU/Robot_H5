<template>
    <van-config-provider :theme="getThemeMode" :theme-vars="themeVarsCache">
        <CVirtualStatusBar />
        <routerView v-slot="{ Component }">
            <component :is="Component" />
        </routerView>
    </van-config-provider>
</template>

<script setup lang="ts">
    import { useTheme } from '@/hooks/useTheme';

    const { getThemeMode, getThemeVars } = useTheme();

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());
</script>
