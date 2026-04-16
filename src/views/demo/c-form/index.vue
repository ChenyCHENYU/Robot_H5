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
            rules: [
                { min: 2, max: 16, message: '用户名 2-16 个字符' },
            ],
        },
        {
            key: 'phone',
            label: '手机号',
            type: 'digit',
            placeholder: '请输入手机号',
            prefixIcon: 'i-ph:phone-bold',
            maxlength: 11,
            required: true,
            rules: [
                { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ],
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
            prefixIcon: 'i-ph:gender-intersex-bold',
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
            prefixIcon: 'i-ph:shield-star-bold',
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
            prefixIcon: 'i-ph:star-bold',
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
            prefixIcon: 'i-ph:pencil-line-bold',
            maxlength: 200,
            showWordLimit: true,
            rows: 3,
        },
        {
            key: 'notify',
            label: '消息通知',
            type: 'switch',
            prefixIcon: 'i-ph:bell-bold',
        },
    ];

    const handleSubmit = async (values: Record<string, any>) => {
        submitting.value = true;
        // 模拟提交
        await new Promise((r) => setTimeout(r, 1200));
        submitting.value = false;
        console.log('表单提交：', values);
    };
</script>

<template>
    <div class="c-form-demo">
        <C_NavBar title="C_Form 演示" />
        <div class="c-form-demo__body">
            <div class="c-form-demo__card">
                <div class="c-form-demo__card-shine" />
                <div class="c-form-demo__card-title">用户注册</div>
                <C_Form
                    ref="formRef"
                    v-model:values="formValues"
                    :fields="fields"
                    :loading="submitting"
                    submit-text="注 册"
                    reset-text="重 置"
                    label-width="5em"
                    @submit="handleSubmit"
                />
            </div>

            <!-- 实时数据预览 -->
            <div class="c-form-demo__preview">
                <div class="c-form-demo__preview-title">实时数据</div>
                <pre class="c-form-demo__preview-code">{{ JSON.stringify(formValues, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.c-form-demo {
    min-height: 100dvh;
    background: var(--ds-bg);

    &__body {
        padding: 12px 12px 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__card {
        position: relative;
        overflow: hidden;
        background: var(--ds-card-bg);
        border-radius: var(--ds-radius-lg);
        border: 0.5px solid var(--ds-glass-border);
        box-shadow: var(--ds-shadow-md);

        &-shine {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
            pointer-events: none;
        }

        &-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--ds-text-primary);
            padding: 14px 16px 0;
        }
    }

    &__preview {
        background: var(--ds-card-bg);
        border-radius: var(--ds-radius-lg);
        border: 0.5px solid var(--ds-glass-border);
        padding: 12px 14px;
        overflow: hidden;

        &-title {
            font-size: 12px;
            color: var(--ds-text-tertiary);
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        &-code {
            font-size: 11px;
            color: var(--ds-accent);
            white-space: pre-wrap;
            word-break: break-all;
            font-family: 'Menlo', 'Monaco', monospace;
            line-height: 1.6;
            margin: 0;
        }
    }
}
</style>
