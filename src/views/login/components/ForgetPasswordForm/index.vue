<template>
    <van-form v-if="getShow" ref="formRef" class="forget-form" @submit="handleReset">
        <!-- 通用字段：由 data.ts 的 forgetPasswordFields 驱动 -->
        <van-field
            v-for="field in forgetPasswordFields"
            :key="field.key"
            v-model="(formData as Record<string, string>)[field.key]"
            class="forget-form__field"
            :name="field.key"
            :placeholder="field.placeholder"
            :rules="getFormRules[field.key]"
            :center="field.center"
            :clearable="field.clearable"
        >
            <template #left-icon>
                <i :class="[field.icon, 'forget-form__icon']" />
            </template>
            <template v-if="field.hasButton" #button>
                <van-button size="small" type="primary" style="border-radius: var(--ds-radius-sm)">
                    {{ field.buttonText }}
                </van-button>
            </template>
        </van-field>

        <van-button
            class="forget-form__btn forget-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
        >
            重置密码
        </van-button>

        <van-button class="forget-form__btn forget-form__btn--secondary" block @click="handleBackLogin">
            返回登录
        </van-button>
    </van-form>
</template>

<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';
    import { forgetPasswordFields } from '../../data';

    const { handleBackLogin, getLoginState } = useLoginState();
    const { getFormRules } = useFormRules();
    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

    const loading = ref(false);
    const formRef = ref<FormInstance>();
    const formData = reactive({
        username: '',
        mobile: '',
        sms: '',
    });

    function handleReset() {
        formRef.value
            ?.validate()
            .then(async () => {
                try {
                    loading.value = true;
                    // do something
                } finally {
                    loading.value = false;
                }
            })
            .catch(() => {
                console.error('验证失败');
            });
    }
</script>
