<template>
    <div class="login-page">
        <!-- Animated background orbs -->
        <div v-for="n in 5" :key="n" class="login-page__orb" :class="`login-page__orb--${n}`" />

        <div class="login-page__inner">
            <!-- 标题区 -->
            <div class="login-page__title">
                <h1 class="login-page__title-text">华新计量</h1>
                <p class="login-page__title-sub">企业计量移动平台</p>
                <span
                    v-if="envName"
                    :class="['login-page__title-badge', { 'login-page__title-badge--dev': isDevEnv }]"
                >
                    {{ envName }}
                </span>
            </div>

            <!-- 表单卡片 -->
            <div class="login-page__card">
                <p class="login-page__hint">请使用企业账号登录</p>

                <VanForm class="login-page__form" @submit="onSubmit">
                    <VanCellGroup class="login-page__fields" inset>
                        <VanField
                            v-model="form.username"
                            name="username"
                            label="账号"
                            placeholder="请输入用户名"
                            clearable
                            :rules="[{ required: true, message: '请填写用户名' }]"
                        />
                        <VanField
                            v-model="form.password"
                            type="password"
                            name="password"
                            label="密码"
                            placeholder="请输入密码"
                            clearable
                            :rules="[{ required: true, message: '请填写密码' }]"
                        />
                        <VanField
                            v-model="form.verificationCode"
                            name="verificationCode"
                            label="验证码"
                            placeholder="请输入图形验证码"
                            clearable
                            :rules="[{ required: true, message: '请输入验证码' }]"
                        >
                            <template #button>
                                <button
                                    type="button"
                                    class="login-page__captcha"
                                    aria-label="点击刷新验证码"
                                    @click="getCaptcha"
                                >
                                    <img
                                        v-if="form.captchaImage"
                                        class="login-page__captcha-img"
                                        :src="form.captchaImage"
                                        alt="验证码"
                                        width="96"
                                        height="40"
                                    />
                                    <span v-else class="login-page__captcha-placeholder">加载中</span>
                                </button>
                            </template>
                        </VanField>
                    </VanCellGroup>

                    <div class="login-page__actions">
                        <VanButton block type="primary" native-type="submit" class="login-page__submit">
                            登录
                        </VanButton>
                    </div>
                </VanForm>
            </div>

            <p class="login-page__footer">请妥善保管账号信息，勿向他人泄露</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { createLoginForm, getEnvName } from './data';
    import { getCaptcha as fetchCaptcha } from '@/api/auth';
    import { useUserStore } from '@/store/modules/user';
    import { useRouter } from 'vue-router';
    import { showToast } from 'vant';

    defineOptions({ name: 'LoginPage' });

    const userStore = useUserStore();
    const router = useRouter();

    const form = reactive(createLoginForm());
    const envName = getEnvName();
    const isDevEnv = computed(() => envName === '开发环境');

    /** 加载图形验证码（点击可刷新） */
    const getCaptcha = async () => {
        try {
            const res: any = await fetchCaptcha();
            const body = res?.data ?? res ?? {};
            form.captchaImage = body.image || '';
            form.captchaId = body.captchaId || '';
            form.verificationCode = body.verificationCode || '';
        } catch (e) {
            console.error('验证码加载失败', e);
        }
    };

    /** 提交登录 */
    const onSubmit = async () => {
        if (!form.username) {
            showToast('请输入用户名');
            return;
        }
        try {
            await userStore.Login({
                username: form.username,
                password: form.password,
                companyId: '1',
                captchaId: form.captchaId,
                verifyCode: form.verificationCode,
            });
            router.push('/home');
        } catch (error) {
            console.error('登录失败:', error);
            // 失败原因已由 http 层 toast（如"验证码已失效或验证码错误"），失败后刷新验证码
            getCaptcha();
        }
    };

    onMounted(() => {
        getCaptcha();
    });
</script>
