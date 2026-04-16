<script setup lang="ts">
    import type { CFormInstance, FormField } from '@/components/C_Form/index.vue';

    defineOptions({ name: 'CFormDemo' });

    const formRef = ref<CFormInstance>();
    const submitting = ref(false);

    const formValues = ref<Record<string, any>>({
        username: '',
        phone: '',
        password: '',
        gender: '',
        role: '',
        bio: '',
        notify: true,
        interests: [],
    });

    const fields: FormField[] = [
        {
            key: 'username',
            label: '用户名',
            placeholder: '请输入用户名',
            prefixIcon: 'i-ph:user-bold',
            required: true,
            rules: [{ min: 2, max: 16, message: '用户名 2-16 个字符' }],
        },
        {
            key: 'phone',
            label: '手机号',
            type: 'digit',
            placeholder: '请输入手机号',
            prefixIcon: 'i-ph:phone-bold',
            maxlength: 11,
            required: true,
            rules: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
        },
        {
            key: 'password',
            label: '密码',
            type: 'password',
            placeholder: '字母 + 数字，至少 6 位',
            prefixIcon: 'i-ph:lock-bold',
            required: true,
            rules: [
                {
                    validator: (val) => {
                        if (!val || val.length < 6) return '密码至少 6 位';
                        if (!/[A-Za-z]/.test(val) || !/\d/.test(val)) return '需包含字母和数字';
                        return true;
                    },
                },
            ],
        },
        {
            key: 'gender',
            label: '性别',
            type: 'radio',
            options: [
                { text: '男', value: 'male' },
                { text: '女', value: 'female' },
                { text: '保密', value: 'secret' },
            ],
        },
        {
            key: 'role',
            label: '角色',
            type: 'select',
            required: true,
            options: [
                { text: '普通用户', value: 'user' },
                { text: '管理员', value: 'admin' },
                { text: '超级管理员', value: 'super' },
            ],
        },
        {
            key: 'interests',
            label: '兴趣',
            type: 'checkbox',
            options: [
                { text: '前端', value: 'fe' },
                { text: '后端', value: 'be' },
                { text: 'AI', value: 'ai' },
                { text: '移动端', value: 'mobile' },
            ],
        },
        {
            key: 'bio',
            label: '简介',
            type: 'textarea',
            placeholder: '写点什么...',
            maxlength: 200,
            showWordLimit: true,
            rows: 3,
        },
        {
            key: 'notify',
            label: '消息通知',
            type: 'switch',
        },
    ];

    const handleSubmit = async (values: Record<string, any>) => {
        submitting.value = true;
        await new Promise((r) => setTimeout(r, 1200));
        submitting.value = false;
        console.log('表单提交：', values);
    };
</script>

<template>
    <div class="c-form-demo">
        <C_NavBar title="表单组件" />

        <div class="c-form-demo__body">
            <!-- Section header -->
            <div class="c-form-demo__section-head">
                <h2 class="c-form-demo__title">用户注册</h2>
                <p class="c-form-demo__desc">配置驱动，支持 8 种字段类型与内置验证</p>
            </div>

            <!-- Form card -->
            <div class="c-form-demo__card">
                <C_Form
                    ref="formRef"
                    v-model:values="formValues"
                    :fields="fields"
                    :loading="submitting"
                    submit-text="注册"
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
