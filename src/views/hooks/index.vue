<template>
    <div class="hooks-page">
        <!-- Page Header -->
        <div class="hooks-page__header">
            <div class="hooks-page__header-orb hooks-page__header-orb--1" />
            <div class="hooks-page__header-orb hooks-page__header-orb--2" />
            <div class="hooks-page__header-content">
                <h1 class="hooks-page__title">能力中心</h1>
                <p class="hooks-page__subtitle">@robot-h5/core · 设备与系统能力演示</p>
            </div>
        </div>

        <!-- Hook Categories -->
        <div
            v-for="category in hookCategories"
            :key="category.label"
            class="hooks-page__section"
        >
            <h3 class="hooks-page__section-title">{{ category.label }}</h3>
            <div class="hooks-page__group">
                <div class="hooks-page__group-shine" />
                <VanCell
                    v-for="item in category.items"
                    :key="item.route"
                    :title="item.title"
                    :to="item.route"
                    is-link
                    class="hooks-page__cell"
                >
                    <template #icon>
                        <div class="hooks-page__icon-box" :style="{ background: item.color }">
                            <C_Icon :name="item.icon" :size="18" color="#fff" />
                        </div>
                    </template>
                    <template #label>
                        <span class="hooks-page__cell-desc">{{ item.desc }}</span>
                    </template>
                </VanCell>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { hookCategories } from './data';

    defineOptions({ name: 'HooksPage' });
</script>
