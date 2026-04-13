<script setup lang="ts">
    import './index.scss';
    import type { PullRefreshListInstance } from '@/components/C_PullRefreshList/index.vue';
    import { showToast } from 'vant';

    defineOptions({ name: 'PullRefreshDemo' });

    interface ListItem { id: number; name: string; }

    const getMockData = ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
        showToast({ message: `加载第 ${pageNo} 页`, position: 'top' });
        const total = 55;
        const allData = Array.from({ length: total }, (_, i) => ({
            id: i + 1,
            name: `用户_${Math.random().toString(36).substring(2, 8)}`,
        }));
        const start = (pageNo - 1) * pageSize;
        return { total, data: allData.slice(start, start + pageSize) };
    };

    const listRef = ref<PullRefreshListInstance<ListItem>>();
    const disabledRefresh = ref(false);

    const onLoadData = async (pageNo: number, pageSize: number) => {
        try {
            const { data, total } = getMockData({ pageNo, pageSize });
            listRef.value?.updateList(data, total);
        } catch {
            listRef.value?.setError();
        }
    };
</script>

<template>
    <div class="prl-page">
        <CNavBar />
        <div class="prl-page__toolbar">
            <van-button
                size="small"
                :type="disabledRefresh ? 'primary' : 'default'"
            >
                {{ disabledRefresh ? '开启下拉刷新' : '关闭下拉刷新' }}
            </van-button>
            <van-button size="small" type="danger" plain @click="listRef?.setError()">
                模拟加载失败
            </van-button>
        </div>

        <CPullRefreshList
            ref="listRef"
            class="prl-page__list"
            :disabled="disabledRefresh"
            @on-load="onLoadData"
        >
            <template #list="{ list }">
                <div class="prl-page__items">
                    <div v-for="item in list" :key="item.id" class="prl-page__item">
                        <div class="prl-page__item-avatar">{{ item.name.slice(-2) }}</div>
                        <div class="prl-page__item-info">
                            <span class="prl-page__item-name">{{ item.name }}</span>
                            <span class="prl-page__item-id">ID: {{ item.id }}</span>
                        </div>
                        <i class="i-ph:caret-right-bold prl-page__item-arrow" />
                    </div>
                </div>
            </template>
        </CPullRefreshList>
    </div>
</template>
