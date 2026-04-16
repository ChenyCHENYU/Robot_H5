<template>
    <VanForm v-if="getShow" ref="formRef" class="register-form" @submit="handleRegister">
        <!-- 通用字段：由 data.ts 的 registerFields 驱动，新增/删除字段只改数据 -->
        <VanField
            v-for="field in registerFields"
            :key="field.key"
            v-model="(formData as Record<string, any>)[field.key]"
            class="register-form__field"
            :name="field.key"
            :placeholder="field.placeholder"
            :rules="getFormRules[field.key]"
            :type="field.isPassword ? (passTypeMap[field.key] ? 'password' : 'text') : 'text'"
            :center="field.center"
            :clearable="field.clearable"
            @click-right-icon="field.isPassword && togglePass(field.key)"
        >
            <template #left-icon>
                <i :class="[field.icon, 'register-form__icon']" />
            </template>
            <template v-if="field.isPassword" #right-icon>
                <i :class="[passTypeMap[field.key] ? 'i-mdi:eye-outline' : 'i-mdi:eye-off', 'register-form__icon']" />
            </template>
            <template v-if="field.hasButton" #button>
                <VanButton size="small" type="primary" style="border-radius: var(--ds-radius-sm)">
                    {{ field.buttonText }}
                </VanButton>
            </template>
        </VanField>

        <!-- policy 复选框结构特殊，单独渲染 -->
        <VanField name="policy" class="register-form__field" :rules="getFormRules.policy">
            <template #input>
                <VanCheckbox v-model="formData.policy" icon-size="14px" shape="square">
                    我已阅读并同意用户协议与隐私政策
                </VanCheckbox>
            </template>
        </VanField>

        <VanButton
            class="register-form__btn register-form__btn--primary"
            type="primary"
            block
            native-type="submit"
            :loading="loading"
        >
            注册
        </VanButton>

        <VanButton class="register-form__btn register-form__btn--secondary" block @click="handleBackLogin">
            返回登录
        </VanButton>
    </VanForm>
</template>

<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { LoginStateEnum, useFormRules, useLoginState } from '../../useLogin';
    import { registerFields } from '../../data';

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

    // 每个密码字段独立维护显隐状态：true = 隐藏（password），false = 明文
    const passTypeMap = reactive<Record<string, boolean>>({
        password: true,
        confirmPassword: true,
    });

    function togglePass(key: string) {
        passTypeMap[key] = !passTypeMap[key];
    }

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
