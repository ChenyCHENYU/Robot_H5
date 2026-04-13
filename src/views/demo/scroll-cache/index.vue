<script setup lang="ts">
    import './index.scss';
    import { useScrollCache } from '@/hooks/useScrollCache';

    defineOptions({ name: 'ScrollCache' });

    const list = ref<number[]>([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const cacheBox = ref(null);

    const onLoad = () => {
        setTimeout(() => {
            if (refreshing.value) { list.value = []; refreshing.value = false; }
            for (let i = 0; i < 10; i++) list.value.push(list.value.length + 1);
            loading.value = false;
            if (list.value.length >= 40) finished.value = true;
        }, 800);
    };

    const onRefresh = () => { finished.value = false; loading.value = true; onLoad(); };

    onMounted(() => useScrollCache(cacheBox.value));
</script>

<template>
    <div class="sc-page" ref="cacheBox">
        <CNavBar>
            <template #right>
                <van-button size="small" type="primary" to="/dependence">子页面</van-button>
            </template>
        </CNavBar>

        <div class="sc-page__tip">
            <i class="i-ph:info-bold" />
            滑动列表后跳转子页面，返回后查看滚动位置是否恢复
        </div>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
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
            </van-list>
        </van-pull-refresh>
    </div>
</template>
