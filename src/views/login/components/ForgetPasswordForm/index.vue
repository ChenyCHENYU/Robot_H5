<template>
    <VanForm v-if="getShow" ref="formRef" class="forget-form" @submit="handleReset">
        <!-- 通用字段：由 data.ts 的 forgetPasswordFields 驱动 -->
        <VanField
            v-for="field in forgetPasswordFields"
            :key="field.key"
            v-model="formData[field.key]"
            class="forget-form__field"
            :name="field.key"
            :placeholder="field.placeholder"
            :rules="getFormRules[field.key]"
            :type="field.isPassword ? 'password' : 'text'"
            :center="field.center"
            :clearable="field.clearable"
        >
            <template #left-icon>
                <i :class="[field.icon, 'forget-form__icon']" />
            </template>
            <template v-if="field.hasButton" #button>
                <VanButton size="small" type="primary" :loading="smsSending" :disabled="!!smsRemaining" @click="sendSms" style="border-radius: var(--ds-radius-sm)">
                    {{ smsLabel }}
                </VanButton>
            </template>
        </VanField>

        <VanButton
            class="forget-form__btn forget-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
        >
            重置密码
        </VanButton>

        <VanButton class="forget-form__btn forget-form__btn--secondary" block @click="handleBackLogin">
            返回登录
        </VanButton>
    </VanForm>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showSuccessToast, type FormInstance } from 'vant';
    import { resetUserPassword } from '@/api/user';
    import { useSms } from '@/hooks/useSms';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';
    import { forgetPasswordFields } from '../../data';

    defineOptions({ name: 'ForgetPasswordForm' });

    const { handleBackLogin, getLoginState } = useLoginState();
    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

    const loading = ref(false);
    const formRef = ref<FormInstance>();
    const formData = reactive({
        username: '',
        mobile: '',
        sms: '',
        password: '',
        confirmPassword: '',
    });

    const { getFormRules } = useFormRules(formData);
    const { remaining: smsRemaining, sending: smsSending, label: smsLabel, send: sendSms } = useSms(() => formData.mobile, 'reset');
    async function handleReset() {
        if (loading.value) return;
        try {
            await formRef.value?.validate();
            loading.value = true;
            await resetUserPassword(formData);
            showSuccessToast('密码已重置，请重新登录');
            handleBackLogin();
        } catch { /* 失败保留输入 */ }
        finally { loading.value = false; }
    }
</script>
