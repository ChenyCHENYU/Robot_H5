<template>
    <div class="scale-inspection-detail">
        <C_NavBar title="巡检详情" />

        <div class="scale-inspection-detail__content" v-if="taskInfo">
            <!-- 基础信息卡片 -->
            <div class="scale-inspection-detail__info-card">
                <!-- 卡片头部：蓝色竖条 + 标题 + 状态标签 -->
                <div class="scale-inspection-detail__card-header">
                    <div class="scale-inspection-detail__header-left">
                        <span class="scale-inspection-detail__blue-bar"></span>
                        <span class="scale-inspection-detail__header-title">{{ taskInfo.taskName || '巡检任务' }}</span>
                    </div>
                    <VanTag :type="getStatusTagType(taskInfo.taskStatus)" plain round size="medium">
                        {{ getStatusText(taskInfo.taskStatus) }}
                    </VanTag>
                </div>

                <div class="scale-inspection-detail__divider"></div>

                <div class="scale-inspection-detail__card-body">
                    <div class="scale-inspection-detail__info-row">
                        <span class="scale-inspection-detail__info-label">任务编号</span>
                        <span class="scale-inspection-detail__info-value">{{ taskInfo.taskNo || '-' }}</span>
                    </div>
                    <div class="scale-inspection-detail__info-row">
                        <span class="scale-inspection-detail__info-label">负责人</span>
                        <span class="scale-inspection-detail__info-value">{{ taskInfo.inspectTaskChargeUserNo || '-' }}</span>
                    </div>
                    <div class="scale-inspection-detail__info-row">
                        <span class="scale-inspection-detail__info-label">时间</span>
                        <span class="scale-inspection-detail__info-value">{{ taskInfo.startTime || '-' }} ~ {{ taskInfo.deadlineTime || '-' }}</span>
                    </div>
                </div>

                <!-- 待执行状态：底部操作按钮 -->
                <template v-if="taskInfo.taskStatus === '1'">
                    <div class="scale-inspection-detail__divider"></div>
                    <div class="scale-inspection-detail__card-footer">
                        <span class="scale-inspection-detail__footer-spacer"></span>
                        <VanButton
                            plain
                            round
                            size="small"
                            type="primary"
                            class="scale-inspection-detail__action-btn"
                            :loading="submitting"
                            @click="handleStartExecution"
                        >
                            开始执行
                        </VanButton>
                        <VanButton plain round size="small" type="danger" class="scale-inspection-detail__action-btn" @click="handleStopInspection">
                            停产无需巡检
                        </VanButton>
                    </div>
                </template>
            </div>

            <!-- 巡检项列表区域 -->
            <div
                class="scale-inspection-detail__item-list-wrapper"
                :class="{
                    'scale-inspection-detail__item-list-wrapper--disabled': taskInfo.taskStatus === '5',
                    'scale-inspection-detail__item-list-wrapper--readonly': ['1', '3', '4'].includes(taskInfo.taskStatus),
                }"
            >
                <!-- 停产无需巡检遮罩 -->
                <div v-if="taskInfo.taskStatus === '5'" class="scale-inspection-detail__stop-overlay">
                    <span class="scale-inspection-detail__stop-overlay-text">停产无需巡检</span>
                </div>

                <div class="scale-inspection-detail__item-list">
                    <!-- 状态1/3/4/5：只读展示 -->
                    <template v-if="taskInfo.taskStatus !== '2'">
                        <div
                            v-for="(item, index) in itemResults"
                            :key="item.taskItemId || item.inspectItemId"
                            class="scale-inspection-detail__inspect-card"
                        >
                            <div class="scale-inspection-detail__inspect-card-header">
                                <div class="scale-inspection-detail__header-left">
                                    <span class="scale-inspection-detail__blue-bar"></span>
                                    <span class="scale-inspection-detail__header-title">{{ index + 1 }}. {{ item.inspectItemName }}</span>
                                </div>
                                <div class="scale-inspection-detail__result-btns">
                                    <VanButton
                                        size="mini"
                                        round
                                        plain
                                        :type="item.inspectResult === 'Y' ? 'success' : 'default'"
                                        disabled
                                    >合格</VanButton>
                                    <VanButton
                                        size="mini"
                                        round
                                        plain
                                        :type="item.inspectResult === 'N' ? 'danger' : 'default'"
                                        disabled
                                    >不合格</VanButton>
                                </div>
                            </div>
                            <div class="scale-inspection-detail__divider"></div>
                            <div class="scale-inspection-detail__inspect-card-body">
                                <div class="scale-inspection-detail__info-row">
                                    <span class="scale-inspection-detail__info-label">标准</span>
                                    <span class="scale-inspection-detail__info-value">{{ item.inspectStd || '-' }}</span>
                                </div>
                                <div class="scale-inspection-detail__info-row" v-if="item.inspectResult">
                                    <span class="scale-inspection-detail__info-label">结果</span>
                                    <VanTag
                                        :type="item.inspectResult === 'Y' ? 'success' : 'danger'"
                                        plain
                                        round
                                        size="medium"
                                    >
                                        {{ item.inspectResult === 'Y' ? '合格' : '不合格' }}
                                    </VanTag>
                                </div>
                                <div class="scale-inspection-detail__info-row" v-if="item.inspectResult === 'N'">
                                    <span class="scale-inspection-detail__info-label">不合格原因</span>
                                    <span class="scale-inspection-detail__info-value scale-inspection-detail__abnormal-text">{{ item.inspectAbnormal || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 状态2（执行中）：可编辑 -->
                    <template v-if="taskInfo.taskStatus === '2'">
                        <div
                            v-for="(item, index) in editableItems"
                            :key="item.inspectItemId"
                            class="scale-inspection-detail__inspect-card"
                        >
                            <div class="scale-inspection-detail__inspect-card-header">
                                <div class="scale-inspection-detail__header-left">
                                    <span class="scale-inspection-detail__blue-bar"></span>
                                    <span class="scale-inspection-detail__header-title">{{ index + 1 }}. {{ item.inspectItemName }}</span>
                                </div>
                                <div class="scale-inspection-detail__result-btns">
                                    <VanButton
                                        size="mini"
                                        round
                                        :type="item.inspectResult === 'Y' ? 'success' : 'default'"
                                        :plain="item.inspectResult !== 'Y'"
                                        @click="setResult(item, 'Y')"
                                    >合格</VanButton>
                                    <VanButton
                                        size="mini"
                                        round
                                        :type="item.inspectResult === 'N' ? 'danger' : 'default'"
                                        :plain="item.inspectResult !== 'N'"
                                        @click="setResult(item, 'N')"
                                    >不合格</VanButton>
                                </div>
                            </div>
                            <div class="scale-inspection-detail__divider"></div>
                            <div class="scale-inspection-detail__inspect-card-body">
                                <div class="scale-inspection-detail__info-row">
                                    <span class="scale-inspection-detail__info-label">标准</span>
                                    <span class="scale-inspection-detail__info-value">{{ item.inspectStd || '-' }}</span>
                                </div>
                                <!-- 不合格时显示原因输入框 -->
                                <div v-if="item.inspectResult === 'N'" class="scale-inspection-detail__abnormal-input">
                                    <div class="scale-inspection-detail__abnormal-label">不合格原因：</div>
                                    <VanField
                                        v-model="item.inspectAbnormal"
                                        type="textarea"
                                        rows="2"
                                        placeholder="请输入不合格原因"
                                        autosize
                                    />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 执行中状态：底部提交区域 -->
            <div v-if="taskInfo.taskStatus === '2'" class="scale-inspection-detail__submit-area">
                <VanField
                    v-model="resultDesc"
                    type="textarea"
                    rows="3"
                    placeholder="请输入巡检结果描述..."
                    class="scale-inspection-detail__result-textarea"
                />
                <VanButton type="primary" block round :loading="submitting" @click="handleSubmit">
                    提交巡检结果
                </VanButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './detail.scss';
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { showSuccessToast, showFailToast, showConfirmDialog, type TagType } from 'vant';
    import {
        getInspectionTaskDetail,
        submitInspectionTask,
        startInspectionTask,
        suspendInspectionTask,
        getMapByDicSn,
    } from '@/api/scale-inspection';
    import { canViewMesTaskByChargeUserNo } from '@/utils/mesUserScope';
    import { defaultTaskStatusMap, taskStatusTagTypeMap } from './data';

    defineOptions({ name: 'scaleInspectionTaskDetail' });

    const route = useRoute();
    const router = useRouter();

    const taskInfo = ref<any>(null);
    const itemResults = ref<any[]>([]);
    const editableItems = ref<any[]>([]);
    const resultDesc = ref('');
    const submitting = ref(false);

    // 业务字典：任务执行状态（本地兜底）
    const taskStatusMap = ref<Record<string, string>>({ ...defaultTaskStatusMap });

    async function fetchDictData() {
        try {
            const statusRes: any = await getMapByDicSn('am_task_status');
            if (statusRes.data && Object.keys(statusRes.data).length > 0) {
                taskStatusMap.value = statusRes.data;
            }
        } catch {
            console.warn('字典接口请求失败，使用本地默认值');
        }
    }

    function getStatusText(status: string) {
        return taskStatusMap.value[status] || taskStatusMap.value[String(status)] || '未知';
    }

    function getStatusTagType(status: string): TagType {
        return taskStatusTagTypeMap[String(status)] || 'default';
    }

    // 获取详情数据
    async function fetchDetail() {
        const {id} = route.query;
        if (!id) {
            showFailToast('缺少任务ID');
            return;
        }
        try {
            const res: any = await getInspectionTaskDetail(String(Array.isArray(id) ? id[0] : id));
            const info = res.data.taskInfo;
            if (!canViewMesTaskByChargeUserNo(info?.inspectTaskChargeUserNo)) {
                showFailToast('无权查看此任务');
                router.back();
                return;
            }
            if (info.taskStatus !== undefined) info.taskStatus = String(info.taskStatus);
            taskInfo.value = info;
            itemResults.value = res.data.itemResults || [];
            if (info.taskStatus === '2') {
                editableItems.value = (res.data.itemResults || []).map((item: any) => ({
                    ...item,
                    inspectResult: item.inspectResult || '',
                    inspectAbnormal: item.inspectAbnormal || '',
                }));
            }
        } catch {
            showFailToast('获取详情失败');
        }
    }

    function setResult(item: any, result: string) {
        item.inspectResult = result;
        if (result === 'Y') item.inspectAbnormal = '';
    }

    // 开始执行
    async function handleStartExecution() {
        submitting.value = true;
        try {
            await startInspectionTask(taskInfo.value.id);
            showSuccessToast('已开始执行');
            await fetchDetail();
        } catch {
            showFailToast('操作失败');
        } finally {
            submitting.value = false;
        }
    }

    // 提交巡检结果
    async function handleSubmit() {
        const unfinished = editableItems.value.filter((i: any) => !i.inspectResult);
        if (unfinished.length > 0) {
            showFailToast('请完成所有巡检项的检查');
            return;
        }
        const noReason = editableItems.value.filter((i: any) => i.inspectResult === 'N' && !i.inspectAbnormal);
        if (noReason.length > 0) {
            showFailToast('请填写不合格项的原因');
            return;
        }
        const execUser = taskInfo.value.inspectTaskChargeUserNo || '';

        submitting.value = true;
        try {
            await submitInspectionTask({
                taskId: taskInfo.value.id,
                execUserNo: execUser,
                itemResults: editableItems.value.map((item: any) => ({
                    planItemId: taskInfo.value.planId || '',
                    inspectItemId: item.inspectItemId,
                    inspectResult: item.inspectResult,
                    inspectAbnormal: item.inspectAbnormal || '',
                    inspectStd: item.inspectStd || '',
                })),
            });
            showSuccessToast('提交成功');
            await fetchDetail();
        } catch {
            showFailToast('提交失败');
        } finally {
            submitting.value = false;
        }
    }

    // 停产无需巡检
    async function handleStopInspection() {
        try {
            await showConfirmDialog({ title: '确认操作', message: '确定标记为"停产无需巡检"吗？提交后不可修改。' });
        } catch {
            return;
        }

        submitting.value = true;
        try {
            await suspendInspectionTask(taskInfo.value.id);
            showSuccessToast('操作成功');
            await fetchDetail();
        } catch {
            showFailToast('操作失败');
        } finally {
            submitting.value = false;
        }
    }

    onMounted(() => {
        fetchDictData();
        fetchDetail();
    });
</script>
