<script setup lang="ts">
    import './index.scss';
    import type { PullRefreshListInstance } from '@/components/C_PullRefreshList/index.vue';

    defineOptions({ name: 'PullRefreshDemo' });

    interface FeedItem {
        id: number;
        title: string;
        desc: string;
        time: string;
        category: string;
        categoryType: string;
        isNew?: boolean;
    }

    const TOTAL = 55;
    const CATEGORIES = [
        { label: '科技', type: 'primary' },
        { label: '财经', type: 'success' },
        { label: '体育', type: 'warning' },
        { label: '娱乐', type: 'danger' },
        { label: '国际', type: 'primary' },
        { label: '社会', type: 'success' },
    ];
    const TITLES = [
        'AI 大模型迎来重大突破，推理速度提升十倍',
        '全球股市强劲上涨，多支指数刷新历史记录',
        '世界杯预选赛激战正酣，各队积分排行更新',
        '年度票房黑马来袭，上映首周破十亿大关',
        '新型城市轨道交通规划出台，惠及百万市民',
        '国际气候峰会达成里程碑式协议，多方签署',
        '新能源汽车渗透率突破 50%，创历史新高',
        '载人航天任务圆满完成，宇航员安全返回',
        '高考改革方案正式发布，新政策明年起实施',
        '数字人民币试点再扩大，多城市同步上线',
    ];

    const lastRefreshTime = ref('');
    const hasLoaded = ref(false);
    const disabledRefresh = ref(false);
    const listRef = ref<PullRefreshListInstance<FeedItem>>();

    const timeAgo = (index: number): string => {
        const mins = [3, 8, 15, 28, 42, 60, 90, 120, 180, 300];
        const m = mins[index % mins.length];
        return m < 60 ? `${m}分钟前` : `${Math.floor(m / 60)}小时前`;
    };

    const makeData = (page: number, size: number, isRefresh: boolean): FeedItem[] => {
        const offset = (page - 1) * size;
        return Array.from({ length: size }, (_, i) => {
            const cat = CATEGORIES[(offset + i) % CATEGORIES.length];
            return {
                id: isRefresh ? Date.now() + i : offset + i + 1,
                title: TITLES[(offset + i) % TITLES.length],
                desc: `第 ${offset + i + 1} 条资讯摘要，点击查看全文详情。`,
                time: isRefresh ? '刚刚' : timeAgo(offset + i),
                category: cat.label,
                categoryType: cat.type,
                isNew: isRefresh,
            };
        });
    };

    const onLoadData = async (pageNo: number, pageSize: number) => {
        // 模拟 900ms 网络延迟，使下拉加载动画可见
        await new Promise<void>((r) => setTimeout(r, 900));
        const isRefresh = hasLoaded.value && pageNo === 1;
        if (!hasLoaded.value) hasLoaded.value = true;
        const data = makeData(pageNo, pageSize, isRefresh);
        if (isRefresh) {
            lastRefreshTime.value = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        }
        listRef.value?.updateList(data, TOTAL);
    };
</script>

<template>
    <div class="prl-page">
        <C_NavBar title="下拉刷新演示" />

        <div class="prl-page__sticky-header">
            <div class="prl-page__banner">
                <span class="prl-page__hint">
                    <i class="i-ph:arrow-fat-lines-down-bold prl-page__hint-icon" />
                    <span>滚到顶部后按住鼠标向下拖即可刷新</span>
                </span>
                <span v-if="lastRefreshTime" class="prl-page__refreshed">
                    <i class="i-ph:check-circle-bold" />
                    {{ lastRefreshTime }} 已刷新
                </span>
            </div>
            <div class="prl-page__toolbar">
                <VanButton
                    size="small"
                    round
                    :type="disabledRefresh ? 'warning' : 'primary'"
                    @click="disabledRefresh = !disabledRefresh"
                >
                    <i
                        :class="disabledRefresh ? 'i-ph:lock-bold' : 'i-ph:lock-open-bold'"
                        style="margin-right: 4px"
                    />
                    {{ disabledRefresh ? '下拉已锁定' : '下拉已开启' }}
                </VanButton>
                <VanButton size="small" round type="danger" plain @click="listRef?.setError()">
                    <i class="i-ph:warning-bold" style="margin-right: 4px" />
                    模拟失败
                </VanButton>
                <VanButton size="small" round plain @click="listRef?.refresh()">
                    <i class="i-ph:arrows-clockwise-bold" style="margin-right: 4px" />
                    手动刷新
                </VanButton>
            </div>
        </div>

        <C_PullRefreshList
            ref="listRef"
            class="prl-page__list"
            :disabled="disabledRefresh"
            @on-load="onLoadData"
        >
            <template #list="{ list }">
                <div class="prl-page__feed">
                    <div
                        v-for="item in list"
                        :key="item.id"
                        :class="['prl-page__item', item.isNew && 'prl-page__item--new']"
                    >
                        <div class="prl-page__item-body">
                            <div class="prl-page__item-top">
                                <VanTag :type="(item.categoryType as any)" size="medium" round>
                                    {{ item.category }}
                                </VanTag>
                                <span v-if="item.isNew" class="prl-page__new-label">
                                    <i class="i-ph:sparkle-bold" />
                                    NEW
                                </span>
                            </div>
                            <p class="prl-page__title">{{ item.title }}</p>
                            <p class="prl-page__desc">{{ item.desc }}</p>
                        </div>
                        <div class="prl-page__item-meta">
                            <span class="prl-page__time">{{ item.time }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </C_PullRefreshList>
    </div>
</template>
