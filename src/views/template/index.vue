<template>
    <div class="template-page">
        <!-- Page Header -->
        <div class="template-page__header">
            <div class="template-page__header-orb template-page__header-orb--1" />
            <div class="template-page__header-orb template-page__header-orb--2" />
            <div class="template-page__header-content">
                <h1 class="template-page__title">模板中心</h1>
                <p class="template-page__subtitle">业务领域 · 场景模板 · 开箱即用</p>
            </div>
        </div>

        <!-- Domain Grid -->
        <div class="template-page__section">
            <div class="template-page__grid">
                <div
                    v-for="item in domainList"
                    :key="item.code"
                    class="template-page__card"
                    @click="goToDomain(item)"
                >
                    <div class="template-page__card-shine" />
                    <div class="template-page__card-icon" :style="{ background: item.color }">
                        <C_Icon :name="item.icon" :size="28" color="#fff" />
                    </div>
                    <div class="template-page__card-body">
                        <span class="template-page__card-code">{{ item.code }}</span>
                        <h3 class="template-page__card-name">{{ item.name }}</h3>
                        <p class="template-page__card-desc">{{ item.desc }}</p>
                    </div>
                    <C_Icon
                        name="ph:caret-right-bold"
                        :size="14"
                        color="var(--ds-text-tertiary)"
                        class="template-page__card-arrow"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { domainList, type DomainItem } from './data';

    defineOptions({ name: 'TemplatePage' });

    const router = useRouter();

    function goToDomain(item: DomainItem) {
        router.push(`/template/${item.slug}`);
    }
</script>
