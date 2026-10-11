<template>
    <div class="customer-form">
        <C_NavBar :title="pageTitle" />

        <VanEmpty v-if="failed" description="客户加载失败"><VanButton size="small" @click="load">重试</VanButton></VanEmpty>
        <VanLoading v-else-if="!ready" class="customer-form__loading">加载中…</VanLoading>
        <VanForm v-else ref="formRef" :show-error="false" scroll-to-error>
            <!-- 基本信息 -->
            <div class="customer-form__section">
                <div class="customer-form__section-head">
                    <div class="customer-form__section-title">基本信息</div>
                    <label class="customer-form__toggle">
                        <span>仅显示必填字段</span>
                        <VanSwitch v-model="onlyRequired" size="16px" />
                    </label>
                </div>

                <VanCellGroup inset class="customer-form__cells">
                    <VanField
                        v-model="form.name"
                        name="name"
                        label="客户名称"
                        placeholder="请输入客户名称"
                        required
                        :rules="[{ required: true, message: '请输入客户名称' }]"
                    />

                    <VanField
                        v-model="form.customerClass"
                        name="customerClass"
                        label="客户分类"
                        placeholder="请选择"
                        required
                        readonly
                        is-link
                        :rules="[{ required: true, message: '请选择客户分类' }]"
                        @click="showClassPicker = true"
                    />

                    <VanField
                        v-model="categoryLabel"
                        name="category"
                        label="产品类别"
                        placeholder="请选择"
                        readonly
                        is-link
                        :class="{ hidden: onlyRequired }"
                        @click="showCategoryPicker = true"
                    />

                    <VanField
                        v-if="!onlyRequired"
                        v-model="form.address"
                        name="address"
                        label="地址"
                        placeholder="请输入详细地址"
                        type="textarea"
                        rows="2"
                        autosize
                    />

                    <VanField
                        v-if="!onlyRequired"
                        v-model="form.remark"
                        name="remark"
                        label="备注"
                        placeholder="请输入备注"
                        type="textarea"
                        rows="2"
                        autosize
                    />
                </VanCellGroup>
            </div>

            <!-- 联系信息 -->
            <div class="customer-form__section">
                <div class="customer-form__section-head">
                    <div class="customer-form__section-title">联系信息</div>
                </div>

                <VanCellGroup inset class="customer-form__cells">
                    <VanField
                        v-model="form.contactName"
                        name="contactName"
                        label="联系人"
                        placeholder="请输入联系人姓名"
                        required
                        :rules="[{ required: true, message: '请输入联系人' }]"
                    />

                    <VanField
                        v-model="form.contactPhone"
                        name="contactPhone"
                        label="联系电话"
                        placeholder="请输入手机号"
                        type="tel"
                        required
                        :rules="[
                            { required: true, message: '请输入联系电话' },
                            { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                        ]"
                    />

                    <VanField
                        v-if="!onlyRequired"
                        v-model="form.position"
                        name="position"
                        label="职位"
                        placeholder="请输入职位"
                    />
                </VanCellGroup>
            </div>
        </VanForm>

        <!-- 底部按钮 -->
        <div class="customer-form__footer">
            <VanButton block round @click="onCancel">取 消</VanButton>
            <VanButton block round type="primary" :loading="loading" :disabled="!ready" @click="onSubmit">
                {{ isEdit ? '保 存' : '提 交' }}
            </VanButton>
        </div>

        <!-- Picker 弹出 -->
        <VanPopup v-model:show="showClassPicker" position="bottom" round>
            <VanPicker
                :columns="CLASS_OPTIONS"
                @confirm="onClassConfirm"
                @cancel="showClassPicker = false"
            />
        </VanPopup>

        <VanPopup v-model:show="showCategoryPicker" position="bottom" round>
            <VanPicker
                :columns="CATEGORY_OPTIONS"
                @confirm="onCategoryConfirm"
                @cancel="showCategoryPicker = false"
            />
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './form.scss';
    import { showToast, showConfirmDialog, type FormInstance } from 'vant';
    import { getCustomerDetail, addCustomer, updateCustomer } from '@/api/customer';
    import { CATEGORY_MAP, CLASS_OPTIONS, CATEGORY_OPTIONS } from './data';

    defineOptions({ name: 'CustomerForm' });

    const route = useRoute();
    const router = useRouter();

    const isEdit = computed(() => !!route.query.id);
    const pageTitle = computed(() => (isEdit.value ? '编辑客户' : '新增客户'));

    // ── 表单数据 ──
    const form = reactive({
        name: '',
        customerClass: '',
        category: 'hotRolled',
        contactName: '',
        contactPhone: '',
        position: '',
        address: '',
        remark: '',
    });

    const ready = ref(!route.query.id);
    const failed = ref(false);
    async function load() {
        ready.value = false; failed.value = false;
        try {
            if (route.query.id) {
                const customer = await getCustomerDetail(Number(route.query.id));
                for (const key of Object.keys(form) as (keyof typeof form)[]) form[key] = customer[key];
            }
            ready.value = true;
        } catch { failed.value = true; }
    }
    watch(() => route.query.id, load, { immediate: true });

    // ── 分类选择 ──
    const showClassPicker = ref(false);
    const onClassConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
        form.customerClass = selectedValues[0];
        showClassPicker.value = false;
    };

    const showCategoryPicker = ref(false);
    const onCategoryConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
        form.category = selectedValues[0];
        showCategoryPicker.value = false;
    };

    const categoryLabel = computed(() => {
        const cat = CATEGORY_MAP[form.category];
        return cat ? cat.text : '';
    });

    // ── 必填切换 ──
    const onlyRequired = ref(false);

    // ── 提交 ──
    const formRef = ref<FormInstance>();
    const loading = ref(false);

    const onSubmit = async () => {
        if (loading.value || !ready.value) return;
        try {
            await formRef.value?.validate();
            loading.value = true;
            const result = isEdit.value ? await updateCustomer(Number(route.query.id), form) : await addCustomer(form);
            showToast(isEdit.value ? '保存成功' : '新增成功');
            await router.replace({ path: '/customerDetail', query: { id: String(result.id) } });
        } catch { /* 保留表单，支持重试 */ }
        finally { loading.value = false; }
    };

    const onCancel = () => {
        showConfirmDialog({ title: '提示', message: '确定放弃当前编辑？' })
            .then(() => router.back())
            .catch(() => {});
    };
</script>
