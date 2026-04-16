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
</template>

<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';
    import { useUserStore } from '@/store/modules/user';
    import { PageEnum } from '@/enums/pageEnum';

    const { setLoginState, getLoginState } = useLoginState();
    const { getFormRules } = useFormRules();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    const formRef = ref<FormInstance>();
    const loading = ref(false);
    const rememberMe = ref(false);
    const switchPassType = ref(true);
    const formData = reactive({
        username: 'admin',
        password: '123456',
    });

    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

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
                    const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
                    if (route.name === PageEnum.BASE_LOGIN_NAME) {
                        router.replace('/');
                    } else {
                        router.replace(toPath);
                    }
                } finally {
                    loading.value = false;
                }
            })
            .catch(() => {
                console.error('验证失败');
            });
    }
</script>
