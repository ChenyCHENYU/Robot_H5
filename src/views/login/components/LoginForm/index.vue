<template>
    <VanForm v-if="getShow" ref="formRef" class="login-form" @submit="handleSubmit">
        <VanField
            v-model="formData.username"
            class="login-form__field"
            name="username"
            placeholder="用户名"
            autocomplete="username"
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
            autocomplete="current-password"
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
            autocomplete="off"
            :rules="[{ required: true, message: '请输入验证码' }]"
        >
            <template #left-icon>
                <i class="i-ph:shield-check-bold login-form__icon" />
            </template>
            <template #button>
                <button
                    type="button"
                    class="login-form__captcha"
                    :disabled="captchaRefreshing"
                    :aria-busy="captchaRefreshing"
                    aria-label="刷新验证码"
                    @click="refreshCaptcha"
                >
                    <img
                        v-if="captchaImage"
                        :src="captchaImage"
                        class="login-form__captcha-img"
                        alt="验证码"
                        @error="handleCaptchaError"
                    />
                    <span v-else class="login-form__captcha-status" aria-live="polite">
                        {{ captchaError ? '点击重试' : '加载中…' }}
                    </span>
                </button>
            </template>
        </VanField>

        <div class="login-form__options">
            <div class="login-form__remember">
                <VanSwitch v-model="rememberMe" size="16px" aria-label="记住账号" />
                <span>记住账号</span>
            </div>
            <button type="button" class="login-form__link" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
                忘记密码？
            </button>
        </div>

        <VanButton
            class="login-form__btn login-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
            :disabled="captchaRefreshing || captchaError || !captchaId"
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
    import { getCaptcha } from '@/api/captcha';
    import LoginSuccess from '../LoginSuccess/index.vue';

    defineOptions({ name: 'LoginForm' });

    const { setLoginState, getLoginState } = useLoginState();
    const { getFormRules } = useFormRules();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    const formRef = ref<FormInstance>();
    const loading = ref(false);
    const rememberedAccount = localStorage.getItem('ROBOT-REMEMBERED-ACCOUNT') || '';
    const rememberMe = ref(!!rememberedAccount);
    const demoMode = String(import.meta.env.VITE_USE_MOCK) === 'true';
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    onUnmounted(() => clearTimeout(redirectTimer));
    const switchPassType = ref(true);
    const showSuccess = ref(false);
    const nickname = ref('');
    const captchaImage = ref('');
    const captchaId = ref('');
    const captchaRefreshing = ref(false);
    const captchaError = ref(false);
    const formData = reactive({
        username: rememberedAccount || (demoMode ? 'CHENY' : ''),
        password: demoMode ? '123456' : '',
        captchaCode: '',
    });

    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

    /** 获取验证码 */
    async function refreshCaptcha() {
        if (captchaRefreshing.value) return;
        captchaRefreshing.value = true;
        captchaError.value = false;
        captchaImage.value = '';
        captchaId.value = '';
        formData.captchaCode = '';
        try {
            const data = await getCaptcha();
            if (!data.captchaId || !data.image) throw new Error('验证码响应不完整');
            captchaId.value = data.captchaId;
            const img = data.image;
            captchaImage.value = img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
        } catch {
            handleCaptchaError();
        } finally {
            captchaRefreshing.value = false;
        }
    }

    function handleCaptchaError() {
        captchaError.value = true;
        captchaImage.value = '';
        captchaId.value = '';
    }

    // 初始化加载验证码
    onMounted(() => {
        refreshCaptcha();
    });

    function handleSubmit() {
        if (captchaRefreshing.value || captchaError.value || !captchaId.value || loading.value) return;
        formRef.value
            ?.validate()
            .then(async () => {
                try {
                    loading.value = true;
                    await userStore.Login({
                        username: formData.username,
                        password: formData.password,
                        captchaId: captchaId.value,
                        captchaCode: formData.captchaCode,
                    });

                    if (rememberMe.value) localStorage.setItem('ROBOT-REMEMBERED-ACCOUNT', formData.username);
                    else localStorage.removeItem('ROBOT-REMEMBERED-ACCOUNT');

                    // 显示登录成功过渡动画
                    nickname.value = userStore.getUserInfo?.nickname || formData.username;
                    showSuccess.value = true;

                    // 延迟跳转，让动画完整展示
                    redirectTimer = setTimeout(() => {
                        const redirect = String(route.query.redirect || '/');
                        const toPath = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
                        void router.replace(toPath);
                    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350);
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
