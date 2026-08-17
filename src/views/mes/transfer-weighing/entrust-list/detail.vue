<template>
    <div class="entrust-detail-page">
        <C_NavBar title="计划详情" />

        <div class="entrust-detail-page__content" v-if="currentItem">
            <!-- 基本信息 -->
            <div class="entrust-detail-page__section">
                <div class="entrust-detail-page__section-header">
                    <span class="entrust-detail-page__blue-bar"></span>
                    <span class="entrust-detail-page__section-title">基本信息</span>
                    <VanTag
                        :type="getWeighStatusTagType(currentItem.weighStatus)"
                        plain
                        round
                        size="medium"
                        style="margin-left: auto"
                    >
                        {{ getWeighStatusLabel(currentItem.weighStatus) }}
                    </VanTag>
                </div>
                <div class="entrust-detail-page__divider"></div>
                <div class="entrust-detail-page__section-body">
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">计划编号</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.deployPlanNo || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">委托单号</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.entrustNo || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">过磅类型</span>
                        <span class="entrust-detail-page__info-value">{{ getDeployTypeLabel(currentItem.deployType) }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">调拨单位</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.deployDept || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">物流组织</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.logisticsOrg || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">客户</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.cust || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">业务日期</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.deployBusDate || '-' }}</span>
                    </div>
                </div>
            </div>

            <!-- 物料信息 -->
            <div class="entrust-detail-page__section">
                <div class="entrust-detail-page__section-header">
                    <span class="entrust-detail-page__blue-bar"></span>
                    <span class="entrust-detail-page__section-title">物料信息</span>
                </div>
                <div class="entrust-detail-page__divider"></div>
                <div class="entrust-detail-page__section-body">
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">物料编号</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.matNo || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">物料名称</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.matName || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">物料规格</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.matSpec || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">计量单位</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.unit || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">计划数量</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.planQty ?? '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">计划重量</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.planWgt ?? '-' }}</span>
                    </div>
                </div>
            </div>

            <!-- 运输信息 -->
            <div class="entrust-detail-page__section">
                <div class="entrust-detail-page__section-header">
                    <span class="entrust-detail-page__blue-bar"></span>
                    <span class="entrust-detail-page__section-title">运输信息</span>
                </div>
                <div class="entrust-detail-page__divider"></div>
                <div class="entrust-detail-page__section-body">
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">发送组织</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.sendOrg || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">发送仓库</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.sendWh || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">提货方式</span>
                        <span class="entrust-detail-page__info-value">{{ getPickupModeLabel(currentItem.pickupMode) }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">称重方式</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.weighMode || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">磅房编号</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.wbNo || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">车牌号</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.carNo || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">司机名称</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.driverName || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">司机电话</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.driverContactPhone || '-' }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">执行日期</span>
                        <span class="entrust-detail-page__info-value">{{ currentItem.planStartDate || '-' }}</span>
                    </div>
                </div>
            </div>

            <!-- 重量信息（过磅完成后显示） -->
            <div
                class="entrust-detail-page__section"
                v-if="currentItem.onceWgt != null || currentItem.twiceWgt != null || currentItem.netWgt != null"
            >
                <div class="entrust-detail-page__section-header">
                    <span class="entrust-detail-page__blue-bar"></span>
                    <span class="entrust-detail-page__section-title">重量信息</span>
                </div>
                <div class="entrust-detail-page__divider"></div>
                <div class="entrust-detail-page__weight-cards">
                    <div class="entrust-detail-page__weight-card" v-if="currentItem.onceWgt != null">
                        <div class="entrust-detail-page__weight-label">皮重（t）</div>
                        <div class="entrust-detail-page__weight-value">{{ formatWeightVal(currentItem.onceWgt) }}</div>
                    </div>
                    <div class="entrust-detail-page__weight-card" v-if="currentItem.twiceWgt != null">
                        <div class="entrust-detail-page__weight-label">毛重（t）</div>
                        <div class="entrust-detail-page__weight-value">{{ formatWeightVal(currentItem.twiceWgt) }}</div>
                    </div>
                    <div class="entrust-detail-page__weight-card" v-if="currentItem.netWgt != null">
                        <div class="entrust-detail-page__weight-label">净重（t）</div>
                        <div class="entrust-detail-page__weight-value entrust-detail-page__weight-value--highlight">{{ formatWeightVal(currentItem.netWgt) }}</div>
                    </div>
                </div>
            </div>

            <!-- 状态信息 -->
            <div class="entrust-detail-page__section">
                <div class="entrust-detail-page__section-header">
                    <span class="entrust-detail-page__blue-bar"></span>
                    <span class="entrust-detail-page__section-title">状态信息</span>
                </div>
                <div class="entrust-detail-page__divider"></div>
                <div class="entrust-detail-page__section-body">
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">过磅状态</span>
                        <span class="entrust-detail-page__info-value">{{ getWeighStatusLabel(currentItem.weighStatus) }}</span>
                    </div>
                    <div class="entrust-detail-page__info-row">
                        <span class="entrust-detail-page__info-label">是否优先</span>
                        <span class="entrust-detail-page__info-value">{{ getFlagPriorityLabel(currentItem.flagPriority) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './detail.scss';
    import { onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { showFailToast, type TagType } from 'vant';
    import { getDeployPlanList, getMapByDicSn } from '@/api/deploy-plan';

    defineOptions({ name: 'transEntrustDetail' });

    const route = useRoute();

    const currentItem = ref<any>(null);

    // 字典数据
    const weighStatusMap = ref<Record<string, string>>({});
    const deployTypeMap = ref<Record<string, string>>({});
    const flagPriorityMap = ref<Record<string, string>>({});
    const pickupModeMap = ref<Record<string, string>>({});

    async function fetchDictData() {
        try {
            const res1: any = await getMapByDicSn('am_weigh_status');
            if (res1.data) weighStatusMap.value = res1.data;

            const res2: any = await getMapByDicSn('weigh_bill_type');
            if (res2.data) deployTypeMap.value = res2.data;

            const res3: any = await getMapByDicSn('am_weigh_flagPriority');
            if (res3.data) flagPriorityMap.value = res3.data;

            const res4: any = await getMapByDicSn('am_pickup_mode');
            if (res4.data) pickupModeMap.value = res4.data;
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

    function getFlagPriorityLabel(key: string) {
        if (key == null || key === '') return '否';
        return flagPriorityMap.value[String(key)] || (String(key) === '1' ? '是' : '否');
    }

    function getPickupModeLabel(key: string) {
        if (!key) return '-';
        return pickupModeMap.value[key] || key;
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

    /** 单位在标签毛/皮/净重（t），此处仅数字 */
    function formatWeightVal(v: any) {
        if (v === null || v === undefined || v === '') return '-';
        const n = Number(v);
        if (!Number.isFinite(n)) return '-';
        return n.toFixed(2);
    }

    // 获取详情数据（通过列表接口查找）
    async function fetchDetail() {
        const {id} = route.query;
        if (!id) {
            showFailToast('缺少计划ID');
            return;
        }
        try {
            const res: any = await getDeployPlanList({ current: 1, size: 9999 });
            const records = res.data?.records || [];
            const found = records.find((item: any) => item.id === id || String(item.id) === String(id));
            if (!found) {
                showFailToast('未找到该计划');
                return;
            }
            currentItem.value = found;
        } catch {
            showFailToast('获取详情失败');
        }
    }

    onMounted(() => {
        fetchDictData();
        fetchDetail();
    });
</script>
