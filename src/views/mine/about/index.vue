<script setup lang="ts">
    import './index.scss';

    const { pkg, lastBuildTime } = __APP_INFO__;
    const { dependencies, devDependencies, name, version, description } = pkg;

    const activeTab = ref('prod');

    const envInfo = [
        { label: 'Vue', value: `v${pkg.dependencies.vue}` },
        { label: 'Vite', value: `v${pkg.devDependencies.vite}` },
        { label: 'TypeScript', value: `v${pkg.devDependencies.typescript}` },
        { label: 'Vant', value: `v${pkg.dependencies.vant}` },
    ];
</script>

<template>
    <div class="about-page">
        <CNavBar />

        <div class="about-page__body">
            <!-- 项目信息卡片 -->
            <div class="about-page__hero">
                <div class="about-page__hero-shine" />
                <div class="about-page__hero-orb about-page__hero-orb--1" />
                <div class="about-page__hero-orb about-page__hero-orb--2" />
                <div class="about-page__logo">
                    <C_Icon name="ph:robot-bold" :size="36" color="var(--ds-accent)" />
                </div>
                <h2 class="about-page__name">{{ name }}</h2>
                <span class="about-page__version">v{{ version }}</span>
                <p class="about-page__desc">{{ description || 'Vue 3 移动端工程脚手架' }}</p>
                <div class="about-page__build">
                    <i class="i-ph:clock-bold" />
                    编译于 {{ lastBuildTime }}
                </div>
            </div>

            <!-- 技术栈 -->
            <div class="about-page__section">
                <h3 class="about-page__section-title">技术栈</h3>
                <div class="about-page__env-grid">
                    <div v-for="item in envInfo" :key="item.label" class="about-page__env-item">
                        <div class="about-page__env-shine" />
                        <span class="about-page__env-label">{{ item.label }}</span>
                        <span class="about-page__env-value">{{ item.value }}</span>
                    </div>
                </div>
            </div>

            <!-- 依赖列表 -->
            <div class="about-page__section">
                <h3 class="about-page__section-title">依赖清单</h3>
                <VanTabs v-model:active="activeTab" shrink line-width="20" class="about-page__tabs">
                    <VanTab title="生产依赖" name="prod">
                        <div class="about-page__dep-group">
                            <div class="about-page__dep-shine" />
                            <div v-for="[key, value] in Object.entries(dependencies)" :key="key" class="about-page__dep-item">
                                <span class="about-page__dep-pkg">{{ key }}</span>
                                <span class="about-page__dep-ver">{{ value }}</span>
                            </div>
                        </div>
                    </VanTab>
                    <VanTab title="开发依赖" name="dev">
                        <div class="about-page__dep-group">
                            <div class="about-page__dep-shine" />
                            <div v-for="[key, value] in Object.entries(devDependencies)" :key="key" class="about-page__dep-item">
                                <span class="about-page__dep-pkg">{{ key }}</span>
                                <span class="about-page__dep-ver about-page__dep-ver--dev">{{ value }}</span>
                            </div>
                        </div>
                    </VanTab>
                </VanTabs>
            </div>
        </div>
    </div>
</template>
