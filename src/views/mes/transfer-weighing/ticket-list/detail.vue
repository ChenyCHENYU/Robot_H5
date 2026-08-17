<template>
    <div class="ticket-detail-page">
        <C_NavBar title="磅单详情">
            <template #right>
                <VanIcon name="replay" size="20" @click="fetchDetail" />
            </template>
        </C_NavBar>

        <div class="ticket-detail-page__content" v-if="detail">
            <!-- 磅单号 + 状态 -->
            <div class="ticket-detail-page__main-card">
                <div class="ticket-detail-page__card-top">
                    <span class="ticket-detail-page__weighbill-no">{{ detail.weighbillNo || '-' }}</span>
                    <VanTag :type="getStatusTagType(detail.weighbillStatus)" round size="medium">
                        {{ getStatusLabel(detail.weighbillStatus) }}
                    </VanTag>
                </div>
                <div class="ticket-detail-page__card-sub">创建时间：{{ detail.grossDateTime || detail.busDate || '-' }}</div>

                <!-- 车辆信息 -->
                <div class="ticket-detail-page__section-block ticket-detail-page__section-block--blue">
                    <div class="ticket-detail-page__section-title">
                        <VanIcon name="logistics" />
                        <span>车辆信息</span>
                    </div>
                    <div class="ticket-detail-page__three-col">
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">车牌号</span>
                            <span class="ticket-detail-page__col-value">{{ detail.carNo || '-' }}</span>
                        </div>
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">司机</span>
                            <span class="ticket-detail-page__col-value">{{ detail.driverName || '-' }}</span>
                        </div>
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">过磅地点</span>
                            <span class="ticket-detail-page__col-value">{{ detail.sendWh || '-' }}</span>
                        </div>
                    </div>
                </div>

                <!-- 重量信息 -->
                <div class="ticket-detail-page__section-block ticket-detail-page__section-block--green">
                    <div class="ticket-detail-page__section-title">
                        <VanIcon name="balance-o" />
                        <span>重量信息</span>
                    </div>
                    <div class="ticket-detail-page__weight-row">
                        <div class="ticket-detail-page__weight-item">
                            <span class="ticket-detail-page__weight-label">毛重（t）</span>
                            <span class="ticket-detail-page__weight-value">{{ formatWeightNum(displayWeight.gross) }}</span>
                            <span class="ticket-detail-page__weight-time">{{ formatTime(displayWeight.grossTime) }}</span>
                        </div>
                        <div class="ticket-detail-page__weight-item">
                            <span class="ticket-detail-page__weight-label">皮重（t）</span>
                            <span class="ticket-detail-page__weight-value">{{ formatWeightNum(displayWeight.tare) }}</span>
                            <span class="ticket-detail-page__weight-time">{{ formatTime(displayWeight.tareTime) }}</span>
                        </div>
                        <div class="ticket-detail-page__weight-item">
                            <span class="ticket-detail-page__weight-label">净重（t）</span>
                            <span class="ticket-detail-page__weight-value ticket-detail-page__weight-value--net">
                                {{ formatWeightNum(displayWeight.net) }}
                            </span>
                            <span class="ticket-detail-page__weight-time">{{ formatTime(detail.netDateTime) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 扣杂信息（与 PC 磅单详情一致：水份/包装/杂质扣重） -->
                <div class="ticket-detail-page__section-block ticket-detail-page__section-block--orange">
                    <div class="ticket-detail-page__section-title">
                        <VanIcon name="delete-o" />
                        <span>扣杂信息</span>
                    </div>
                    <div class="ticket-detail-page__three-col">
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">水份扣重（kg）</span>
                            <span class="ticket-detail-page__col-value">{{ formatDeductNum(detail.moistureDeductWgt) }}</span>
                        </div>
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">包装扣重（kg）</span>
                            <span class="ticket-detail-page__col-value">{{ formatDeductNum(detail.packageDeductWgt) }}</span>
                        </div>
                        <div class="ticket-detail-page__col-item">
                            <span class="ticket-detail-page__col-label">杂质扣重（kg）</span>
                            <span class="ticket-detail-page__col-value">{{ formatDeductNum(detail.impurityDeductWgt) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 物料信息（后端扩展字段 matSpec 存在时自动展示） -->
                <div class="ticket-detail-page__section-block ticket-detail-page__section-block--mat">
                    <div class="ticket-detail-page__section-title">
                        <VanIcon name="orders-o" />
                        <span>物料信息</span>
                    </div>
                    <div class="ticket-detail-page__mat-info-list">
                        <div class="ticket-detail-page__info-row">
                            <span class="ticket-detail-page__info-label">物料编码</span>
                            <span class="ticket-detail-page__info-value">{{ detail.matCode || '-' }}</span>
                        </div>
                        <div class="ticket-detail-page__info-row">
                            <span class="ticket-detail-page__info-label">物料名称</span>
                            <span class="ticket-detail-page__info-value">{{ detail.matName || '-' }}</span>
                        </div>
                        <div class="ticket-detail-page__info-row">
                            <span class="ticket-detail-page__info-label">规格</span>
                            <span class="ticket-detail-page__info-value">{{ matSpecDisplay }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="ticket-detail-page__action-area">
                <VanButton round block icon="printer" class="ticket-detail-page__print-btn" @click="goPrint">打印磅单</VanButton>
                <VanButton type="warning" round block icon="edit" @click="showDeductPopup = true">扣杂</VanButton>
            </div>
        </div>

        <!-- 扣杂弹窗 -->
        <VanPopup v-model:show="showDeductPopup" position="bottom" round :style="{ minHeight: '40%' }">
            <div class="ticket-detail-page__deduct-popup">
                <div class="ticket-detail-page__deduct-title">扣杂</div>
                <VanForm @submit="handleDeductSubmit">
                    <VanCellGroup inset>
                        <VanField
                            v-model="deductForm.moistureDeductWgt"
                            label="水份扣重（kg）"
                            type="number"
                            placeholder="请输入水份扣重"
                            :rules="[{ required: true, message: '请输入水份扣重' }]"
                        />
                        <VanField
                            v-model="deductForm.packageDeductWgt"
                            label="包装扣重（kg）"
                            type="number"
                            placeholder="请输入包装扣重"
                            :rules="[{ required: true, message: '请输入包装扣重' }]"
                        />
                        <VanField
                            v-model="deductForm.impurityDeductWgt"
                            label="杂质扣重（kg）"
                            type="number"
                            placeholder="请输入杂质扣重"
                            :rules="[{ required: true, message: '请输入杂质扣重' }]"
                        />
                    </VanCellGroup>
                    <div class="ticket-detail-page__deduct-btns">
                        <VanButton round block type="default" @click="showDeductPopup = false">取消</VanButton>
                        <VanButton round block type="primary" native-type="submit" :loading="submitting">确认</VanButton>
                    </div>
                </VanForm>
            </div>
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './detail.scss';
    import { onActivated } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { showSuccessToast, showFailToast, type TagType } from 'vant';
    import { getWeighTicketDetail, deductImpurity } from '@/api/trans-weight-ticket';
    import {
        buildDisplayWeight,
        formatWeightNum,
        formatDeductNum,
        formatTime,
        matSpecFromDetail,
        getWeighStatusLabel,
    } from './weighDisplay';
    import { weighbillStatusTagTypeMap, type DeductImpurityPayload } from './data';

    defineOptions({ name: 'transTicketDetail' });

    const route = useRoute();
    const router = useRouter();

    // 详情数据（字段见 data.ts 的 TicketDetail 说明）
    const detail = ref<any>(null);
    const showDeductPopup = ref(false);
    const submitting = ref(false);

    const matSpecDisplay = computed(() => matSpecFromDetail(detail.value));
    const displayWeight = computed(() => buildDisplayWeight(detail.value));

    // 扣杂表单
    const deductForm = reactive({
        moistureDeductWgt: '',
        packageDeductWgt: '',
        impurityDeductWgt: '',
    });

    function getStatusLabel(status?: string) {
        return getWeighStatusLabel(status);
    }

    function getStatusTagType(status?: string): TagType {
        return weighbillStatusTagTypeMap[status ?? ''] || 'default';
    }

    function goPrint() {
        if (!detail.value?.id) return;
        router.push({ path: '/transferWeighing/ticketList/print', query: { id: String(detail.value.id) } });
    }

    // 获取详情
    async function fetchDetail() {
        const {id} = route.query;
        if (!id) {
            showFailToast('缺少磅单ID');
            return;
        }
        try {
            const res: any = await getWeighTicketDetail(String(id));
            if (res.data) {
                detail.value = res.data;
                // 初始化扣杂表单
                deductForm.moistureDeductWgt = detail.value.moistureDeductWgt ?? '';
                deductForm.packageDeductWgt = detail.value.packageDeductWgt ?? '';
                deductForm.impurityDeductWgt = detail.value.impurityDeductWgt ?? '';
            } else {
                showFailToast('未找到磅单信息');
            }
        } catch {
            showFailToast('获取详情失败');
        }
    }

    // 提交扣杂
    async function handleDeductSubmit() {
        if (!detail.value?.id) return;
        submitting.value = true;
        try {
            const payload: DeductImpurityPayload = {
                id: String(detail.value.id),
                moistureDeductWgt: Number(deductForm.moistureDeductWgt),
                packageDeductWgt: Number(deductForm.packageDeductWgt),
                impurityDeductWgt: Number(deductForm.impurityDeductWgt),
            };
            await deductImpurity(payload);
            showSuccessToast('扣杂成功');
            showDeductPopup.value = false;
            await fetchDetail();
        } catch {
            showFailToast('扣杂失败');
        } finally {
            submitting.value = false;
        }
    }

    // 详情页 keepAlive 缓存：每次激活（含首次进入）都刷新，避免切换到其他磅单时展示旧数据
    onActivated(() => {
        fetchDetail();
    });
</script>
