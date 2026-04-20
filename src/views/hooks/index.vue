<template>
    <div class="hooks-page">
        <!-- Page Header -->
        <div class="hooks-page__header">
            <div class="hooks-page__header-orb hooks-page__header-orb--1" />
            <div class="hooks-page__header-orb hooks-page__header-orb--2" />
            <div class="hooks-page__header-orb hooks-page__header-orb--3" />
            <div class="hooks-page__header-content">
                <h1 class="hooks-page__title">能力中心</h1>
                <p class="hooks-page__subtitle">@robot-h5/core · 15 个设备与系统能力</p>
                <div class="hooks-page__stats">
                    <span class="hooks-page__stat">
                        <strong>5</strong> 分类
                    </span>
                    <span class="hooks-page__stat-sep" />
                    <span class="hooks-page__stat">
                        <strong>15</strong> Hooks
                    </span>
                    <span class="hooks-page__stat-sep" />
                    <span class="hooks-page__stat">
                        <strong>4</strong> 平台
                    </span>
                </div>
            </div>
        </div>

        <!-- Hook Categories -->
        <div v-for="(category, ci) in hookCategories" :key="category.label" class="hooks-page__section">
            <div class="hooks-page__section-header">
                <span class="hooks-page__section-emoji">{{ category.emoji }}</span>
                <h3 class="hooks-page__section-title">{{ category.label }}</h3>
                <span class="hooks-page__section-count">{{ category.items.length }}</span>
            </div>
            <div class="hooks-page__cards">
                <div
                    v-for="(item, i) in category.items"
                    :key="item.route"
                    class="hooks-page__card"
                    :style="{ '--i': ci * 3 + i }"
                    @click="router.push(item.route)"
                >
                    <div class="hooks-page__card-shine" />
                    <div class="hooks-page__card-icon" :style="{ background: item.color }">
                        <C_Icon :name="item.icon" :size="22" color="#fff" />
                    </div>
                    <div class="hooks-page__card-body">
                        <span class="hooks-page__card-title">{{ item.title }}</span>
                        <span class="hooks-page__card-desc">{{ item.desc }}</span>
                    </div>
                    <div class="hooks-page__card-hook">{{ item.name }}</div>
                    <i class="i-ph:caret-right-bold hooks-page__card-arrow" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { hookCategories } from './data';

    defineOptions({ name: 'HooksPage' });

    const router = useRouter();
</script>
