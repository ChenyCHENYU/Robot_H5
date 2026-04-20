<template>
    <div class="example-page">
        <!-- Page Header -->
        <div class="example-page__header">
            <div class="example-page__header-orb example-page__header-orb--1" />
            <div class="example-page__header-orb example-page__header-orb--2" />
            <div class="example-page__header-content">
                <h1 class="example-page__title">组件中心</h1>
                <p class="example-page__subtitle">组件 · 工具 · 功能交互演示</p>
            </div>
        </div>

        <!-- Dev Tools -->
        <div class="example-page__section">
            <h3 class="example-page__section-title">开发工具</h3>
            <div class="example-page__group">
                <div class="example-page__group-shine" />
                <VanCell center title="暗黑模式" class="example-page__cell">
                    <template #icon>
                        <div class="example-page__icon-box" style="background: #5856d6">
                            <C_Icon name="ph:moon-bold" :size="18" color="#fff" />
                        </div>
                    </template>
                    <template #right-icon>
                        <VanSwitch v-model="toggleTheme" size="22" />
                    </template>
                </VanCell>
                <VanCell center title="调试工具" class="example-page__cell">
                    <template #icon>
                        <div class="example-page__icon-box" style="background: #ff9500">
                            <C_Icon name="ph:bug-bold" :size="18" color="#fff" />
                        </div>
                    </template>
                    <template #right-icon>
                        <VanSwitch v-model="isDebug" size="22px" @change="v => setOpenEruda(v)" />
                    </template>
                </VanCell>
            </div>
        </div>

        <!-- Feature List -->
        <div class="example-page__section">
            <h3 class="example-page__section-title">功能示例</h3>
            <div class="example-page__group">
                <div class="example-page__group-shine" />
                <VanCell
                    v-for="(item, i) in menuItems"
                    :key="item.route"
                    :title="item.title"
                    :to="item.route"
                    is-link
                    class="example-page__cell"
                    :style="{ '--i': i }"
                >
                    <template #icon>
                        <div class="example-page__icon-box" :style="{ background: item.color }">
                            <C_Icon :name="item.icon" :size="18" color="#fff" />
                        </div>
                    </template>
                    <template #label>
                        <span class="example-page__cell-desc">{{ item.desc }}</span>
                    </template>
                </VanCell>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { menuItems } from './data';
    import { useTheme } from '@/hooks/useTheme';
    import { useAppStore } from '@/store/modules/app';

    defineOptions({ name: 'DemoPage' });

    const { toggleTheme } = useTheme();
    const { openEruda, setOpenEruda } = useAppStore();
    const isDebug = ref(openEruda);
</script>
