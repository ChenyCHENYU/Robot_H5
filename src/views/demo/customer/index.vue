<template>
    <div ref="page" class="customer-list">
        <C_NavBar title="客户档案" />

        <!-- 搜索区 -->
        <div class="customer-list__search">
            <VanField
                v-model="searchText"
                placeholder="点击输入客户名称"
                clearable
                class="customer-list__search-input"
            >
                <template #left-icon>
                    <i class="i-ph:magnifying-glass-bold customer-list__search-icon" />
                </template>
            </VanField>
        </div>

        <!-- Tab 过滤 -->
        <VanTabs v-model:active="activeTab" shrink class="customer-list__tabs">
            <VanTab v-for="tab in TAB_LIST" :key="tab.key" :name="tab.key" :title="tab.label" />
        </VanTabs>

        <!-- 列表 -->
        <div class="customer-list__body">
            <div
                v-for="item in filteredList"
                :key="item.id"
                class="customer-list__card"
                role="button" tabindex="0"
                @keydown.enter="onDetail(item)"
                @click="onDetail(item)"
            >
                <!-- 头部：编号 + 标签 -->
                <div class="customer-list__card-head">
                    <VanTag plain type="primary" class="customer-list__code">
                        {{ item.code }}
                    </VanTag>
                    <div class="customer-list__card-tags">
                        <VanTag v-if="item.category" :type="categoryInfo(item.category).type" round size="medium">
                            {{ categoryInfo(item.category).text }}
                        </VanTag>
                        <VanTag :type="statusInfo(item.conversionStatus).type" round size="medium">
                            {{ statusInfo(item.conversionStatus).text }}
                        </VanTag>
                    </div>
                </div>

                <!-- 客户名称 -->
                <div class="customer-list__card-name">{{ item.name }}</div>

                <!-- meta 信息 -->
                <div class="customer-list__card-meta">
                    <div class="customer-list__meta-row">
                        <span class="customer-list__meta-label">联系人：</span>
                        <span>{{ item.contactName }}</span>
                        <a :href="`tel:${item.contactPhone}`" class="customer-list__phone" @click.stop>
                            {{ item.contactPhone }}
                        </a>
                        <span class="customer-list__meta-gap" />
                        <span class="customer-list__meta-label">业务员：</span>
                        <span>{{ item.salesPerson }}</span>
                    </div>
                    <div class="customer-list__meta-row">
                        <span class="customer-list__meta-label">创建人：</span>
                        <span>{{ item.creator }}</span>
                        <span class="customer-list__meta-time">{{ item.createTime }}</span>
                    </div>
                    <div class="customer-list__meta-row">
                        <span class="customer-list__meta-label">最后跟进人：</span>
                        <span>{{ item.lastFollower }}</span>
                        <span class="customer-list__meta-time">{{ item.lastFollowTime }}</span>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="customer-list__card-ops">
                    <div
                        v-if="item.conversionStatus === 'unconverted'"
                        class="customer-list__op"
                        role="button" tabindex="0"
                        @keydown.enter.stop="onConvert(item)"
                        @click.stop="onConvert(item)"
                    >
                        <i class="i-ph:arrows-clockwise-bold" />
                        <span>转化</span>
                    </div>
                    <div class="customer-list__op customer-list__op--danger" role="button" tabindex="0" @keydown.enter.stop="onVoid(item)" @click.stop="onVoid(item)">
                        <i class="i-ph:x-square-bold" />
                        <span>作废</span>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <VanLoading v-if="loading" class="customer-list__loading">加载中…</VanLoading>
            <VanEmpty v-else-if="failed" description="客户加载失败">
                <VanButton type="primary" size="small" @click="load">重新加载</VanButton>
            </VanEmpty>
            <VanEmpty v-else-if="!filteredList.length" description="暂无客户数据" />
        </div>

        <!-- 底部新增按钮 -->
        <div class="customer-list__footer">
            <VanButton type="primary" block class="customer-list__add-btn" @click="onAdd">
                + 新增客户档案
            </VanButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useScrollCache } from '@/hooks/useScrollCache';
    import { showToast, showConfirmDialog } from 'vant';
    import { getCustomerList, updateCustomer, deleteCustomer } from '@/api/customer';
    import {
        TAB_LIST,
        STATUS_MAP,
        CATEGORY_MAP,
        type Customer,
    } from './data';

    defineOptions({ name: 'CustomerArchive' });

    const router = useRouter();
    const page = ref<HTMLElement | null>(null);
    useScrollCache(page);
    const customers = ref<Customer[]>([]);
    const loading = ref(false);
    const failed = ref(false);
    const busy = ref(false);
    async function load() {
        if (loading.value) return;
        loading.value = true; failed.value = false;
        try { customers.value = await getCustomerList(); }
        catch { failed.value = true; }
        finally { loading.value = false; }
    }
    onMounted(load);
    onActivated(load);

    // ── 搜索 + Tab ─────────────────────────────────────────
    const searchText = ref('');
    const activeTab = ref('all');

    const filteredList = computed(() => {
        let list = customers.value;
        if (activeTab.value !== 'all') {
            list = list.filter((c) => c.customerType === activeTab.value);
        }
        if (searchText.value.trim()) {
            const kw = searchText.value.trim().toLowerCase();
            list = list.filter(
                (c) =>
                    c.name.toLowerCase().includes(kw) ||
                    c.code.toLowerCase().includes(kw) ||
                    c.contactName.includes(kw),
            );
        }
        return list;
    });

    // ── 操作 ────────────────────────────────────────────────
    const onConvert = async (row: Customer) => {
        if (busy.value) return;
        busy.value = true;
        try { await updateCustomer(row.id, { action: 'convert' }); await load(); showToast('客户已转化'); }
        catch { /* 请求层反馈 */ }
        finally { busy.value = false; }
    };
    const onVoid = async (row: Customer) => {
        if (busy.value) return;
        try { await showConfirmDialog({ title: '作废客户', message: `确定作废“${row.name}”？` }); }
        catch { return; }
        busy.value = true;
        try { await deleteCustomer(row.id); await load(); showToast('客户已作废'); }
        catch { /* 请求层反馈 */ }
        finally { busy.value = false; }
    };

    const onDetail = (row: Customer) => {
        router.push({ path: '/customerDetail', query: { id: String(row.id) } });
    };

    const onAdd = () => {
        router.push('/customerForm');
    };

    // 状态颜色
    const statusInfo = (val: string) => STATUS_MAP[val as keyof typeof STATUS_MAP] ?? { text: val, type: 'default' as const };
    const categoryInfo = (val: string) => CATEGORY_MAP[val] ?? { text: val, type: 'primary' as const };
</script>
