<template>
    <div class="customer-detail">
        <C_NavBar title="客户档案详情" />
        <VanLoading v-if="loading" class="customer-detail__loading">加载中…</VanLoading>
        <VanEmpty v-else-if="!customer" description="客户不存在或加载失败">
            <VanButton size="small" type="primary" @click="load">重试</VanButton>
        </VanEmpty>
        <template v-else>

        <!-- 顶部信息卡 -->
        <div class="customer-detail__header">
            <div class="customer-detail__header-top">
                <VanTag plain type="primary" class="customer-detail__code">{{ customer.code }}</VanTag>
                <VanTag :type="statusInfo(customer.conversionStatus).type" round size="medium">
                    {{ statusInfo(customer.conversionStatus).text }}
                </VanTag>
            </div>
            <div class="customer-detail__name">{{ customer.name }}</div>
            <div class="customer-detail__header-meta">
                <span>
                    <VanTag :type="categoryInfo(customer.category).type" round size="medium">
                        {{ categoryInfo(customer.category).text }}
                    </VanTag>
                </span>
            </div>
            <div class="customer-detail__header-info">
                <div class="customer-detail__info-row">
                    <span class="customer-detail__info-label">创建人：</span>
                    <span>{{ customer.creator }}</span>
                    <span class="customer-detail__info-time">{{ customer.createTime }}</span>
                </div>
                <div class="customer-detail__info-row">
                    <span class="customer-detail__info-label">最后跟进人：</span>
                    <span>{{ customer.lastFollower }}</span>
                    <span class="customer-detail__info-time">{{ customer.lastFollowTime }}</span>
                </div>
            </div>
            <div class="customer-detail__header-actions">
                <VanButton
                    v-if="customer.conversionStatus === 'unconverted'"
                    size="small"
                    type="primary"
                    round
                    :loading="saving"
                    @click="onConvert"
                >
                    <i class="i-ph:arrows-clockwise-bold customer-detail__action-icon" />
                    转化
                </VanButton>
                <VanButton v-if="customer.customerType !== 'public'" size="small" round :loading="saving" @click="onTransferPublic">
                    <i class="i-ph:globe-bold customer-detail__action-icon" />
                    转公海
                </VanButton>
                <VanButton size="small" round @click="onEdit">
                    <i class="i-ph:pencil-simple-bold customer-detail__action-icon" />
                    编辑
                </VanButton>
            </div>
        </div>

        <!-- 基本信息 -->
        <div class="customer-detail__section">
            <div class="customer-detail__section-title">基本信息</div>
            <VanCellGroup inset class="customer-detail__cells">
                <VanCell title="客户名称" :value="customer.name" />
                <VanCell title="客户编号" :value="customer.code" />
                <VanCell title="客户分类" :value="customer.customerClass" />
                <VanCell title="产品类别">
                    <template #value>
                        <VanTag :type="categoryInfo(customer.category).type" round>
                            {{ categoryInfo(customer.category).text }}
                        </VanTag>
                    </template>
                </VanCell>
                <VanCell title="地址" :value="customer.address" />
                <VanCell title="备注" :value="customer.remark || '—'" />
            </VanCellGroup>
        </div>

        <!-- 联系信息 -->
        <div class="customer-detail__section">
            <div class="customer-detail__section-title">联系信息</div>
            <VanCellGroup inset class="customer-detail__cells">
                <VanCell title="联系人" :value="customer.contactName" />
                <VanCell title="职位" :value="customer.position || '—'" />
                <VanCell title="联系电话" is-link @click="() => {}">
                    <template #value>
                        <a :href="`tel:${customer.contactPhone}`" class="customer-detail__phone">
                            {{ customer.contactPhone }}
                        </a>
                    </template>
                </VanCell>
            </VanCellGroup>
        </div>

        <!-- 业务信息 -->
        <div class="customer-detail__section">
            <div class="customer-detail__section-title">业务信息</div>
            <VanCellGroup inset class="customer-detail__cells">
                <VanCell title="业务员" :value="customer.salesPerson" />
                <VanCell title="创建人" :value="customer.creator" />
                <VanCell title="创建时间" :value="customer.createTime" />
                <VanCell title="最后跟进人" :value="customer.lastFollower" />
                <VanCell title="最后跟进时间" :value="customer.lastFollowTime" />
                <VanCell title="转化状态">
                    <template #value>
                        <VanTag :type="statusInfo(customer.conversionStatus).type" round>
                            {{ statusInfo(customer.conversionStatus).text }}
                        </VanTag>
                    </template>
                </VanCell>
            </VanCellGroup>
        </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import './detail.scss';
    import { showToast } from 'vant';
    import { getCustomerDetail, updateCustomer } from '@/api/customer';
    import {
        STATUS_MAP,
        CATEGORY_MAP,
        type Customer,
    } from './data';

    defineOptions({ name: 'CustomerDetail' });

    const route = useRoute();
    const router = useRouter();

    const customer = ref<Customer>();
    const loading = ref(false);
    const saving = ref(false);
    async function load() {
        loading.value = true;
        try { customer.value = await getCustomerDetail(Number(route.query.id)); }
        catch { customer.value = undefined; }
        finally { loading.value = false; }
    }
    watch(() => route.query.id, load, { immediate: true });

    const statusInfo = (val: string) => STATUS_MAP[val as keyof typeof STATUS_MAP] ?? { text: val, type: 'default' as const };
    const categoryInfo = (val: string) => CATEGORY_MAP[val] ?? { text: val, type: 'primary' as const };

    async function update(action: 'convert' | 'public') {
        if (!customer.value || saving.value) return;
        saving.value = true;
        try { customer.value = await updateCustomer(customer.value.id, { action }); showToast('客户状态已更新'); }
        catch { /* 请求层反馈 */ }
        finally { saving.value = false; }
    }
    const onConvert = () => update('convert');
    const onTransferPublic = () => update('public');
    const onEdit = () => {
        if (customer.value) {
            router.push({ path: '/customerForm', query: { id: String(customer.value.id) } });
        }
    };
</script>
