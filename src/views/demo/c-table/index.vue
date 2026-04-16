<script setup lang="ts">
    import type { TableColumn, TableOperation } from '@/components/C_Table/types';

    defineOptions({ name: 'CTableDemo' });

    interface UserRow {
        id: number;
        name: string;
        dept: string;
        role: string;
        phone: string;
        createdAt: string;
        status: number;
    }

    // ── 列定义 ────────────────────────────────────────────

    const columns: TableColumn<UserRow>[] = [
        {
            key: 'name',
            label: '姓名',
            primary: true,
        },
        {
            key: 'dept',
            label: '部门',
            secondary: true,
        },
        {
            key: 'status',
            label: '状态',
            alignRight: true,
            tagMap: {
                1: { text: '启用', type: 'success' },
                0: { text: '停用', type: 'danger' },
                2: { text: '待审核', type: 'warning' },
            },
        },
        { key: 'role', label: '角色', meta: true },
        { key: 'phone', label: '手机', meta: true },
        { key: 'createdAt', label: '创建时间', meta: true },
    ];

    const operations: TableOperation<UserRow>[] = [
        {
            label: '编辑',
            type: 'primary',
            icon: 'i-ph:pencil-simple-bold',
            show: (row) => row.status !== 0,
            onClick: (row) => console.log('编辑', row.name),
        },
        {
            label: '停用',
            type: 'danger',
            icon: 'i-ph:prohibit-bold',
            show: (row) => row.status === 1,
            onClick: (row) => {
                const item = tableData.value.find((r) => r.id === row.id);
                if (item) item.status = 0;
            },
        },
        {
            label: '启用',
            type: 'success',
            icon: 'i-ph:check-circle-bold',
            show: (row) => row.status === 0,
            onClick: (row) => {
                const item = tableData.value.find((r) => r.id === row.id);
                if (item) item.status = 1;
            },
        },
    ];

    // ── 模拟数据 ──────────────────────────────────────────

    const MOCK_POOL: UserRow[] = Array.from({ length: 28 }, (_, i) => ({
        id: i + 1,
        name: ['张三', '李四', '王五', '赵六', '孙七', '周八'][i % 6] + `${i + 1}`,
        dept: ['研发部', '产品部', '设计部', '运营部'][i % 4],
        role: ['开发', '产品经理', 'UI 设计师', '运营专员'][i % 4],
        phone: `138${String(10000000 + i).slice(1)}`,
        createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
        status: [1, 1, 0, 2][i % 4],
    }));

    const PAGE_SIZE = 10;
    const tableData = ref<UserRow[]>([]);
    const total = ref(MOCK_POOL.length);
    const loading = ref(false);
    const finished = ref(false);

    const loadPage = async (page: number) => {
        loading.value = true;
        await new Promise((r) => setTimeout(r, 700));
        const slice = MOCK_POOL.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        if (page === 1) {
            tableData.value = slice;
        } else {
            tableData.value.push(...slice);
        }
        if (tableData.value.length >= MOCK_POOL.length) {
            finished.value = true;
        }
        loading.value = false;
    };

    const onLoad = async (pageNo: number) => {
        await loadPage(pageNo);
    };

    const onRefresh = async () => {
        finished.value = false;
        await loadPage(1);
        loading.value = false;
    };

    // 首次加载
    onMounted(() => onLoad(1));
</script>

<template>
    <div class="c-table-demo">
        <C_NavBar title="表格组件" />
        <C_Table
            :columns="columns"
            :data="tableData"
            :total="total"
            :loading="loading"
            :finished="finished"
            :operations="operations"
            empty-text="暂无用户数据"
            @load="onLoad"
            @refresh="onRefresh"
        />
    </div>
</template>

<style lang="scss" scoped>
.c-table-demo {
    min-height: 100dvh;
    background: var(--ds-bg);
}
</style>
