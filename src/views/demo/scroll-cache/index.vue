<script setup lang="ts">
    import './index.scss';
    import { useScrollCache } from '@/hooks/useScrollCache';

    defineOptions({ name: 'ScrollCache' });

    const list = ref<number[]>([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);

    const onLoad = () => {
        setTimeout(() => {
            if (refreshing.value) { list.value = []; refreshing.value = false; }
            for (let i = 0; i < 10; i++) list.value.push(list.value.length + 1);
            loading.value = false;
            if (list.value.length >= 40) finished.value = true;
        }, 800);
    };

    const onRefresh = () => { finished.value = false; loading.value = true; onLoad(); };

    onMounted(() => useScrollCache());
</script>

<template>
    <div class="sc-page">
        <CNavBar>
            <template #right>
                <VanButton size="small" type="primary" to="/about">子页面</VanButton>
            </template>
        </CNavBar>

        <div class="sc-page__tip">
            <i class="i-ph:info-bold" />
            滑动列表后跳转子页面，返回后查看滚动位置是否恢复
        </div>

        <VanPullRefresh v-model="refreshing" @refresh="onRefresh">
            <VanList
                v-model:loading="loading"
                :finished="finished"
                finished-text="— 没有更多了 —"
                class="sc-page__list"
                @load="onLoad"
            >
                <div v-for="item in list" :key="item" class="sc-page__item">
                    <div class="sc-page__item-index">{{ item }}</div>
                    <span class="sc-page__item-text">列表项 #{{ item }}</span>
                    <i class="i-ph:caret-right-bold sc-page__item-arrow" />
                </div>
            </VanList>
        </VanPullRefresh>
    </div>
</template>
