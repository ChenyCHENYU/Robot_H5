<template>
    <van-form v-if="getShow" ref="formRef" class="register-form" @submit="handleRegister">
        <van-field
            v-model="formData.username"
            class="register-form__field"
            name="username"
            placeholder="用户名"
            :rules="getFormRules.username"
        >
            <template #left-icon>
                <i class="i-ph:user-bold register-form__icon" />
            </template>
        </van-field>

        <van-field
            v-model="formData.mobile"
            class="register-form__field"
            name="mobile"
            placeholder="手机号码"
            :rules="getFormRules.mobile"
        >
            <template #left-icon>
                <i class="i-ph:device-mobile-bold register-form__icon" />
            </template>
        </van-field>

        <van-field
            v-model="formData.sms"
            class="register-form__field"
            center
            clearable
            placeholder="请输入短信验证码"
            :rules="getFormRules.sms"
        >
            <template #left-icon>
                <i class="i-ph:chat-text-bold register-form__icon" />
            </template>
            <template #button>
                <van-button size="small" type="primary" style="border-radius: var(--ds-radius-sm)">
                    发送验证码
                </van-button>
            </template>
        </van-field>

        <van-field
            v-model="formData.password"
            class="register-form__field"
            :type="switchPassType ? 'password' : 'text'"
            name="password"
            placeholder="密码"
            :rules="getFormRules.password"
            @click-right-icon="switchPassType = !switchPassType"
        >
            <template #left-icon>
                <i class="i-iconamoon:lock-bold register-form__icon" />
            </template>
            <template #right-icon>
                <i v-if="switchPassType" class="i-mdi:eye-outline register-form__icon" />
                <i v-else class="i-mdi:eye-off register-form__icon" />
            </template>
        </van-field>

        <van-field
            v-model="formData.confirmPassword"
            class="register-form__field"
            :type="switchConfirmPassType ? 'password' : 'text'"
            name="confirmPassword"
            placeholder="确认密码"
            :rules="getFormRules.confirmPassword"
            @click-right-icon="switchConfirmPassType = !switchConfirmPassType"
        >
            <template #left-icon>
                <i class="i-iconamoon:lock-bold register-form__icon" />
            </template>
            <template #right-icon>
                <i v-if="switchConfirmPassType" class="i-mdi:eye-outline register-form__icon" />
                <i v-else class="i-mdi:eye-off register-form__icon" />
            </template>
        </van-field>

        <van-field name="policy" class="register-form__field" :rules="getFormRules.policy">
            <template #input>
                <van-checkbox v-model="formData.policy" icon-size="14px" shape="square">
                    我已阅读并同意用户协议与隐私政策
                </van-checkbox>
            </template>
        </van-field>

        <van-button
            class="register-form__btn register-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
        >
            注册
        </van-button>

        <van-button class="register-form__btn register-form__btn--secondary" block @click="handleBackLogin">
            返回登录
        </van-button>
    </van-form>
</template>

<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';

    const { handleBackLogin, getLoginState } = useLoginState();
    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

    const loading = ref(false);
    const formRef = ref<FormInstance>();

    const formData = reactive({
        username: '',
        mobile: '',
        sms: '',
        password: '',
        confirmPassword: '',
        policy: false,
    });

    const { getFormRules } = useFormRules(formData);

    const switchPassType = ref(true);
    const switchConfirmPassType = ref(true);

    function handleRegister() {
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
