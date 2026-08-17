<template>
    <div class="weight-verify-detail">
        <C_NavBar title="校磅详情" />

        <div class="weight-verify-detail__content" v-if="taskInfo">
            <!-- 基础信息卡片 -->
            <div class="weight-verify-detail__info-card">
                <!-- 卡片头部：蓝色竖条 + 标题 + 状态标签 -->
                <div class="weight-verify-detail__card-header">
                    <div class="weight-verify-detail__header-left">
                        <span class="weight-verify-detail__blue-bar"></span>
                        <span class="weight-verify-detail__header-title">{{ taskInfo.calibTaskName || '校磅任务' }}</span>
                    </div>
                    <VanTag :type="getStatusTagType(taskInfo.taskStatus)" plain round size="medium">
                        {{ getStatusText(taskInfo.taskStatus) }}
                    </VanTag>
                </div>

                <!-- 虚线分隔 -->
                <div class="weight-verify-detail__divider"></div>

                <!-- 卡片内容 -->
                <div class="weight-verify-detail__card-body">
                    <div class="weight-verify-detail__info-row">
                        <span class="weight-verify-detail__info-label">任务编号</span>
                        <span class="weight-verify-detail__info-value">{{ taskInfo.calibTaskNo || '-' }}</span>
                    </div>
                    <div class="weight-verify-detail__info-row">
                        <span class="weight-verify-detail__info-label">负责人</span>
                        <span class="weight-verify-detail__info-value">{{ chargeUserDisplay }}</span>
                    </div>
                    <div class="weight-verify-detail__info-row">
                        <span class="weight-verify-detail__info-label">校磅类型</span>
                        <span class="weight-verify-detail__info-value">{{ getCalibTypeText(taskInfo.calibType) }}</span>
                    </div>
                    <div class="weight-verify-detail__info-row">
                        <span class="weight-verify-detail__info-label">时间</span>
                        <span class="weight-verify-detail__info-value">{{ taskInfo.taskStatus === '5' ? (taskInfo.updateDateTime || '-') : (taskInfo.taskStartTime || '-') }} ~ {{ taskInfo.taskDeadlineTime || '-' }}</span>
                    </div>
                    <!-- 结果描述（已完成时展示） -->
                    <div class="weight-verify-detail__info-row" v-if="taskInfo.taskStatus === '3' && taskInfo.resultDesc">
                        <span class="weight-verify-detail__info-label">结果描述</span>
                        <span class="weight-verify-detail__info-value">{{ taskInfo.resultDesc }}</span>
                    </div>
                    <!-- 最终结果（已完成时展示） -->
                    <div class="weight-verify-detail__info-row" v-if="taskInfo.taskStatus === '3' && taskInfo.taskResult">
                        <span class="weight-verify-detail__info-label">最终结果</span>
                        <VanTag
                            :type="taskInfo.taskResult === 'Y' ? 'success' : 'danger'"
                            plain
                            round
                            size="medium"
                        >
                            {{ taskInfo.taskResult === 'Y' ? '合格' : '不合格' }}
                        </VanTag>
                    </div>
                </div>

                <!-- 待执行状态：底部操作按钮 -->
                <template v-if="taskInfo.taskStatus === '1'">
                    <div class="weight-verify-detail__divider"></div>
                    <div class="weight-verify-detail__card-footer">
                        <span class="weight-verify-detail__footer-spacer"></span>
                        <VanButton
                            plain
                            round
                            size="small"
                            type="primary"
                            class="weight-verify-detail__action-btn"
                            :loading="submitting"
                            @click="handleStartExecution"
                        >
                            开始执行
                        </VanButton>
                        <VanButton plain round size="small" type="danger" class="weight-verify-detail__action-btn" @click="handleStopExecution">
                            停产无需执行
                        </VanButton>
                    </div>
                </template>
            </div>

            <!-- 校磅详情区域 -->
            <div
                class="weight-verify-detail__item-list-wrapper"
                :class="{
                    'weight-verify-detail__item-list-wrapper--disabled': taskInfo.taskStatus === '5',
                    'weight-verify-detail__item-list-wrapper--readonly': ['1', '3', '4'].includes(taskInfo.taskStatus),
                }"
            >
                <!-- 停产无需执行遮罩 -->
                <div v-if="taskInfo.taskStatus === '5'" class="weight-verify-detail__stop-overlay">
                    <span class="weight-verify-detail__stop-overlay-text">停产无需执行</span>
                </div>

                <div class="weight-verify-detail__item-list">
                    <!-- ========== 车辆校磅 (C) ========== -->
                    <template v-if="taskInfo.calibType === 'C'">
                        <div class="weight-verify-detail__section-card">
                            <div class="weight-verify-detail__section-card-header">
                                <span class="weight-verify-detail__blue-bar"></span>
                                <span class="weight-verify-detail__section-card-title">磅秤信息</span>
                            </div>
                            <div class="weight-verify-detail__divider"></div>
                            <div class="weight-verify-detail__scale-table">
                                <div class="weight-verify-detail__table-header">
                                    <span class="weight-verify-detail__col-index">序号</span>
                                    <span class="weight-verify-detail__col-name">磅秤名称</span>
                                    <span class="weight-verify-detail__col-value">过磅值</span>
                                </div>
                                <div
                                    v-for="(item, index) in scaleItems"
                                    :key="index"
                                    class="weight-verify-detail__table-row"
                                >
                                    <span class="weight-verify-detail__col-index">{{ index + 1 }}</span>
                                    <span class="weight-verify-detail__col-name">{{ getScaleName(item.scaleId) }}</span>
                                    <span class="weight-verify-detail__col-value" v-if="taskInfo.taskStatus !== '2'">{{ item.weighVal || '-' }}</span>
                                    <div v-else class="weight-verify-detail__col-value weight-verify-detail__col-value--action">
                                        <VanField
                                            v-model="item.weighVal"
                                            type="text"
                                            inputmode="decimal"
                                            placeholder="可手工输入"
                                            :border="false"
                                            class="weight-verify-detail__weigh-input-field"
                                            input-align="center"
                                        />
                                        <VanButton
                                            type="primary"
                                            size="small"
                                            plain
                                            hairline
                                            class="weight-verify-detail__take-btn"
                                            @click="handleTakeWeighC(index)"
                                        >
                                            取值
                                        </VanButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ========== 三点校磅 (T) ========== -->
                    <template v-if="taskInfo.calibType === 'T'">
                        <div class="weight-verify-detail__section-card">
                            <div class="weight-verify-detail__section-card-header">
                                <span class="weight-verify-detail__blue-bar"></span>
                                <span class="weight-verify-detail__section-card-title">磅秤信息</span>
                            </div>
                            <div class="weight-verify-detail__divider"></div>
                            <div class="weight-verify-detail__scale-table">
                                <div class="weight-verify-detail__table-header">
                                    <span class="weight-verify-detail__col-index">序号</span>
                                    <span class="weight-verify-detail__col-name">磅秤名称</span>
                                    <span class="weight-verify-detail__col-name">砝码名称</span>
                                </div>
                                <div class="weight-verify-detail__table-row">
                                    <span class="weight-verify-detail__col-index">1</span>
                                    <span class="weight-verify-detail__col-name">{{ getScaleName(scaleIdList[0]) || '-' }}</span>
                                    <span class="weight-verify-detail__col-name">{{ weightsNameMap[weightsIdList[0]] || '-' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="weight-verify-detail__section-card">
                            <div class="weight-verify-detail__section-card-header">
                                <span class="weight-verify-detail__blue-bar"></span>
                                <span class="weight-verify-detail__section-card-title">过磅值录入</span>
                            </div>
                            <div class="weight-verify-detail__divider"></div>
                            <div class="weight-verify-detail__three-point-inputs">
                                <div class="weight-verify-detail__info-row">
                                    <span class="weight-verify-detail__info-label">前-过磅值</span>
                                    <template v-if="taskInfo.taskStatus === '2'">
                                        <div class="weight-verify-detail__tp-value-row">
                                            <VanField
                                                v-model="threePointValues.befWeighVal"
                                                type="text"
                                                inputmode="decimal"
                                                placeholder="可手工输入"
                                                :border="false"
                                                class="weight-verify-detail__weigh-input-field weight-verify-detail__tp-weigh-input"
                                                input-align="right"
                                            />
                                            <VanButton
                                                type="primary"
                                                size="small"
                                                plain
                                                hairline
                                                class="weight-verify-detail__take-btn"
                                                @click="handleTakeWeighT('bef')"
                                            >取值</VanButton>
                                        </div>
                                    </template>
                                    <span v-else class="weight-verify-detail__info-value">{{ taskInfo.befWeighVal ?? '-' }}</span>
                                </div>
                                <div class="weight-verify-detail__info-row">
                                    <span class="weight-verify-detail__info-label">中-过磅值</span>
                                    <template v-if="taskInfo.taskStatus === '2'">
                                        <div class="weight-verify-detail__tp-value-row">
                                            <VanField
                                                v-model="threePointValues.midWeighVal"
                                                type="text"
                                                inputmode="decimal"
                                                placeholder="可手工输入"
                                                :border="false"
                                                class="weight-verify-detail__weigh-input-field weight-verify-detail__tp-weigh-input"
                                                input-align="right"
                                            />
                                            <VanButton
                                                type="primary"
                                                size="small"
                                                plain
                                                hairline
                                                class="weight-verify-detail__take-btn"
                                                @click="handleTakeWeighT('mid')"
                                            >取值</VanButton>
                                        </div>
                                    </template>
                                    <span v-else class="weight-verify-detail__info-value">{{ taskInfo.midWeighVal ?? '-' }}</span>
                                </div>
                                <div class="weight-verify-detail__info-row">
                                    <span class="weight-verify-detail__info-label">后-过磅值</span>
                                    <template v-if="taskInfo.taskStatus === '2'">
                                        <div class="weight-verify-detail__tp-value-row">
                                            <VanField
                                                v-model="threePointValues.aftWeighVal"
                                                type="text"
                                                inputmode="decimal"
                                                placeholder="可手工输入"
                                                :border="false"
                                                class="weight-verify-detail__weigh-input-field weight-verify-detail__tp-weigh-input"
                                                input-align="right"
                                            />
                                            <VanButton
                                                type="primary"
                                                size="small"
                                                plain
                                                hairline
                                                class="weight-verify-detail__take-btn"
                                                @click="handleTakeWeighT('aft')"
                                            >取值</VanButton>
                                        </div>
                                    </template>
                                    <span v-else class="weight-verify-detail__info-value">{{ taskInfo.aftWeighVal ?? '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ========== 线性校磅 (S) ========== -->
                    <template v-if="taskInfo.calibType === 'S'">
                        <div class="weight-verify-detail__section-card">
                            <div class="weight-verify-detail__section-card-header">
                                <span class="weight-verify-detail__blue-bar"></span>
                                <span class="weight-verify-detail__section-card-title">磅秤信息</span>
                            </div>
                            <div class="weight-verify-detail__divider"></div>
                            <div class="weight-verify-detail__scale-table">
                                <div class="weight-verify-detail__table-header">
                                    <span class="weight-verify-detail__col-index">序号</span>
                                    <span class="weight-verify-detail__col-name">磅秤名称</span>
                                </div>
                                <div class="weight-verify-detail__table-row">
                                    <span class="weight-verify-detail__col-index">1</span>
                                    <span class="weight-verify-detail__col-name">{{ getScaleName(scaleIdList[0]) || '-' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="weight-verify-detail__section-card">
                            <div class="weight-verify-detail__section-card-header">
                                <span class="weight-verify-detail__blue-bar"></span>
                                <span class="weight-verify-detail__section-card-title">砝码过磅值录入</span>
                            </div>
                            <div class="weight-verify-detail__divider"></div>
                            <div class="weight-verify-detail__scale-table">
                                <div class="weight-verify-detail__table-header">
                                    <span class="weight-verify-detail__col-index">序号</span>
                                    <span class="weight-verify-detail__col-name">砝码名称</span>
                                    <span class="weight-verify-detail__col-value">过磅值</span>
                                </div>
                                <div
                                    v-for="(item, index) in linearItems"
                                    :key="index"
                                    class="weight-verify-detail__table-row"
                                >
                                    <span class="weight-verify-detail__col-index">{{ index + 1 }}</span>
                                    <span class="weight-verify-detail__col-name">{{ item.weightsName || '-' }}</span>
                                    <span class="weight-verify-detail__col-value" v-if="taskInfo.taskStatus !== '2'">{{ item.weighVal || '-' }}</span>
                                    <div v-else class="weight-verify-detail__col-value weight-verify-detail__col-value--action">
                                        <VanField
                                            v-model="item.weighVal"
                                            type="text"
                                            inputmode="decimal"
                                            placeholder="可手工输入"
                                            :border="false"
                                            class="weight-verify-detail__weigh-input-field"
                                            input-align="center"
                                        />
                                        <VanButton
                                            type="primary"
                                            size="small"
                                            plain
                                            hairline
                                            class="weight-verify-detail__take-btn"
                                            @click="handleTakeWeighS(index)"
                                        >取值</VanButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 执行中状态：底部提交区域 -->
            <div v-if="taskInfo.taskStatus === '2'" class="weight-verify-detail__submit-area">
                <VanButton type="primary" block round :loading="submitting" @click="handleSubmit">
                    提交执行结果
                </VanButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './detail.scss';
    import { onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { showSuccessToast, showFailToast, showConfirmDialog, type TagType } from 'vant';
    import {
        getCalibrationTaskList,
        getCalibrationTaskById,
        startCalibrationTask,
        suspendCalibrationTask,
        submitCalibrationTask,
        getStandardWeightsById,
        getStandardWeightsNoPage,
        getMapByDicSn,
        getWeightSiteListNoPage,
    } from '@/api/weight-verify';
    import { useScaleWebsocket } from '@/hooks/useScaleWebsocket';
    import { fetchChargeUserNameMap, formatUserNoWithName } from '@/utils/chargeUserNameMap';
    import { isMesDataAdmin, getMesCurrentUserNo, canViewMesTaskByChargeUserNo } from '@/utils/mesUserScope';
    import { defaultTaskStatusMap, defaultCalibTypeMap, taskStatusTagTypeMap } from './data';

    defineOptions({ name: 'weightVerifyDetail' });

    const route = useRoute();
    const router = useRouter();

    const taskInfo = ref<any>(null);
    const submitting = ref(false);

    // 工号 -> 姓名，与 PC 端一致，用于负责人「中文名（工号）」
    const chargeUserNameMap = ref<Record<string, string>>({});
    async function loadChargeUserNameMap() {
        try {
            chargeUserNameMap.value = await fetchChargeUserNameMap();
        } catch (e) {
            console.warn('加载负责人姓名字典失败', e);
        }
    }
    const chargeUserDisplay = computed(() => {
        if (!taskInfo.value) return '-';
        return formatUserNoWithName(
            chargeUserNameMap.value,
            taskInfo.value.calibTaskChargeUserNo,
            taskInfo.value.calibTaskChargeUserName
        );
    });

    // 业务字典
    const taskStatusMap = ref<Record<string, string>>({ ...defaultTaskStatusMap });
    const calibTypeMap = ref<Record<string, string>>({ ...defaultCalibTypeMap });

    // 车辆校磅：磅秤列表 + 过磅值
    const scaleItems = ref<any[]>([]);

    // 三点校磅：前中后过磅值
    const threePointValues = ref({
        befWeighVal: '',
        midWeighVal: '',
        aftWeighVal: '',
    });

    // 线性校磅：砝码列表 + 过磅值
    const linearItems = ref<any[]>([]);

    // 砝码名称映射
    const weightsNameMap = ref<Record<string, string>>({});

    // 磅秤名称/编号展示映射 { id: 展示用字符串 }
    const scaleSiteNameMap = ref<Record<string, string>>({});
    // 磅秤主键 id -> 磅秤编号 weighSiteNo（与 WebSocket 中 weighSiteNo 一致，用于匹配推送）
    const scaleIdToWeighSiteNo = ref<Record<string, string>>({});

    // 解析逗号分隔的ID列表
    const scaleIdList = computed(() => {
        if (!taskInfo.value?.scaleIds) return [] as string[];
        return String(taskInfo.value.scaleIds).split(',').filter(Boolean);
    });

    const weightsIdList = computed(() => {
        if (!taskInfo.value?.weightsIds) return [] as string[];
        return String(taskInfo.value.weightsIds).split(',').filter(Boolean);
    });

    // 地磅实时重量 WebSocket（仅「执行中」连接）
    const SCALE_WS_URL =
        import.meta.env.VITE_SCALE_WS_URL || 'ws://172.18.191.135:8080/ws/scale';
    const { connect: connectScaleWs, disconnect: disconnectScaleWs, getLatest: getLatestScaleWeight } =
        useScaleWebsocket();

    watch(
        () => taskInfo.value?.taskStatus,
        (s) => {
            if (s === '2') {
                connectScaleWs(SCALE_WS_URL);
            } else {
                disconnectScaleWs();
            }
        },
        { immediate: true }
    );

    async function fetchDictData() {
        try {
            const [statusRes, typeRes]: any[] = await Promise.all([
                getMapByDicSn('am_task_status'),
                getMapByDicSn('am_calibrate_type'),
            ]);
            if (statusRes.data && Object.keys(statusRes.data).length > 0) {
                taskStatusMap.value = statusRes.data;
            }
            if (typeRes.data && Object.keys(typeRes.data).length > 0) {
                calibTypeMap.value = typeRes.data;
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

    function getCalibTypeText(type: string) {
        return calibTypeMap.value[type] || calibTypeMap.value[String(type)] || '-';
    }

    // 获取所有磅秤名称映射
    async function fetchScaleSiteNames() {
        try {
            const res: any = await getWeightSiteListNoPage();
            const list = res.data || [];
            const nameMap: Record<string, string> = {};
            const noMap: Record<string, string> = {};
            list.forEach((item: any) => {
                const {id} = item;
                nameMap[id] = item.weighSiteName || item.weighSiteNo || id;
                noMap[id] = String(item.weighSiteNo != null && item.weighSiteNo !== '' ? item.weighSiteNo : id).trim();
            });
            scaleSiteNameMap.value = nameMap;
            scaleIdToWeighSiteNo.value = noMap;
        } catch {
            console.warn('获取磅秤名称失败');
        }
    }

    // 根据ID获取磅秤名称
    function getScaleName(id: string) {
        return scaleSiteNameMap.value[id] || id;
    }

    /** 与推送 weighSiteNo 对应（用于从缓存取数） */
    function getWeighSiteNoByScaleId(scaleId: string) {
        return scaleIdToWeighSiteNo.value[scaleId] || getScaleName(scaleId);
    }

    // 获取砝码名称
    async function fetchWeightsNames() {
        if (!taskInfo.value) return;
        const {calibType} = taskInfo.value;
        const wIds = weightsIdList.value;

        if (wIds.length === 0) return;

        if (calibType === 'T') {
            try {
                const res: any = await getStandardWeightsById(wIds[0]);
                if (res.data) {
                    weightsNameMap.value[wIds[0]] = res.data.weightsName || res.data.name || wIds[0];
                }
            } catch {
                console.warn('获取砝码信息失败');
            }
        } else if (calibType === 'S') {
            try {
                const res: any = await getStandardWeightsNoPage();
                const allWeights = res.data || [];
                const nameMap: Record<string, string> = {};
                allWeights.forEach((w: any) => {
                    nameMap[w.id] = w.weightsName || w.name || w.id;
                });
                weightsNameMap.value = nameMap;
            } catch {
                console.warn('获取砝码列表失败');
            }
        }
    }

    // 初始化各类型的编辑数据
    function initEditData() {
        if (!taskInfo.value) return;
        const info = taskInfo.value;
        const {calibType} = info;

        if (calibType === 'C') {
            const sIds = scaleIdList.value;
            const wVals = info.weighVal ? String(info.weighVal).split(',') : [];
            scaleItems.value = sIds.map((id, idx) => ({
                scaleId: id,
                weighVal: wVals[idx] || '',
            }));
        } else if (calibType === 'T') {
            threePointValues.value = {
                befWeighVal: info.befWeighVal != null ? String(info.befWeighVal) : '',
                midWeighVal: info.midWeighVal != null ? String(info.midWeighVal) : '',
                aftWeighVal: info.aftWeighVal != null ? String(info.aftWeighVal) : '',
            };
        } else if (calibType === 'S') {
            const wIds = weightsIdList.value;
            const wVals = info.weighVal ? String(info.weighVal).split(',') : [];
            linearItems.value = wIds.map((id, idx) => ({
                weightsId: id,
                weightsName: '',
                weighVal: wVals[idx] || '',
            }));
        }
    }

    // 填充线性校磅的砝码名称
    function fillLinearWeightsNames() {
        if (taskInfo.value?.calibType !== 'S') return;
        linearItems.value.forEach((item) => {
            item.weightsName = weightsNameMap.value[item.weightsId] || item.weightsId;
        });
    }

    // 规范化路由中的任务 id（避免 string[] 或空）
    function getRouteTaskId() {
        const raw = route.query.id;
        if (raw == null || raw === '') return '';
        return String(Array.isArray(raw) ? raw[0] : raw).trim();
    }

    // 获取详情数据：优先 getById；失败时再拉 list 用 id 匹配（兼容旧行为）
    async function fetchDetail() {
        const idStr = getRouteTaskId();
        if (!idStr) {
            showFailToast('缺少任务ID');
            return;
        }
        try {
            let found: any = null;
            try {
                const byIdRes: any = await getCalibrationTaskById(idStr);
                if (byIdRes.data) {
                    found = byIdRes.data;
                }
            } catch {
                /* 走 list 回退 */
            }
            if (!found) {
                const listParams: Record<string, any> = { current: 1, size: 9999 };
                if (!isMesDataAdmin()) {
                    const me = getMesCurrentUserNo();
                    if (me) listParams.calibTaskChargeUserNo = me;
                }
                const res: any = await getCalibrationTaskList(listParams);
                const pageData = res.data;
                const records = pageData?.records || (Array.isArray(pageData) ? pageData : []) || [];
                found = records.find((item: any) => String(item.id) === idStr) || null;
            }
            if (!found) {
                showFailToast('未找到该任务');
                return;
            }
            if (!canViewMesTaskByChargeUserNo(found.calibTaskChargeUserNo)) {
                showFailToast('无权查看此任务');
                router.back();
                return;
            }
            if (found.taskStatus !== undefined) found.taskStatus = String(found.taskStatus);
            taskInfo.value = found;

            initEditData();
            await Promise.all([fetchWeightsNames(), fetchScaleSiteNames()]);
            fillLinearWeightsNames();
        } catch {
            showFailToast('获取详情失败');
        }
    }

    // 开始执行
    async function handleStartExecution() {
        submitting.value = true;
        try {
            await startCalibrationTask(taskInfo.value.id);
            showSuccessToast('已开始执行');
            await fetchDetail();
        } catch {
            showFailToast('操作失败');
        } finally {
            submitting.value = false;
        }
    }

    // 停产无需执行
    async function handleStopExecution() {
        try {
            await showConfirmDialog({ title: '确认操作', message: '确定标记为"停产无需执行"吗？提交后不可修改。' });
        } catch {
            return;
        }

        submitting.value = true;
        try {
            await suspendCalibrationTask(taskInfo.value.id);
            showSuccessToast('操作成功');
            await fetchDetail();
        } catch {
            showFailToast('操作失败');
        } finally {
            submitting.value = false;
        }
    }

    // 提交执行结果
    async function handleSubmit() {
        const info = taskInfo.value;
        const {calibType} = info;

        // 所有字段都要提交，不管填没填
        const submitData: any = {
            taskId: info.id,
            execUserNo: info.calibTaskChargeUserNo || '',
            weighVal: '',
            befWeighVal: 0,
            midWeighVal: 0,
            aftWeighVal: 0,
        };

        if (calibType === 'C') {
            submitData.weighVal = scaleItems.value.map((item) => item.weighVal || '').join(',');
        } else if (calibType === 'T') {
            const { befWeighVal, midWeighVal, aftWeighVal } = threePointValues.value;
            submitData.befWeighVal = befWeighVal ? Number(befWeighVal) : 0;
            submitData.midWeighVal = midWeighVal ? Number(midWeighVal) : 0;
            submitData.aftWeighVal = aftWeighVal ? Number(aftWeighVal) : 0;
        } else if (calibType === 'S') {
            submitData.weighVal = linearItems.value.map((item) => item.weighVal || '').join(',');
        }

        submitting.value = true;
        try {
            await submitCalibrationTask(submitData);
            showSuccessToast('提交成功');
            await fetchDetail();
        } catch {
            showFailToast('提交失败');
        } finally {
            submitting.value = false;
        }
    }

    // 车辆校磅：可手工录入，或从 WebSocket 缓存取值
    function handleTakeWeighC(index: number) {
        const item = scaleItems.value[index];
        if (!item?.scaleId) {
            showFailToast('磅秤信息异常');
            return;
        }
        const siteNo = getWeighSiteNoByScaleId(item.scaleId);
        const snap = getLatestScaleWeight(siteNo);
        if (!snap) {
            showFailToast('暂无该磅秤的实时过磅数据，请稍后再试');
            return;
        }
        item.weighVal = String(snap.weight);
    }

    // 三点校磅：前中后共用一个地磅，按同一 weighSiteNo 取推送值
    function handleTakeWeighT(key: string) {
        const sid = scaleIdList.value[0];
        if (!sid) {
            showFailToast('磅秤信息异常');
            return;
        }
        const siteNo = getWeighSiteNoByScaleId(sid);
        const snap = getLatestScaleWeight(siteNo);
        if (!snap) {
            showFailToast('暂无该磅秤的实时过磅数据，请稍后再试');
            return;
        }
        const v = String(snap.weight);
        if (key === 'bef') {
            threePointValues.value.befWeighVal = v;
        } else if (key === 'mid') {
            threePointValues.value.midWeighVal = v;
        } else if (key === 'aft') {
            threePointValues.value.aftWeighVal = v;
        }
    }

    // 线性校磅：多砝码同一地磅
    function handleTakeWeighS(index: number) {
        const sid = scaleIdList.value[0];
        if (!sid) {
            showFailToast('磅秤信息异常');
            return;
        }
        const siteNo = getWeighSiteNoByScaleId(sid);
        const snap = getLatestScaleWeight(siteNo);
        if (!snap) {
            showFailToast('暂无该磅秤的实时过磅数据，请稍后再试');
            return;
        }
        const item = linearItems.value[index];
        if (item) {
            item.weighVal = String(snap.weight);
        }
    }

    onMounted(() => {
        void loadChargeUserNameMap();
        fetchDictData();
        fetchDetail();
    });
</script>
