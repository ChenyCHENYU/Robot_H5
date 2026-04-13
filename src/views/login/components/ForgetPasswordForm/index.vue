<template>
    <van-form v-if="getShow" ref="formRef" class="forget-form" @submit="handleReset">
        <van-field
            v-model="formData.username"
            class="forget-form__field"
            name="username"
            placeholder="用户名"
            :rules="getFormRules.username"
        >
            <template #left-icon>
                <i class="i-ph:user-bold forget-form__icon" />
            </template>
        </van-field>

        <van-field
            v-model="formData.mobile"
            class="forget-form__field"
            name="mobile"
            placeholder="手机号码"
            :rules="getFormRules.mobile"
        >
            <template #left-icon>
                <i class="i-ph:device-mobile-bold forget-form__icon" />
            </template>
        </van-field>

        <van-field
            v-model="formData.sms"
            class="forget-form__field"
            center
            clearable
            placeholder="请输入短信验证码"
            :rules="getFormRules.sms"
        >
            <template #left-icon>
                <i class="i-ph:chat-text-bold forget-form__icon" />
            </template>
            <template #button>
                <van-button size="small" type="primary" style="border-radius: var(--ds-radius-sm)">
                    发送验证码
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
