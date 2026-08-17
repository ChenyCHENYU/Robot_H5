<template>
    <div class="weight-verify-page">
        <C_NavBar title="校磅任务" />

        <!-- 搜索区域 -->
        <div class="weight-verify-page__search-area">
            <div class="weight-verify-page__search-box">
                <VanField
                    v-model="searchKeyword"
                    placeholder="请输入任务名称/编号"
                    clearable
                    class="weight-verify-page__search-input"
                />
            </div>
        </div>

        <!-- 筛选区域 -->
        <div class="weight-verify-page__filter">
            <div class="weight-verify-page__filter-row">
                <div class="weight-verify-page__filter-item" @click="showStatusPicker = true">
                    <span class="weight-verify-page__filter-label">状态</span>
                    <span class="weight-verify-page__filter-value">{{ filterStatusText || '全部' }}</span>
                    <VanIcon name="arrow-down" size="12" />
                </div>
                <div class="weight-verify-page__filter-item" @click="showTypePicker = true">
                    <span class="weight-verify-page__filter-label">校磅类型</span>
                    <span class="weight-verify-page__filter-value">{{ filterTypeText || '全部' }}</span>
                    <VanIcon name="arrow-down" size="12" />
                </div>
            </div>
            <div class="weight-verify-page__filter-row weight-verify-page__filter-row--center">
                <VanButton type="primary" size="small" round class="weight-verify-page__search-btn" @click="handleSearch">
                    查询
                </VanButton>
            </div>
        </div>

        <!-- 状态选择弹窗 -->
        <VanPopup v-model:show="showStatusPicker" position="bottom" round>
            <VanPicker
                :columns="statusOptions"
                @confirm="onStatusConfirm"
                @cancel="showStatusPicker = false"
                title="选择任务状态"
            />
        </VanPopup>

        <!-- 校磅类型选择弹窗 -->
        <VanPopup v-model:show="showTypePicker" position="bottom" round>
            <VanPicker
                :columns="typeOptions"
                @confirm="onTypeConfirm"
                @cancel="showTypePicker = false"
                title="选择校磅类型"
            />
        </VanPopup>

        <!-- 任务列表 -->
        <div class="weight-verify-page__list">
            <div
                v-for="task in filteredList"
                :key="task.id"
                class="weight-verify-page__card"
            >
                <!-- 卡片头部：蓝色竖条 + 标题 + 状态标签 -->
                <div class="weight-verify-page__card-header">
                    <div class="weight-verify-page__header-left">
                        <span class="weight-verify-page__blue-bar"></span>
                        <span class="weight-verify-page__header-title">{{ task.calibTaskName || '校磅任务' }}</span>
                    </div>
                    <VanTag :type="getStatusTagType(task.taskStatus)" plain round size="medium">
                        {{ getStatusText(task.taskStatus) }}
                    </VanTag>
                </div>

                <!-- 虚线分隔 -->
                <div class="weight-verify-page__divider"></div>

                <!-- 卡片内容 -->
                <div class="weight-verify-page__card-body">
                    <div class="weight-verify-page__info-row">
                        <span class="weight-verify-page__info-label">任务编号</span>
                        <span class="weight-verify-page__info-value">{{ task.calibTaskNo || '-' }}</span>
                    </div>
                    <div class="weight-verify-page__info-row">
                        <span class="weight-verify-page__info-label">负责人</span>
                        <span class="weight-verify-page__info-value">{{ formatTaskChargeUser(task) }}</span>
                    </div>
                    <div class="weight-verify-page__info-row">
                        <span class="weight-verify-page__info-label">校磅类型</span>
                        <span class="weight-verify-page__info-value">{{ getCalibTypeText(task.calibType) }}</span>
                    </div>
                    <div class="weight-verify-page__info-row">
                        <span class="weight-verify-page__info-label">磅秤</span>
                        <span class="weight-verify-page__info-value">{{ formatScaleIds(task.scaleIds) }}</span>
                    </div>
                    <div class="weight-verify-page__info-row">
                        <span class="weight-verify-page__info-label">截止时间</span>
                        <span class="weight-verify-page__info-value">{{ task.taskDeadlineTime || '-' }}</span>
                    </div>
                    <div class="weight-verify-page__info-row" v-if="task.taskStatus === '3' || task.taskStatus === '5'">
                        <span class="weight-verify-page__info-label">完成时间</span>
                        <span class="weight-verify-page__info-value">{{ getCardDate(task) }}</span>
                    </div>
                </div>

                <!-- 卡片底部操作按钮 -->
                <div class="weight-verify-page__divider"></div>
                <div class="weight-verify-page__card-footer">
                    <VanTag
                        v-if="task.taskStatus === '3' && task.taskResult"
                        :type="task.taskResult === 'Y' ? 'success' : 'danger'"
                        plain
                        round
                        size="medium"
                    >
                        {{ task.taskResult === 'Y' ? '合格' : '不合格' }}
                    </VanTag>
                    <span class="weight-verify-page__footer-spacer"></span>
                    <VanButton plain round size="small" type="primary" class="weight-verify-page__action-btn" @click="goDetail(task)">
                        查看
                    </VanButton>
                </div>
            </div>

            <VanEmpty v-if="filteredList.length === 0 && !loading" description="暂无校磅任务" />
            <div v-if="filteredList.length > 0" class="weight-verify-page__finished-text">没有更多了</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { onActivated } from 'vue';
    import { useRouter } from 'vue-router';
    import { showFailToast, type TagType } from 'vant';
    import { getCalibrationTaskList, getMapByDicSn, getWeightSiteListNoPage } from '@/api/weight-verify';
    import { fetchChargeUserNameMap, formatUserNoWithName } from '@/utils/chargeUserNameMap';
    import { isMesDataAdmin, getMesCurrentUserNo } from '@/utils/mesUserScope';
    import { defaultTaskStatusMap, defaultCalibTypeMap, taskStatusTagTypeMap } from './data';
    import dayjs from 'dayjs';

    defineOptions({ name: 'weightVerifyTask' });

    const router = useRouter();

    const taskList = ref<any[]>([]);
    const loading = ref(false);
    const searchKeyword = ref('');

    // 磅秤展示映射 { id: 展示名 }，优先磅秤名称，没有则退回编号
    const scaleSiteNameMap = ref<Record<string, string>>({});
    // 工号 -> 负责人中文名（与 PC 校秤任务/计划一致，用于「中文名（工号）」展示）
    const chargeUserNameMap = ref<Record<string, string>>({});

    // 筛选条件
    const filterStatus = ref('');
    const filterStatusText = ref('');
    const filterType = ref('');
    const filterTypeText = ref('');
    const showStatusPicker = ref(false);
    const showTypePicker = ref(false);

    // 业务字典：本地兜底
    const taskStatusMap = ref<Record<string, string>>({ ...defaultTaskStatusMap });
    const calibTypeMap = ref<Record<string, string>>({ ...defaultCalibTypeMap });

    // 状态选择器选项
    const statusOptions = computed(() => {
        const opts: { text: string; value: string }[] = [{ text: '全部', value: '' }];
        for (const key in taskStatusMap.value) {
            opts.push({ text: taskStatusMap.value[key], value: key });
        }
        return opts;
    });

    // 校磅类型选择器选项
    const typeOptions = computed(() => {
        const opts: { text: string; value: string }[] = [{ text: '全部', value: '' }];
        for (const key in calibTypeMap.value) {
            opts.push({ text: calibTypeMap.value[key], value: key });
        }
        return opts;
    });

    function onStatusConfirm({ selectedOptions }: any) {
        const selected = selectedOptions[0];
        filterStatus.value = selected.value;
        filterStatusText.value = selected.value ? selected.text : '';
        showStatusPicker.value = false;
    }

    function onTypeConfirm({ selectedOptions }: any) {
        const selected = selectedOptions[0];
        filterType.value = selected.value;
        filterTypeText.value = selected.value ? selected.text : '';
        showTypePicker.value = false;
    }

    // 点击查询
    function handleSearch() {
        fetchList();
    }

    // 获取业务字典
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

    function formatTaskChargeUser(task: any) {
        return formatUserNoWithName(
            chargeUserNameMap.value,
            task?.calibTaskChargeUserNo,
            task?.calibTaskChargeUserName
        );
    }

    async function loadChargeUserNameMap() {
        try {
            chargeUserNameMap.value = await fetchChargeUserNameMap();
        } catch (e) {
            console.warn('加载负责人姓名字典失败', e);
        }
    }

    // 获取所有磅秤名称映射
    async function fetchScaleSiteNames() {
        try {
            const res: any = await getWeightSiteListNoPage();
            const list = res.data || [];
            const nameMap: Record<string, string> = {};
            list.forEach((item: any) => {
                nameMap[item.id] = item.weighSiteName || item.weighSiteNo || item.id;
            });
            scaleSiteNameMap.value = nameMap;
        } catch {
            console.warn('获取磅秤名称失败');
        }
    }

    // 根据ID获取磅秤名称
    function getScaleName(id: string) {
        return scaleSiteNameMap.value[id] || id;
    }

    // 格式化磅秤展示（用名称替代ID）
    function formatScaleIds(scaleIds: string) {
        if (!scaleIds) return '-';
        const ids = scaleIds.split(',').filter(Boolean);
        const names = ids.map((id) => getScaleName(id));
        return names.join('、');
    }

    // 解析紧凑格式日期 20260325135049
    function parseCompactDate(str: string) {
        if (!str || str.length < 8) return null;
        const formatted = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(8, 10) || '00'}:${str.slice(10, 12) || '00'}:${str.slice(12, 14) || '00'}`;
        return dayjs(formatted);
    }

    // 格式化日期为 YYYY-MM-DD HH:mm:ss
    function formatDateFull(d: dayjs.Dayjs | null) {
        if (!d || !d.isValid()) return '';
        return d.format('YYYY-MM-DD HH:mm:ss');
    }

    // 卡片日期文本
    function getCardDate(task: any) {
        const s = task.taskStatus;
        if (s === '3' && task.taskCompleteTime) {
            const d = parseCompactDate(task.taskCompleteTime);
            return formatDateFull(d) || '-';
        }
        if (s === '5' && task.updateDateTime) {
            const d = dayjs(task.updateDateTime);
            return formatDateFull(d) || '-';
        }
        return '-';
    }

    // 列表数据
    const filteredList = computed(() => taskList.value);

    // 获取任务列表
    async function fetchList() {
        loading.value = true;
        try {
            // 与 AmScaleCalibrationTaskController.list(JhPage, AmScaleCalibrationTask) 一致，必须传 current/size 才能正确分页与绑定查询条件
            const params: Record<string, any> = {
                current: 1,
                size: 500,
            };
            if (filterStatus.value) params.taskStatus = filterStatus.value;
            if (filterType.value) params.calibType = filterType.value;
            // 非超级管理员仅查本人为负责人的任务（与列表默认「本人」数据范围一致）
            if (!isMesDataAdmin()) {
                const me = getMesCurrentUserNo();
                if (!me) {
                    showFailToast('无法获取当前用户，请重新登录');
                    taskList.value = [];
                    return;
                }
                params.calibTaskChargeUserNo = me;
            }

            const res: any = await getCalibrationTaskList(params);
            const pageData = res.data;
            let list = pageData?.records || (Array.isArray(pageData) ? pageData : []) || [];
            list = list.map((item: any) => ({
                ...item,
                taskStatus: item.taskStatus !== undefined ? String(item.taskStatus) : '',
            }));
            const kw = searchKeyword.value.trim().toLowerCase();
            if (kw) {
                list = list.filter(
                    (item: any) =>
                        String(item.calibTaskNo || '')
                            .toLowerCase()
                            .includes(kw) ||
                        String(item.calibTaskName || '')
                            .toLowerCase()
                            .includes(kw)
                );
            }
            taskList.value = list;
        } catch {
            showFailToast('获取任务列表失败');
        } finally {
            loading.value = false;
        }
    }

    function goDetail(task: any) {
        router.push({
            path: '/weightVerify/taskList/detail',
            query: { id: task.id, calibType: task.calibType },
        });
    }

    onActivated(() => {
        fetchList();
    });

    void loadChargeUserNameMap();
    fetchDictData();
    fetchScaleSiteNames();
    fetchList();
</script>
