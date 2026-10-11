<template>
    <VanPullRefresh class="w-full h-full" v-model="isRefreshing" :disabled="disabled || isLoading" @refresh="handleRefresh">
        <!-- 自定义下拉刷新插槽 -->
        <template #pulling="props">
            <slot name="pulling" v-bind="props">
                <div class="mi-default-pulling">
                    {{ pullDownPullingText }}
                </div>
            </slot>
        </template>

        <template #loosing>
            <slot name="loosing">
                <div class="mi-default-loosing">{{ pullDownLoosingText }}</div>
            </slot>
        </template>

        <template #loading>
            <slot name="loading">
                <div class="mi-default-loading">
                    <VanLoading size="22px">{{ pullDownLoadingText }}</VanLoading>
                </div>
            </slot>
        </template>

        <template #success>
            <slot name="loosing">
                <div class="mi-default-success">{{ pullDownSuccessText }}</div>
            </slot>
        </template>

        <VanList
            :loading="isLoading"
            :finished="finished"
            v-model:error="error"
            :immediate-check="immediateCheck"
            :offset="offset"
            @load="handleLoad"
        >
            <!-- 默认插槽用于列表内容 -->
            <template #default>
                <slot name="list" :list="list"></slot>
            </template>

            <!-- 自定义加载状态插槽 -->
            <template #loading>
                <slot name="load-loading">
                    <div class="mi-default-loading">
                        <VanLoading size="22px" v-if="!isRefreshing">
                            {{ pullUpLoadingText }}
                        </VanLoading>
                    </div>
                </slot>
            </template>

            <template #finished>
                <slot name="load-finished">
                    <div class="mi-default-finished">
                        {{ list.length > showFinishedTextNumber ? pullUpFinishedText : '' }}
                    </div>
                </slot>
            </template>

            <template #error>
                <slot name="load-error">
                    <div class="mi-default-error" @click="handleErrorClick">
                        {{ pullUpErrorText }}
                    </div>
                </slot>
            </template>
        </VanList>

        <!-- 支持自定义空状态 -->
        <div v-if="!list.length && !isLoading && !isRefreshing">
            <slot name="empty">
                <VanEmpty :description="emptyDataText"> </VanEmpty>
            </slot>
        </div>
    </VanPullRefresh>
</template>

<script setup lang="ts" generic="T extends ListItem">
    import './index.scss';

    import type { ListItem, PullRefreshListProps, PullRefreshListInstance } from '#/PullRefreshList/type';
    import { usePagination } from '@/hooks/usePagination';

    defineOptions({
        name: 'PullRefreshList',
    });

    const props = withDefaults(defineProps<PullRefreshListProps>(), {
        disabled: false,
        offset: 100,
        immediateCheck: true,
        pageSize: 10,
        showFinishedTextNumber: 6,
        pullDownPullingText: '下拉即可刷新...',
        pullDownLoosingText: '释放立即刷新...',
        pullDownLoadingText: '正在刷新...',
        pullDownSuccessText: '刷新成功',
        pullUpLoadingText: '正在加载...',
        pullUpFinishedText: '没有更多了',
        pullUpErrorText: '加载失败，点击重试',
        emptyDataText: '暂无数据',
    });

    const pagination = usePagination();
    const { loading: isLoading, refreshing: isRefreshing, error } = pagination;
    const finished = ref(false);
    const list = shallowRef<T[]>([]);

    const emit = defineEmits<{
        // 数据加载事件，返回数据和是否是刷新操作
        (e: 'onLoad', page: number, pageSize: number): void;
        // 数据加载完成事件
        (e: 'onLoadSuccess', data: T[], total: number): void;
        // 数据加载失败事件
        (e: 'onLoadError'): void;
    }>();

    function load(refresh = false) {
        const page = pagination.start(refresh);
        if (!page) return;
        if (refresh) finished.value = false;
        emit('onLoad', page, props.pageSize);
    }
    const handleRefresh = () => load(true);
    const handleLoad = () => load();
    const handleErrorClick = () => load();

    function updateList(data: T[], totalCount?: number) {
        if (!pagination.loading.value) return;
        list.value = pagination.refreshing.value ? [...data] : [...list.value, ...data];
        finished.value = totalCount === undefined ? data.length < props.pageSize : list.value.length >= totalCount;
        pagination.succeed();
        emit('onLoadSuccess', data, totalCount ?? list.value.length);
    }
    function setError() { pagination.fail(); emit('onLoadError'); }
    function reset() { list.value = []; finished.value = false; pagination.reset(); }
    const refresh = () => load(true);
    defineExpose<PullRefreshListInstance<T>>({ updateList, setError, reset, refresh, get list() { return list.value; } });
</script>
