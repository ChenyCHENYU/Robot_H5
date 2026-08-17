<template>
    <div class="home-page">
        <div class="home-page__header" />

        <div class="home-page__main">
            <div v-for="(group, index) in menuGroups" :key="index" class="home-page__group">
                <div class="home-page__group-title">{{ group.text }}</div>
                <div class="home-page__grid">
                    <div
                        v-for="(menu, idx) in group.children"
                        :key="idx"
                        class="home-page__item"
                        @click="menuClick(menu)"
                    >
                        <VanBadge :content="menu.content" :show-zero="false">
                            <img :src="menu.icon" alt="" class="home-page__icon" />
                        </VanBadge>
                        <div class="home-page__item-title">{{ menu.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useRouter } from 'vue-router';
    import { menuGroups, type HomeMenu } from './data';

    defineOptions({ name: 'HomePage' });

    const router = useRouter();

    function menuClick(menu: HomeMenu) {
        router.push({ path: menu.path });
    }
</script>
