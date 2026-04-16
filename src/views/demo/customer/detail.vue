<script setup lang="ts">
    import './detail.scss';
    import { showToast } from 'vant';
    import {
        MOCK_CUSTOMERS,
        STATUS_MAP,
        CATEGORY_MAP,
        type Customer,
    } from './data';

    defineOptions({ name: 'CustomerDetail' });

    const route = useRoute();
    const router = useRouter();

    // 按 query.id 取数据
    const customer = computed<Customer | undefined>(() => {
        const id = Number(route.query.id);
        return MOCK_CUSTOMERS.find((c) => c.id === id) ?? MOCK_CUSTOMERS[0];
    });

    const statusInfo = (val: string) => STATUS_MAP[val as keyof typeof STATUS_MAP] ?? { text: val, type: 'default' as const };
    const categoryInfo = (val: string) => CATEGORY_MAP[val] ?? { text: val, type: 'primary' as const };

    const onConvert = () => showToast('转化');
    const onTransferPublic = () => showToast('转公海');
    const onEdit = () => {
        if (customer.value) {
            router.push({ path: '/customerForm', query: { id: String(customer.value.id) } });
        }
    };
</script>

<template>
    <div v-if="customer" class="customer-detail">
        <C_NavBar title="客户档案详情" />

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
                    @click="onConvert"
                >
                    <i class="i-ph:arrows-clockwise-bold" style="margin-right: 2px" />
                    转化
                </VanButton>
                <VanButton size="small" round @click="onTransferPublic">
                    <i class="i-ph:globe-bold" style="margin-right: 2px" />
                    转公海
                </VanButton>
                <VanButton size="small" round @click="onEdit">
                    <i class="i-ph:pencil-simple-bold" style="margin-right: 2px" />
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
                <VanCell title="客户类型">
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
    </div>
</template>
