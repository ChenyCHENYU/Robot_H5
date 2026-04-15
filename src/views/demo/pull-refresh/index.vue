<script setup lang="ts">
    import './index.scss';
    import type { PullRefreshListInstance } from '@/components/C_PullRefreshList/index.vue';
    import { showToast } from 'vant';

    defineOptions({ name: 'PullRefreshDemo' });

    interface ListItem { id: number; name: string; desc: string; }

    const getMockData = ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
        showToast({ message: `加载第 ${pageNo} 页`, position: 'top' });
        const total = 55;
        const tags = ['前端', '后端', 'UI', '测试', '运维', '产品'];
        const allData = Array.from({ length: total }, (_, i) => ({
            id: i + 1,
            name: `用户_${Math.random().toString(36).substring(2, 8)}`,
            desc: tags[i % tags.length],
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
            <VanButton
                size="small"
                round
                :type="disabledRefresh ? 'warning' : 'primary'"
                @click="disabledRefresh = !disabledRefresh"
            >
                <i :class="disabledRefresh ? 'i-ph:lock-bold' : 'i-ph:lock-open-bold'" style="margin-right:4px" />
                {{ disabledRefresh ? '下拉已关闭' : '下拉已开启' }}
            </VanButton>
            <VanButton size="small" round type="danger" plain @click="listRef?.setError()">
                <i class="i-ph:warning-bold" style="margin-right:4px" />
                模拟失败
            </VanButton>
            <VanButton size="small" round plain @click="listRef?.refresh()">
                <i class="i-ph:arrow-counter-clockwise-bold" style="margin-right:4px" />
                刷新
            </VanButton>
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
                        <VanTag round :type="item.id % 2 === 0 ? 'primary' : 'success'" size="medium">
                            {{ item.desc }}
                        </VanTag>
                    </div>
                </div>
            </template>
        </CPullRefreshList>
    </div>
</template>
