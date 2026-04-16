<script setup lang="ts">
    import type { CFormInstance, FormField } from '@/components/C_Form/index.vue';

    defineOptions({ name: 'CFormDemo' });

    const formRef = ref<CFormInstance>();
    const submitting = ref(false);

    const formValues = ref<Record<string, any>>({
        deviceName: '',
        deviceCode: '',
        faultType: '',
        urgency: '',
        location: '',
        reporter: '',
        phone: '',
        faultDesc: '',
        notifyManager: true,
        faultParts: [],
    });

    const fields: FormField[] = [
        {
            key: 'deviceName',
            label: '设备名称',
            placeholder: '请输入设备名称',
            prefixIcon: 'i-ph:gear-bold',
            required: true,
            rules: [{ required: true, message: '请输入设备名称' }],
        },
        {
            key: 'deviceCode',
            label: '设备编号',
            placeholder: '如 EQ-2024-001',
            prefixIcon: 'i-ph:barcode-bold',
            required: true,
            rules: [{ required: true, message: '请输入设备编号' }],
        },
        {
            key: 'faultType',
            label: '故障类型',
            type: 'select',
            required: true,
            options: [
                { text: '机械故障', value: 'mechanical' },
                { text: '电气故障', value: 'electrical' },
                { text: '液压故障', value: 'hydraulic' },
                { text: '仪表异常', value: 'instrument' },
                { text: '其他', value: 'other' },
            ],
        },
        {
            key: 'urgency',
            label: '紧急程度',
            type: 'radio',
            required: true,
            options: [
                { text: '一般', value: 'normal' },
                { text: '紧急', value: 'urgent' },
                { text: '特急', value: 'critical' },
            ],
        },
        {
            key: 'faultParts',
            label: '故障部位',
            type: 'checkbox',
            options: [
                { text: '主体', value: 'body' },
                { text: '传动系统', value: 'drive' },
                { text: '控制系统', value: 'control' },
                { text: '润滑系统', value: 'lube' },
            ],
        },
        {
            key: 'location',
            label: '所在车间',
            placeholder: '请输入车间位置',
            prefixIcon: 'i-ph:map-pin-bold',
        },
        {
            key: 'reporter',
            label: '报修人',
            placeholder: '请输入姓名',
            prefixIcon: 'i-ph:user-bold',
            required: true,
            rules: [{ required: true, message: '请输入报修人' }],
        },
        {
            key: 'phone',
            label: '联系电话',
            type: 'digit',
            placeholder: '请输入手机号',
            prefixIcon: 'i-ph:phone-bold',
            maxlength: 11,
            required: true,
            rules: [
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ],
        },
        {
            key: 'faultDesc',
            label: '故障描述',
            type: 'textarea',
            placeholder: '请描述故障现象、发生时间等',
            maxlength: 300,
            showWordLimit: true,
            rows: 3,
        },
        {
            key: 'notifyManager',
            label: '通知主管',
            type: 'switch',
        },
    ];

    const handleSubmit = async (values: Record<string, any>) => {
        submitting.value = true;
        await new Promise((r) => setTimeout(r, 1200));
        submitting.value = false;
        console.log('报修提交：', values);
    };
</script>

<template>
    <div class="c-form-demo">
        <C_NavBar title="表单组件" />

        <div class="c-form-demo__body">
            <!-- Section header -->
            <div class="c-form-demo__section-head">
                <h2 class="c-form-demo__title">设备报修</h2>
                <p class="c-form-demo__desc">配置驱动 · 内置验证 · 多类型字段</p>
            </div>

            <!-- Form card -->
            <div class="c-form-demo__card">
                <C_Form
                    ref="formRef"
                    v-model:values="formValues"
                    :fields="fields"
                    :loading="submitting"
                    submit-text="提交报修"
                    reset-text="重置"
                    label-width="5em"
                    @submit="handleSubmit"
                />
            </div>

            <!-- Live data preview -->
            <div class="c-form-demo__section-head">
                <h2 class="c-form-demo__title c-form-demo__title--sm">实时数据</h2>
            </div>
            <div class="c-form-demo__preview">
                <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-form-demo {
    min-height: 100dvh;
    background: var(--ds-bg);

    &__body {
        padding: 16px 16px 40px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    // ── Section header ──
    &__section-head {
        padding: 4px 4px 0;
    }

    &__title {
        font-size: 20px;
        font-weight: 700;
        color: var(--ds-text-primary);
        line-height: 1.3;
        margin: 0;

        &--sm {
            font-size: 15px;
            font-weight: 600;
        }
    }

    &__desc {
        font-size: 13px;
        color: var(--ds-text-tertiary);
        margin: 4px 0 0;
        line-height: 1.4;
    }

    // ── Card ──
    &__card {
        background: var(--ds-bg-secondary);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
    }

    // ── Preview ──
    &__preview {
        background: var(--ds-bg-secondary);
        border-radius: var(--ds-radius-md);
        padding: 14px 16px;
        overflow-x: auto;

        pre {
            font-size: 11px;
            color: var(--ds-text-secondary);
            white-space: pre-wrap;
            word-break: break-all;
            font-family: 'SF Mono', 'Menlo', monospace;
            line-height: 1.6;
            margin: 0;
        }
    }
}
</style>
