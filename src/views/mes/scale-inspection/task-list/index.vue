<template>
    <div class="scale-inspection-page">
        <C_NavBar title="磅秤巡检任务" />

        <!-- 搜索区域 -->
        <div class="scale-inspection-page__search-area">
            <div class="scale-inspection-page__search-box">
                <VanField
                    v-model="searchKeyword"
                    placeholder="请输入任务名称/编号"
                    clearable
                    class="scale-inspection-page__search-input"
                />
            </div>
        </div>

        <!-- 筛选区域 -->
        <div class="scale-inspection-page__filter">
            <div class="scale-inspection-page__filter-row">
                <div class="scale-inspection-page__filter-item" @click="showStatusPicker = true">
                    <span class="scale-inspection-page__filter-label">状态</span>
                    <span class="scale-inspection-page__filter-value">{{ filterStatusText || '全部' }}</span>
                    <VanIcon name="arrow-down" size="12" />
                </div>
                <div
                    v-if="isDataAdmin"
                    class="scale-inspection-page__filter-item"
                    @click="showUserPicker = true"
                >
                    <span class="scale-inspection-page__filter-label">负责人</span>
                    <span class="scale-inspection-page__filter-value">{{ filterUserText || '全部' }}</span>
                    <VanIcon name="arrow-down" size="12" />
                </div>
                <div v-else class="scale-inspection-page__filter-item scale-inspection-page__filter-item--static">
                    <span class="scale-inspection-page__filter-label">负责人</span>
                    <span class="scale-inspection-page__filter-value">{{ myChargeUserLabel }}</span>
                </div>
            </div>
            <div class="scale-inspection-page__filter-row scale-inspection-page__filter-row--center">
                <VanButton type="primary" size="small" round class="scale-inspection-page__search-btn" @click="handleSearch">
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

        <!-- 负责人选择弹窗 -->
        <VanPopup v-model:show="showUserPicker" position="bottom" round>
            <VanPicker
                :columns="userOptions"
                @confirm="onUserConfirm"
                @cancel="showUserPicker = false"
                title="选择负责人"
            />
        </VanPopup>

        <!-- 任务列表 -->
        <div class="scale-inspection-page__list">
            <div
                v-for="task in filteredList"
                :key="task.id"
                class="scale-inspection-page__card"
            >
                <!-- 卡片头部：蓝色竖条 + 标题 + 状态标签 -->
                <div class="scale-inspection-page__card-header">
                    <div class="scale-inspection-page__header-left">
                        <span class="scale-inspection-page__blue-bar"></span>
                        <span class="scale-inspection-page__header-title">{{ task.taskName || '巡检任务' }}</span>
                    </div>
                    <VanTag :type="getStatusTagType(task.taskStatus)" plain round size="medium">
                        {{ getStatusText(task.taskStatus) }}
                    </VanTag>
                </div>

                <!-- 虚线分隔 -->
                <div class="scale-inspection-page__divider"></div>

                <!-- 卡片内容 -->
                <div class="scale-inspection-page__card-body">
                    <div class="scale-inspection-page__info-row">
                        <span class="scale-inspection-page__info-label">任务编号</span>
                        <span class="scale-inspection-page__info-value">{{ task.taskNo || '-' }}</span>
                    </div>
                    <div class="scale-inspection-page__info-row">
                        <span class="scale-inspection-page__info-label">负责人</span>
                        <span class="scale-inspection-page__info-value">{{ task.inspectTaskChargeUserNo || '-' }}</span>
                    </div>
                    <div class="scale-inspection-page__info-row">
                        <span class="scale-inspection-page__info-label">截止时间</span>
                        <span class="scale-inspection-page__info-value">{{ task.deadlineTime || '-' }}</span>
                    </div>
                    <div class="scale-inspection-page__info-row" v-if="task.taskStatus === '3' || task.taskStatus === '5'">
                        <span class="scale-inspection-page__info-label">完成时间</span>
                        <span class="scale-inspection-page__info-value">{{ getCardDate(task) }}</span>
                    </div>
                </div>

                <!-- 卡片底部 -->
                <div class="scale-inspection-page__divider"></div>
                <div class="scale-inspection-page__card-footer">
                    <VanTag
                        v-if="task.taskStatus === '3' && task.taskResult"
                        :type="task.taskResult === 'Y' ? 'success' : 'danger'"
                        plain
                        round
                        size="medium"
                    >
                        {{ task.taskResult === 'Y' ? '合格' : '不合格' }}
                    </VanTag>
                    <span class="scale-inspection-page__footer-spacer"></span>
                    <VanButton plain round size="small" type="primary" class="scale-inspection-page__action-btn" @click="goDetail(task)">
                        查看
                    </VanButton>
                </div>
            </div>

            <VanEmpty v-if="filteredList.length === 0 && !loading" description="暂无巡检任务" />
            <div v-if="filteredList.length > 0" class="scale-inspection-page__finished-text">没有更多了</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { onActivated } from 'vue';
    import { useRouter } from 'vue-router';
    import { showFailToast, type TagType } from 'vant';
    import { getInspectionTaskList, getMapByDicSn } from '@/api/scale-inspection';
    import { isMesDataAdmin, getMesCurrentUserNo } from '@/utils/mesUserScope';
    import { defaultTaskStatusMap, taskStatusTagTypeMap } from './data';
    import dayjs from 'dayjs';

    defineOptions({ name: 'scaleInspectionTask' });

    const router = useRouter();

    const searchKeyword = ref('');
    const taskList = ref<any[]>([]);
    const loading = ref(false);

    const isDataAdmin = computed(() => isMesDataAdmin());
    const myChargeUserLabel = computed(() => {
        const me = getMesCurrentUserNo();
        return me ? `本人（${me}）` : '未登录';
    });

    // 筛选条件
    const filterStatus = ref('');
    const filterStatusText = ref('');
    const filterUser = ref('');
    const filterUserText = ref('');

    const showStatusPicker = ref(false);
    const showUserPicker = ref(false);

    // 业务字典：本地兜底
    const taskStatusMap = ref<Record<string, string>>({ ...defaultTaskStatusMap });

    // 状态选择器选项
    const statusOptions = computed(() => {
        const opts: { text: string; value: string }[] = [{ text: '全部', value: '' }];
        for (const key in taskStatusMap.value) {
            opts.push({ text: taskStatusMap.value[key], value: key });
        }
        return opts;
    });

    // 仅管理员可按负责人筛选；非管理员固定按当前账号
    const userOptions = computed(() => [{ text: '全部' as string, value: '' as string }]);

    function onStatusConfirm({ selectedOptions }: any) {
        const selected = selectedOptions[0];
        filterStatus.value = selected.value;
        filterStatusText.value = selected.value ? selected.text : '';
        showStatusPicker.value = false;
    }

    function onUserConfirm({ selectedOptions }: any) {
        const selected = selectedOptions[0];
        filterUser.value = selected.value;
        filterUserText.value = selected.value ? selected.text : '';
        showUserPicker.value = false;
    }

    // 点击查询
    function handleSearch() {
        fetchList();
    }

    // 获取业务字典
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

    // 列表数据（直接使用接口返回）
    const filteredList = computed(() => taskList.value);

    // 获取任务列表
    async function fetchList() {
        loading.value = true;
        try {
            // 与 AmInspectionTaskController.list(JhPage, AmInspectionTask) 一致
            const params: Record<string, any> = {
                current: 1,
                size: 500,
            };
            if (filterStatus.value) params.taskStatus = filterStatus.value;
            if (isMesDataAdmin()) {
                if (filterUser.value) params.inspectTaskChargeUserNo = filterUser.value;
            } else {
                const me = getMesCurrentUserNo();
                if (!me) {
                    showFailToast('无法获取当前用户，请重新登录');
                    taskList.value = [];
                    return;
                }
                params.inspectTaskChargeUserNo = me;
            }

            const res: any = await getInspectionTaskList(params);
            const pageData = res.data;
            let list = pageData?.records || (Array.isArray(pageData) ? pageData : []) || [];
            list = list.map((item: any) => ({
                ...item,
                taskStatus: item.taskStatus !== undefined ? String(item.taskStatus) : '',
            }));
            // 关键字：任务编号 / 名称（后端分开 like 为 AND，移动端用本地匹配实现「或」）
            const kw = searchKeyword.value.trim().toLowerCase();
            if (kw) {
                list = list.filter(
                    (item: any) =>
                        String(item.taskNo || '')
                            .toLowerCase()
                            .includes(kw) ||
                        String(item.taskName || '')
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
            path: '/scaleInspection/taskList/detail',
            query: { id: task.id },
        });
    }

    onActivated(() => {
        fetchList();
    });

    fetchDictData();
    fetchList();
</script>
