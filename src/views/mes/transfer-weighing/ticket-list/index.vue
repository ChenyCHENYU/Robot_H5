<template>
    <div class="ticket-page">
        <C_NavBar title="磅单列表" />

        <!-- 搜索区域 -->
        <div class="ticket-page__filter">
            <div class="ticket-page__filter-row">
                <div class="ticket-page__search-box">
                    <VanField
                        v-model="query.weighbillNo"
                        placeholder="请输入磅单号"
                        clearable
                        class="ticket-page__search-input"
                    />
                </div>
            </div>
            <!-- 查询 + 重置 -->
            <div class="ticket-page__filter-row">
                <VanButton type="primary" round class="ticket-page__filter-btn" @click="handleSearch">查询</VanButton>
                <VanButton round class="ticket-page__filter-btn" @click="handleReset">重置</VanButton>
            </div>
        </div>

        <!-- 已扣杂 / 未扣杂 切换 -->
        <div class="ticket-page__deduct-tabs">
            <div
                class="ticket-page__deduct-tab"
                :class="{ 'ticket-page__deduct-tab--active': deductTab === 0 }"
                @click="switchDeductTab(0)"
            >
                未扣杂
            </div>
            <div
                class="ticket-page__deduct-tab"
                :class="{ 'ticket-page__deduct-tab--active': deductTab === 1 }"
                @click="switchDeductTab(1)"
            >
                已扣杂
            </div>
        </div>

        <!-- 磅单列表 -->
        <div class="ticket-page__list">
            <VanList
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <div v-for="item in list" :key="item.id" class="ticket-page__card">
                    <!-- 卡片头部：蓝色竖条 + 磅单号 + 状态标签 -->
                    <div class="ticket-page__card-header">
                        <div class="ticket-page__header-left">
                            <span class="ticket-page__blue-bar"></span>
                            <span class="ticket-page__header-title">{{ item.weighbillNo || '-' }}</span>
                        </div>
                        <VanTag :type="getStatusTagType(item.weighbillStatus)" plain round size="medium">
                            {{ getStatusLabel(item.weighbillStatus) }}
                        </VanTag>
                    </div>

                    <div class="ticket-page__divider"></div>

                    <!-- 卡片内容 -->
                    <div class="ticket-page__card-body">
                        <div class="ticket-page__info-row">
                            <span class="ticket-page__info-label">物料名称</span>
                            <span class="ticket-page__info-value">{{ item.matName || '-' }}</span>
                        </div>
                        <div class="ticket-page__info-row">
                            <span class="ticket-page__info-label">车牌号</span>
                            <span class="ticket-page__info-value">{{ item.carNo || '-' }}</span>
                        </div>
                        <div class="ticket-page__info-row">
                            <span class="ticket-page__info-label">净重（t）</span>
                            <span class="ticket-page__info-value">{{ formatNetWgtDisplay(item.netWgt) }}</span>
                        </div>
                        <div class="ticket-page__info-row">
                            <span class="ticket-page__info-label">业务日期</span>
                            <span class="ticket-page__info-value">{{ item.busDate || '-' }}</span>
                        </div>
                    </div>

                    <!-- 卡片底部 -->
                    <div class="ticket-page__divider"></div>
                    <div class="ticket-page__card-footer">
                        <VanButton
                            plain
                            round
                            size="small"
                            type="primary"
                            class="ticket-page__action-btn"
                            @click="goDetail(item)"
                        >
                            查看
                        </VanButton>
                    </div>
                </div>
                <VanEmpty v-if="list.length === 0 && !loading && finished" description="暂无磅单数据" />
            </VanList>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { onActivated } from 'vue';
    import { useRouter } from 'vue-router';
    import { showFailToast, type TagType } from 'vant';
    import { getWeighTicketList } from '@/api/trans-weight-ticket';
    import { weighbillStatusMap, weighbillStatusTagTypeMap, type TicketItem } from './data';

    defineOptions({ name: 'transTicket' });

    const router = useRouter();

    // 扣杂 tab 切换：0 未扣杂，1 已扣杂
    const deductTab = ref(0);

    function switchDeductTab(tab: number) {
        if (deductTab.value === tab) return;
        deductTab.value = tab;
        handleSearch();
    }

    // 查询条件
    const query = reactive({
        weighbillNo: '',
    });

    // 分页
    const page = reactive({ current: 1, size: 10 });
    const list = ref<TicketItem[]>([]);
    const loading = ref(false);
    const finished = ref(false);

    /** 净重仅数字，单位在标签净重（t） */
    function formatNetWgtDisplay(v: any) {
        if (v === null || v === undefined || v === '') return '-';
        const n = Number(v);
        if (!Number.isFinite(n)) return '-';
        return n.toFixed(2);
    }

    function getStatusLabel(status?: string) {
        if (!status) return '未知';
        return weighbillStatusMap[status] || status;
    }

    function getStatusTagType(status?: string): TagType {
        return weighbillStatusTagTypeMap[status ?? ''] || 'default';
    }

    function handleSearch() {
        page.current = 1;
        list.value = [];
        finished.value = false;
        fetchList();
    }

    function handleReset() {
        query.weighbillNo = '';
        deductTab.value = 0;
        handleSearch();
    }

    function onLoad() {
        fetchList();
    }

    async function fetchList() {
        loading.value = true;
        try {
            const params: Record<string, any> = {
                current: page.current,
                size: page.size,
            };
            if (query.weighbillNo) params.weighbillNo = query.weighbillNo;
            params.flagDeduct = deductTab.value;

            const res: any = await getWeighTicketList(params);
            const records = res.data?.records || [];
            list.value = [...list.value, ...records];
            const total = res.data?.total || 0;
            if (list.value.length >= total) {
                finished.value = true;
            } else {
                page.current++;
            }
        } catch {
            showFailToast('获取磅单列表失败');
            finished.value = true;
        } finally {
            loading.value = false;
        }
    }

    function goDetail(item: TicketItem) {
        router.push({
            path: '/transferWeighing/ticketList/detail',
            query: { id: String(item.id) },
        });
    }

    onActivated(() => {
        handleSearch();
    });

    handleSearch();
</script>
