<script setup lang="ts">
    import './index.scss';
    import { useUserStore } from '@/store/modules/user';

    const { pkg, lastBuildTime } = __APP_INFO__;
    const { dependencies, devDependencies, name, version } = pkg;
    const userStore = useUserStore();
    const { avatar } = userStore.userInfo;
</script>

<template>
    <div class="dep-page">
        <C_NavBar />
        <div class="dep-page__body">
            <div class="dep-page__hero">
                <div class="dep-page__hero-shine" />
                <VanImage class="dep-page__avatar" round fit="cover" :src="avatar" />
                <div class="dep-page__meta">
                    <h2 class="dep-page__name">{{ name }}</h2>
                    <span class="dep-page__version">v{{ version }}</span>
                </div>
                <div class="dep-page__build">
                    <i class="i-ph:clock-bold" />
                    <span>编译于 {{ lastBuildTime }}</span>
                </div>
            </div>
            <div class="dep-page__section">
                <h3 class="dep-page__section-title">生产依赖</h3>
                <div class="dep-page__group">
                    <div class="dep-page__group-shine" />
                    <div v-for="[key, value] in Object.entries(dependencies)" :key="key" class="dep-page__item">
                        <span class="dep-page__pkg">{{ key }}</span>
                        <span class="dep-page__ver">{{ value }}</span>
                    </div>
                </div>
            </div>
            <div class="dep-page__section">
                <h3 class="dep-page__section-title">开发依赖</h3>
                <div class="dep-page__group">
                    <div class="dep-page__group-shine" />
                    <div v-for="[key, value] in Object.entries(devDependencies)" :key="key" class="dep-page__item">
                        <span class="dep-page__pkg">{{ key }}</span>
                        <span class="dep-page__ver dep-page__ver--dev">{{ value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
