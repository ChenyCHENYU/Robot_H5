export interface FieldConfig {
    /** formData 中对应的 key */
    key: string
    placeholder: string
    /** UnoCSS 图标类名，如 i-ph:user-bold */
    icon: string
    /** 是否为密码字段（带眼睛切换） */
    isPassword?: boolean
    /** 是否有右侧操作按钮（如发送验证码） */
    hasButton?: boolean
    buttonText?: string
    center?: boolean
    clearable?: boolean
}

/** 注册表单字段（不含 policy 复选框，policy 单独渲染） */
export const registerFields: FieldConfig[] = [
    { key: 'username', placeholder: '用户名', icon: 'i-ph:user-bold' },
    { key: 'mobile', placeholder: '手机号码', icon: 'i-ph:device-mobile-bold' },
    {
        key: 'sms',
        placeholder: '请输入短信验证码',
        icon: 'i-ph:chat-text-bold',
        center: true,
        clearable: true,
        hasButton: true,
        buttonText: '发送验证码',
    },
    { key: 'password', placeholder: '密码', icon: 'i-iconamoon:lock-bold', isPassword: true },
    { key: 'confirmPassword', placeholder: '确认密码', icon: 'i-iconamoon:lock-bold', isPassword: true },
]

/** 找回密码表单字段 */
export const forgetPasswordFields: FieldConfig[] = [
    { key: 'username', placeholder: '用户名', icon: 'i-ph:user-bold' },
    { key: 'mobile', placeholder: '手机号码', icon: 'i-ph:device-mobile-bold' },
    {
        key: 'sms',
        placeholder: '请输入短信验证码',
        icon: 'i-ph:chat-text-bold',
        center: true,
        clearable: true,
        hasButton: true,
        buttonText: '发送验证码',
    },
]
