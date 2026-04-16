<script setup lang="ts" generic="T extends Record<string, any>">
    /**
     * C_Table — 移动端配置驱动列表/表格组件
     *
     * 设计目标：
     *  1. 配置驱动：通过 columns 数组描述列，支持自定义渲染插槽
     *  2. 卡片式布局：每行数据渲染为一张卡片（更适合移动端）
     *  3. 支持下拉刷新 + 上拉加载（集成 van-pull-refresh + van-list）
     *  4. 操作列：通过 operations 配置行内操作按钮，支持条件显示/禁用
     *  5. 状态列：通过 tagMap 配置 Tag 颜色映射
     *  6. 空状态/加载/错误 三种空屏处理
     *
     * 用法示例：
     *  <C_Table
     *    :columns="columnsDef"
     *    :data="tableData"
     *    :total="total"
     *    :loading="loading"
     *    @load="onLoad"
     *    @refresh="onRefresh"
     *  >
     *    <template #cell-status="{ row }">
     *      <van-tag :type="statusMap[row.status]">{{ row.statusText }}</van-tag>
     *    </template>
     *  </C_Table>
     */
    import './index.scss';
    import type { TagType, TableOperation, TableColumn, CTableInstance } from '#/Table/type';

    defineOptions({ name: 'C_Table' });

    // 类型定义：#/Table/type.ts
    // 下方不再内联 export，避免 script setup 限制

    // ── Props / Emits ─────────────────────────────────────────

    const props = withDefaults(
        defineProps<{
            /** 列配置 */
            columns: TableColumn<T>[];
            /** 表格数据 */
            data?: T[];
            /** 总条数（用于判断是否加载完毕） */
            total?: number;
            /** 加载状态 */
            loading?: boolean;
            /** 是否处于错误状态 */
            error?: boolean;
            /** 是否已加载全部（手动控制） */
            finished?: boolean;
            /** 是否禁用下拉刷新 */
            disablePullRefresh?: boolean;
            /** 每页大小 */
            pageSize?: number;
            /** 行内操作按钮 */
            operations?: TableOperation<T>[];
            /** 空状态描述文字 */
            emptyText?: string;
            /** 唯一 key 字段名 */
            rowKey?: string;
        }>(),
        {
            data: () => [],
            total: 0,
            loading: false,
            error: false,
            finished: false,
            disablePullRefresh: false,
            pageSize: 10,
            operations: () => [],
            emptyText: '暂无数据',
            rowKey: 'id',
        },
    );

    const emit = defineEmits<{
        /** 加载更多（上拉） */
        load: [pageNo: number, pageSize: number];
        /** 下拉刷新 */
        refresh: [];
    }>();

    // ── 内部状态 ─────────────────────────────────────────────

    const isRefreshing = ref(false);
    const isLoading = ref(false);
    const isFinished = ref(false);
    const isError = ref(false);
    const pageNo = ref(0);

    watch(() => props.loading, (v) => { isLoading.value = v; });
    watch(() => props.error, (v) => { isError.value = v; if (v) { isRefreshing.value = false; isLoading.value = false; } });
    watch(() => props.finished, (v) => { isFinished.value = v; });

    // 每次外部数据变化时判断是否已全部加载
    watch(
        () => props.data.length,
        (len) => {
            if (props.total > 0 && len >= props.total) {
                isFinished.value = true;
            }
        },
    );

    const handleRefresh = () => {
        pageNo.value = 1;
        isFinished.value = false;
        isError.value = false;
        isLoading.value = true;
        isRefreshing.value = true;
        emit('refresh');
    };

    const handleLoad = () => {
        if (!isRefreshing.value) {
            pageNo.value++;
            isLoading.value = true;
            isError.value = false;
            emit('load', pageNo.value, props.pageSize);
        }
    };

    /** 手动触发刷新 */
    const refresh = () => handleRefresh();

    defineExpose<CTableInstance>({ refresh });

    // ── 辅助计算 ─────────────────────────────────────────────

    /** 主标题列 */
    const primaryColumn = computed(() => props.columns.find((c) => c.primary));
    /** 副标题列 */
    const secondaryColumn = computed(() => props.columns.find((c) => c.secondary));
    /** meta 信息列（显示在卡片底部） */
    const metaColumns = computed(() =>
        props.columns.filter((c) => c.meta && !c.primary && !c.secondary && !c.hidden),
    );
    /** 右侧信息列（操作区左边）*/
    const rightColumns = computed(() =>
        props.columns.filter((c) => c.alignRight && !c.primary && !c.secondary && !c.meta && !c.hidden),
    );

    /** 渲染 Tag */
    const renderTag = (col: TableColumn<T>, row: T) => {
        const val = row[col.key];
        const map = col.tagMap;
        if (!map) return null;
        const entry = map[val];
        if (!entry) return { text: col.format ? col.format(val, row) : String(val ?? ''), type: 'default' as TagType };
        return { text: entry.text ?? String(val), type: entry.type };
    };

    /** 渲染格式化值 */
    const renderValue = (col: TableColumn<T>, row: T) => {
        const val = row[col.key];
        if (col.format) return col.format(val, row);
        return val ?? '—';
    };

    /** 可见操作按钮 */
    const visibleOps = (row: T) =>
        props.operations.filter((op) => (op.show ? op.show(row) : true));
