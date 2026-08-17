<template>
    <div class="entrust-page">
        <C_NavBar title="过磅委托列表" />

        <!-- 筛选区域 -->
        <div class="entrust-page__filter">
            <!-- Tab 切换：计划编号 / 委托单号 -->
            <div class="entrust-page__tabs">
                <span
                    class="entrust-page__tab"
                    :class="{ 'entrust-page__tab--active': searchTab === 'plan' }"
                    @click="switchTab('plan')"
                >
                    计划编号
                </span>
                <span
                    class="entrust-page__tab"
                    :class="{ 'entrust-page__tab--active': searchTab === 'entrust' }"
                    @click="switchTab('entrust')"
                >
                    委托单号
                </span>
            </div>
            <!-- 搜索输入框 -->
            <div class="entrust-page__row">
                <div class="entrust-page__search-box">
                    <VanField
                        v-model="searchKeyword"
                        :placeholder="searchTab === 'plan' ? '请输入计划编号' : '请输入委托单号'"
                        clearable
                        class="entrust-page__search-input"
                    />
                </div>
            </div>
            <!-- 车牌号 -->
            <div class="entrust-page__row">
                <div class="entrust-page__search-box">
                    <VanField
                        v-model="query.carNo"
                        placeholder="请输入车牌号"
                        clearable
                        class="entrust-page__search-input"
                    />
                </div>
            </div>
            <!-- 过磅类型 -->
            <div class="entrust-page__row">
                <div class="entrust-page__filter-item" @click="showTypePicker = true">
                    <span class="entrust-page__filter-label">过磅类型</span>
                    <span class="entrust-page__filter-value">{{ query.deployType ? getDeployTypeLabel(query.deployType) : '全部' }}</span>
                    <VanIcon name="arrow-down" size="12" />
                </div>
            </div>
            <!-- 查询 + 重置 -->
            <div class="entrust-page__row">
                <VanButton type="primary" round class="entrust-page__filter-btn" @click="handleSearch">查询</VanButton>
                <VanButton round class="entrust-page__filter-btn" @click="handleReset">重置</VanButton>
            </div>
        </div>

        <!-- 过磅类型选择弹窗 -->
        <VanPopup v-model:show="showTypePicker" position="bottom" round>
            <VanPicker
                :columns="typeOptions"
                @confirm="onTypeConfirm"
                @cancel="showTypePicker = false"
                title="选择过磅类型"
            />
        </VanPopup>

        <!-- 列表 -->
        <VanPullRefresh v-model="refreshing" @refresh="onRefresh">
            <VanList
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                class="entrust-page__list"
            >
                <div v-for="item in dataList" :key="item.id" class="entrust-page__card">
                    <!-- 卡片头部：蓝色竖条 + 标题 + 状态标签 -->
                    <div class="entrust-page__card-header">
                        <div class="entrust-page__header-left">
                            <span class="entrust-page__blue-bar"></span>
                            <span class="entrust-page__header-title">{{ item.deployPlanNo || '过磅计划' }}</span>
                        </div>
                        <div class="entrust-page__header-right">
                            <VanTag
                                v-if="String(item.flagPriority) === '1' && item.weighStatus !== 'COMPLETE'"
                                type="warning"
                                round
                                class="entrust-page__priority-tag"
                            >
                                优先过磅
                            </VanTag>
                            <VanTag
                                :type="getWeighStatusTagType(item.weighStatus)"
                                round
                                class="entrust-page__status-tag"
                            >
                                {{ getWeighStatusLabel(item.weighStatus) }}
                            </VanTag>
                        </div>
                    </div>

                    <div class="entrust-page__divider"></div>

                    <!-- 卡片内容 -->
                    <div class="entrust-page__card-body">
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">委托单号</span>
                            <span class="entrust-page__info-value">{{ item.entrustNo || '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">过磅类型</span>
                            <span class="entrust-page__info-value">{{ getDeployTypeLabel(item.deployType) }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">客户</span>
                            <span class="entrust-page__info-value">{{ item.cust || '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">物料名称</span>
                            <span class="entrust-page__info-value">{{ item.matName || '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">物料规格</span>
                            <span class="entrust-page__info-value">{{ item.matSpec || '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">计划重量</span>
                            <span class="entrust-page__info-value">{{ item.planWgt != null ? item.planWgt + ' ' + (item.unit || '') : '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">车牌号</span>
                            <span class="entrust-page__info-value">{{ item.carNo || '-' }}</span>
                        </div>
                        <div class="entrust-page__info-row">
                            <span class="entrust-page__info-label">业务日期</span>
                            <span class="entrust-page__info-value">{{ item.deployBusDate || '-' }}</span>
                        </div>
                    </div>

                    <!-- 卡片底部 -->
                    <div class="entrust-page__divider"></div>
                    <div class="entrust-page__card-footer">
                        <!-- 设置优先过磅按钮 -->
                        <VanButton
                            v-if="showSetPriorityBtn(item)"
                            plain
                            hairline
                            size="small"
                            type="warning"
                            class="entrust-page__footer-btn entrust-page__footer-btn--outline"
                            @click.stop="handleSetPriority(item)"
                        >
                            优先过磅
                        </VanButton>
                        <!-- 查看条形码（PDF417 二维条码） -->
                        <VanButton
                            v-if="!item.weighStatus || item.weighStatus === 'PENDING'"
                            plain
                            hairline
                            size="small"
                            type="default"
                            class="entrust-page__footer-btn entrust-page__footer-btn--outline entrust-page__footer-btn--primary-border"
                            @click.stop="handleShowBarcode(item)"
                        >
                            条形码
                        </VanButton>
                        <span class="entrust-page__footer-spacer"></span>
                        <VanButton
                            size="small"
                            type="primary"
                            class="entrust-page__footer-btn entrust-page__footer-btn--solid"
                            @click="goDetail(item)"
                        >
                            查看
                        </VanButton>
                    </div>
                </div>

                <VanEmpty v-if="dataList.length === 0 && !loading" description="暂无委托数据" />
            </VanList>
        </VanPullRefresh>

        <!-- 过磅条形码（PDF417 二维条码）弹窗 -->
        <VanPopup
            v-model:show="barcodeVisible"
            round
            :style="{ padding: '20px 16px 24px', textAlign: 'center', width: '92vw', maxWidth: '420px' }"
        >
            <div class="entrust-page__barcode">
                <div class="entrust-page__barcode-title">过磅条形码（二维条码）</div>
                <VanLoading v-if="barcodeLoading" size="48" style="margin: 32px 0;" />
                <img v-else-if="barcodeImageSrc" :src="barcodeImageSrc" alt="过磅条形码" class="entrust-page__barcode-img" />
                <div v-else class="entrust-page__barcode-empty">条形码生成失败</div>
            </div>
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { onActivated } from 'vue';
    import { useRouter } from 'vue-router';
    import { showSuccessToast, showFailToast, showConfirmDialog, type TagType } from 'vant';
    import { getDeployPlanList, setPriority, getMapByDicSn, generateWeighQr } from '@/api/deploy-plan';

    defineOptions({ name: 'transEntrust' });

    const router = useRouter();

    // 字典数据
    const weighStatusMap = ref<Record<string, string>>({});
    const deployTypeMap = ref<Record<string, string>>({});

    // 获取字典
    async function fetchDictData() {
        try {
            const res1: any = await getMapByDicSn('am_weigh_status');
            if (res1.data) weighStatusMap.value = res1.data;

            const res2: any = await getMapByDicSn('weigh_bill_type');
            if (res2.data) deployTypeMap.value = res2.data;
        } catch {
            console.warn('字典接口请求失败');
        }
    }

    function getWeighStatusLabel(key: string) {
        if (!key) return '待过磅';
        return weighStatusMap.value[key] || key;
    }

    function getDeployTypeLabel(key: string) {
        if (!key) return '-';
        return deployTypeMap.value[key] || key;
    }

    // 列表数据
    const dataList = ref<any[]>([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);

    // 分页
    const pagination = reactive({
        current: 1,
        size: 10,
        total: 0,
    });

    // 查询条件
    const query = reactive({
        deployPlanNo: '',
        deployType: '',
        entrustNo: '',
        carNo: '',
    });

    // 搜索 tab 切换
    const searchTab = ref('plan');
    const searchKeyword = ref('');

    function switchTab(tab: string) {
        searchTab.value = tab;
        searchKeyword.value = '';
    }

    // 过磅类型选择
    const showTypePicker = ref(false);
    const typeOptions = computed(() => {
        const opts: { text: string; value: string }[] = [{ text: '全部', value: '' }];
        for (const key in deployTypeMap.value) {
            opts.push({ text: deployTypeMap.value[key], value: key });
        }
        if (opts.length === 1) {
            opts.push({ text: '临时过磅', value: 'T' }, { text: '厂内调拨', value: 'TFIN' });
        }
        return opts;
    });

    function onTypeConfirm({ selectedOptions }: any) {
        const selected = selectedOptions[0];
        query.deployType = selected.value;
        showTypePicker.value = false;
    }

    /**
     * 是否显示「设置优先过磅」按钮（与后端 list 回填的 peerActivePlanCount、sameCarHasPriorityPlan 一致）：
     * 同车未完成计划数 > 1，且同车尚无优先计划，且当前计划未完成、未标记优先。
     */
    function showSetPriorityBtn(item: any) {
        if (!item || item.weighStatus === 'COMPLETE') return false;
        if (String(item.flagPriority) === '1') return false;
        const cnt = Number(item.peerActivePlanCount);
        if (!Number.isFinite(cnt) || cnt <= 1) return false;
        if (item.sameCarHasPriorityPlan === true) return false;
        return true;
    }

    function handleSearch() {
        query.deployPlanNo = '';
        query.entrustNo = '';
        if (searchTab.value === 'plan') {
            query.deployPlanNo = searchKeyword.value;
        } else {
            query.entrustNo = searchKeyword.value;
        }
        pagination.current = 1;
        dataList.value = [];
        finished.value = false;
        fetchList();
    }

    function handleReset() {
        searchKeyword.value = '';
        query.deployPlanNo = '';
        query.deployType = '';
        query.entrustNo = '';
        query.carNo = '';
        handleSearch();
    }

    function onRefresh() {
        pagination.current = 1;
        dataList.value = [];
        finished.value = false;
        fetchList();
    }

    function onLoad() {
        fetchList();
    }

    async function fetchList() {
        loading.value = true;
        try {
            // 与后端 AmDeployPlanController.list(JhPage page, AmDeployPlan query) 一致：分页用 current/size，条件为实体扁平字段名
            const params: Record<string, any> = {
                current: pagination.current,
                size: pagination.size,
                // 仅移动端开启同车计划统计，供「优先过磅」按钮显示规则使用
                enablePeerFlagCalc: true,
            };
            if (query.deployPlanNo) params.deployPlanNo = query.deployPlanNo;
            if (query.deployType) params.deployType = query.deployType;
            if (query.entrustNo) params.entrustNo = query.entrustNo;
            const carNoQ = query.carNo?.trim();
            if (carNoQ) params.carNo = carNoQ;

            const res: any = await getDeployPlanList(params);
            const records = res.data?.records || [];
            const total = res.data?.total || 0;

            if (refreshing.value) {
                dataList.value = [];
                refreshing.value = false;
            }

            dataList.value = [...dataList.value, ...records];
            dataList.value.sort((a: any, b: any) => {
                const ap = String(a.flagPriority) === '1' ? 0 : 1;
                const bp = String(b.flagPriority) === '1' ? 0 : 1;
                return ap - bp;
            });
            pagination.total = total;
            pagination.current++;

            if (dataList.value.length >= total) {
                finished.value = true;
            }
        } catch {
            showFailToast('获取列表失败');
            finished.value = true;
        } finally {
            loading.value = false;
        }
    }

    function getWeighStatusTagType(status: string): TagType {
        if (!status) return 'default';
        const map: Record<string, TagType> = {
            PENDING: 'default',
            ONCE_COMPLETE: 'primary',
            TWICE_COMPLETE: 'primary',
            COMPLETE: 'success',
            EXCEPTION: 'danger',
            SUSPEND: 'warning',
        };
        return map[status] || 'default';
    }

    // 设置优先过磅
    async function handleSetPriority(item: any) {
        try {
            await showConfirmDialog({ title: '确认操作', message: '确定将该计划设为优先过磅吗？' });
        } catch {
            return;
        }

        try {
            await setPriority(item.id);
            showSuccessToast('设置成功');
            handleSearch();
        } catch {
            showFailToast('设置失败');
        }
    }

    // 条形码弹窗（后端为 PDF417 二维条码图）
    const barcodeVisible = ref(false);
    const barcodeImageSrc = ref('');
    const barcodeLoading = ref(false);

    async function handleShowBarcode(item: any) {
        barcodeImageSrc.value = '';
        barcodeVisible.value = true;
        barcodeLoading.value = true;
        try {
            const res: any = await generateWeighQr(item.deployPlanNo, item.carNo);
            if (res.data) {
                const base64Str = res.data;
                barcodeImageSrc.value = base64Str.startsWith('data:') ? base64Str : `data:image/png;base64,${base64Str}`;
            }
        } catch {
            showFailToast('条形码生成失败');
        } finally {
            barcodeLoading.value = false;
        }
    }

    // 跳转详情页
    function goDetail(item: any) {
        router.push({
            path: '/transferWeighing/entrustList/detail',
            query: { id: item.id },
        });
    }

    onActivated(() => {
        handleSearch();
    });

    fetchDictData();
    handleSearch();
</script>
