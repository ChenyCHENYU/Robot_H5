export const appVersion = __APP_INFO__.pkg.version;
export const currentYear = new Date().getFullYear();

/** 顺序与 LoginStateEnum 一致。 */
export const loginHeadings = [
    { title: '欢迎回来', subtitle: '登录你的 Robot 账户，开始新的工作' },
    { title: '创建账号', subtitle: '填写账号信息，开启移动工作空间' },
    { title: '找回密码', subtitle: '验证账号信息，重新设置你的密码' },
];

export interface FieldConfig {
    /** formData 中对应的 key */
    key: 'username' | 'mobile' | 'sms' | 'password' | 'confirmPassword'
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
    { key: 'password', placeholder: '密码', icon: 'i-ph:lock-bold', isPassword: true },
    { key: 'confirmPassword', placeholder: '确认密码', icon: 'i-ph:lock-bold', isPassword: true },
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
    { key: 'password', placeholder: '新密码（至少6位）', icon: 'i-ph:lock-bold', isPassword: true },
    { key: 'confirmPassword', placeholder: '确认新密码', icon: 'i-ph:lock-bold', isPassword: true },
]
