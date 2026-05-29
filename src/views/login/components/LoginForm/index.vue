<template>
    <VanForm v-if="getShow" ref="formRef" class="login-form" @submit="handleSubmit">
        <VanField
            v-model="formData.username"
            class="login-form__field"
            name="username"
            placeholder="用户名"
            :rules="getFormRules.username"
        >
            <template #left-icon>
                <i class="i-ph:user-bold login-form__icon" />
            </template>
        </VanField>
        <VanField
            v-model="formData.password"
            class="login-form__field"
            :type="switchPassType ? 'password' : 'text'"
            name="password"
            placeholder="密码"
            :rules="getFormRules.password"
            @click-right-icon="switchPassType = !switchPassType"
        >
            <template #left-icon>
                <i class="i-ph:lock-bold login-form__icon" />
            </template>
            <template #right-icon>
                <i v-if="switchPassType" class="i-ph:eye-bold login-form__icon" />
                <i v-else class="i-ph:eye-slash-bold login-form__icon" />
            </template>
        </VanField>

        <!-- 验证码 -->
        <VanField
            v-model="formData.captchaCode"
            class="login-form__field"
            name="captchaCode"
            placeholder="验证码"
            maxlength="6"
            :rules="[{ required: true, message: '请输入验证码' }]"
        >
            <template #left-icon>
                <i class="i-ph:shield-check-bold login-form__icon" />
            </template>
            <template #button>
                <div class="login-form__captcha" @click="refreshCaptcha">
                    <img
                        v-if="captchaImage"
                        :src="captchaImage"
                        class="login-form__captcha-img"
                        alt="验证码"
                    />
                    <span v-else class="login-form__captcha-loading">加载中</span>
                </div>
            </template>
        </VanField>

        <div class="login-form__options">
            <div class="flex items-center gap-2">
                <VanSwitch v-model="rememberMe" size="16px" />
                <span class="text-xs" style="color: var(--ds-text-secondary); opacity: 0.8">记住我</span>
            </div>
            <a class="login-form__link" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">忘记密码?</a>
        </div>

        <VanButton
            class="login-form__btn login-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
        >
            登录
        </VanButton>
        <VanButton
            class="login-form__btn login-form__btn--secondary"
            block
            @click="setLoginState(LoginStateEnum.REGISTER)"
        >
            创建账号
        </VanButton>
    </VanForm>

    <!-- 登录成功过渡动画 -->
    <LoginSuccess :visible="showSuccess" :nickname="nickname" />
</template>

<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';
    import { useUserStore } from '@/store/modules/user';
    import { PageEnum } from '@/enums/pageEnum';
    import { getCaptcha } from '@/api/captcha';
    import LoginSuccess from '../LoginSuccess/index.vue';

    const { setLoginState, getLoginState } = useLoginState();
    const { getFormRules } = useFormRules();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    const formRef = ref<FormInstance>();
    const loading = ref(false);
    const rememberMe = ref(false);
    const switchPassType = ref(true);
    const showSuccess = ref(false);
    const nickname = ref('');
    const captchaImage = ref('');
    const captchaId = ref('');
    const formData = reactive({
        username: 'admin',
        password: '123456',
        captchaCode: '',
    });

    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

    /** 获取验证码 */
    async function refreshCaptcha() {
        try {
            const { data } = await getCaptcha();
            captchaId.value = data.captchaId;
            const img = data.image || '';
            captchaImage.value = img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
        } catch {
            console.warn('验证码加载失败');
        }
    }

    // 初始化加载验证码
    onMounted(() => {
        refreshCaptcha();
    });

    function handleSubmit() {
        formRef.value
            ?.validate()
            .then(async () => {
                try {
                    loading.value = true;
                    await userStore.Login({
                        username: formData.username,
                        password: formData.password,
                    });

                    // 显示登录成功过渡动画
                    nickname.value = userStore.getUserInfo?.nickname || formData.username;
                    showSuccess.value = true;

                    // 延迟跳转，让动画完整展示
                    setTimeout(() => {
                        const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
                        if (route.name === PageEnum.BASE_LOGIN_NAME) {
                            router.replace('/');
                        } else {
                            router.replace(toPath);
                        }
                    }, 1800);
                } catch {
                    // 登录失败刷新验证码
                    refreshCaptcha();
                    formData.captchaCode = '';
                } finally {
                    loading.value = false;
                }
            })
            .catch(() => {
                console.error('验证失败');
            });
    }
</script>