</script>

<template>
    <VanPullRefresh
        v-model="isRefreshing"
        class="c-table"
        :disabled="disablePullRefresh"
        @refresh="handleRefresh"
    >
        <VanList
            v-model:loading="isLoading"
            v-model:error="isError"
            :finished="isFinished"
            :immediate-check="false"
            error-text="加载失败，点击重试"
            finished-text="没有更多了"
            @load="handleLoad"
        >
            <!-- 空状态 -->
            <template v-if="!data.length && !isLoading && !isRefreshing" #default>
                <slot name="empty">
                    <VanEmpty class="c-table__empty" :description="emptyText">
                        <template #image>
                            <i class="i-ph:clipboard-text-bold c-table__empty-icon" />
                        </template>
                    </VanEmpty>
                </slot>
            </template>

            <!-- 数据列表 -->
            <div v-if="data.length" class="c-table__list">
                <div
                    v-for="row in data"
                    :key="(row as any)[rowKey]"
                    class="c-table__card"
                >
                    <!-- 卡片头部：主标题 + 右侧列/操作 -->
                    <div class="c-table__card-head">
                        <div class="c-table__card-head-left">
                            <!-- 主标题（primary 列）-->
                            <template v-if="primaryColumn">
                                <template v-if="primaryColumn.slot">
                                    <slot :name="`cell-${primaryColumn.key}`" :row="row" :col="primaryColumn" />
                                </template>
                                <span v-else class="c-table__primary">
                                    {{ renderValue(primaryColumn, row) }}
                                </span>
                            </template>
                            <!-- 副标题（secondary 列）-->
                            <template v-if="secondaryColumn">
                                <template v-if="secondaryColumn.slot">
                                    <slot :name="`cell-${secondaryColumn.key}`" :row="row" :col="secondaryColumn" />
                                </template>
                                <span v-else class="c-table__secondary">
                                    {{ renderValue(secondaryColumn, row) }}
                                </span>
                            </template>
                        </div>

                        <!-- 右侧：alignRight 列（如状态 Tag）-->
                        <div class="c-table__card-head-right">
                            <template v-for="col in rightColumns" :key="col.key">
                                <template v-if="col.slot">
                                    <slot :name="`cell-${col.key}`" :row="row" :col="col" />
                                </template>
                                <template v-else-if="col.tagMap">
                                    <VanTag
                                        v-if="renderTag(col, row)"
                                        :type="renderTag(col, row)!.type"
                                        round
                                        size="medium"
                                    >
                                        {{ renderTag(col, row)!.text }}
                                    </VanTag>
                                </template>
                                <span v-else class="c-table__right-val">
                                    {{ renderValue(col, row) }}
                                </span>
                            </template>
                        </div>
                    </div>

                    <!-- meta 行：label: value 网格 -->
                    <div v-if="metaColumns.length" class="c-table__card-meta">
                        <div
                            v-for="col in metaColumns"
                            :key="col.key"
                            class="c-table__meta-item"
                        >
                            <span class="c-table__meta-label">{{ col.label }}</span>
                            <template v-if="col.slot">
                                <slot :name="`cell-${col.key}`" :row="row" :col="col" />
                            </template>
                            <template v-else-if="col.tagMap">
                                <VanTag
                                    v-if="renderTag(col, row)"
                                    :type="renderTag(col, row)!.type"
                                    size="medium"
                                >
                                    {{ renderTag(col, row)!.text }}
                                </VanTag>
                            </template>
                            <span v-else class="c-table__meta-val">{{ renderValue(col, row) }}</span>
                        </div>
                    </div>

                    <!-- 操作按钮行 -->
                    <div v-if="visibleOps(row).length" class="c-table__card-ops">
                        <VanButton
                            v-for="op in visibleOps(row)"
                            :key="op.label"
                            size="small"
                            round
                            :type="op.type || 'primary'"
                            :plain="op.type !== 'danger'"
                            :disabled="op.disabled ? op.disabled(row) : false"
                            class="c-table__op-btn"
                            @click.stop="op.onClick(row)"
                        >
                            <i v-if="op.icon" :class="[op.icon, 'c-table__op-icon']" />
                            {{ op.label }}
                        </VanButton>
                    </div>
                </div>
            </div>
        </VanList>
    </VanPullRefresh>
</template>
