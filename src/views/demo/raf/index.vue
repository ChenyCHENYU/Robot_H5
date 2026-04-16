<script setup lang="ts">
    import './index.scss';
    import { renderModes } from './data';
    import NormalComplexBlock from './components/NormalComplexBlock.vue';
    import OptimizedComplexBlock from './components/OptimizedComplexBlock.vue';

    const renderMode = ref<'normal' | 'optimized'>('normal');
</script>

<template>
    <div class="raf-page">
        <C_NavBar />
        <div class="raf-page__body">
            <div class="raf-page__hero">
                <div class="raf-page__hero-shine" />
                <div class="raf-page__hero-icon"><i class="i-ph:lightning-bold" /></div>
                <div>
                    <h2 class="raf-page__hero-title">渲染性能优化</h2>
                    <p class="raf-page__hero-desc">对比 rAF 分批渲染 vs 同步全量渲染</p>
                </div>
            </div>

            <div class="raf-page__switcher">
                <div
                    v-for="mode in renderModes"
                    :key="mode.key"
                    class="raf-page__mode"
                    :class="{ 'raf-page__mode--active': renderMode === mode.key }"
                    @click="renderMode = mode.key"
                >
                    <i :class="mode.icon" />
                    {{ mode.label }}
                </div>
            </div>

            <div class="raf-page__tip" :class="renderMode === 'normal' ? 'raf-page__tip--warn' : 'raf-page__tip--ok'">
                <i :class="renderMode === 'normal' ? 'i-ph:warning-bold' : 'i-ph:check-circle-bold'" />
                <span v-if="renderMode === 'normal'">一次性渲染全部元素，体感明显卡顿</span>
                <span v-else>useDefer 分批渲染，UI 流畅响应</span>
            </div>

            <div class="raf-page__demo">
                <NormalComplexBlock v-if="renderMode === 'normal'" />
                <OptimizedComplexBlock v-else />
            </div>
        </div>
    </div>
</template>
