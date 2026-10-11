import type { FieldRule } from 'vant';

export enum LoginStateEnum {
    LOGIN,
    REGISTER,
    RESET_PASSWORD,
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
    function setLoginState(state: LoginStateEnum) {
        currentState.value = state;
    }

    const getLoginState = computed(() => currentState.value);

    function handleBackLogin() {
        setLoginState(LoginStateEnum.LOGIN);
    }

    return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormRules(formData?: Record<string, unknown>) {
    const getUsernameFormRule = computed(() => createRule('请输入用户名'));
    const getPasswordFormRule = computed(() => createRule('请输入密码'));
    const getSmsFormRule = computed(() => createRule('请输入短信验证码'));
    const getMobileFormRule = computed(() => createRule('请输入手机号码'));

    const validatePolicy = async () => {
        return !formData?.policy ? Promise.resolve('勾选后才能注册') : Promise.resolve(true);
    };

    const validateConfirmPassword = (password: string) => {
        return async (value: string) => {
            if (!value) {
                return Promise.resolve('请输入确认密码');
            }
            if (value !== password) {
                return Promise.resolve('两次输入密码不一致');
            }
            return Promise.resolve(true);
        };
    };

    const getFormRules = computed((): { [k: string]: FieldRule[] } => {
        const usernameFormRule = unref(getUsernameFormRule);
        const passwordFormRule = unref(getPasswordFormRule);
        const smsFormRule = unref(getSmsFormRule);
        const mobileFormRule = unref(getMobileFormRule);

        const mobileRule = {
            sms: smsFormRule,
            mobile: mobileFormRule,
        };
        switch (unref(currentState)) {
            // register form rules
            case LoginStateEnum.REGISTER:
                return {
                    username: usernameFormRule,
                    password: [...passwordFormRule, { validator: (value: string) => value.length >= 6 || '密码至少 6 位' }],
                    confirmPassword: [
                        {
                            validator: validateConfirmPassword(String(formData?.password || '')),
                            trigger: 'onChange',
                        },
                    ],
                    policy: [{ validator: validatePolicy, trigger: 'onBlur' }],
                    ...mobileRule,
                };

            // reset password form rules
            case LoginStateEnum.RESET_PASSWORD:
                return {
                    username: usernameFormRule,
                    password: [...passwordFormRule, { validator: (value: string) => value.length >= 6 || '密码至少 6 位' }],
                    confirmPassword: [{ validator: validateConfirmPassword(String(formData?.password || '')) }],
                    ...mobileRule,
                };

            // login form rules
            default:
                return {
                    username: usernameFormRule,
                    password: passwordFormRule,
                };
        }
    });
    return { getFormRules };
}

function createRule(message: string): FieldRule[] {
    return [
        {
            required: true,
            message,
            trigger: 'onBlur',
        },
    ];
}
