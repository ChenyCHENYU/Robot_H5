/** 登录表单模型 */
export interface LoginFormModel {
    username: string;
    password: string;
    captchaImage: string;
    captchaId: string;
    verificationCode: string;
}

/** 创建初始表单 */
export function createLoginForm(): LoginFormModel {
    return {
        password: '',
        username: '',
        captchaImage: '',
        captchaId: '',
        verificationCode: '',
    };
}

/** 环境名称（生产环境不显示徽标） */
export function getEnvName(): string {
    return import.meta.env.VITE_MODE === 'prod' ? '' : '开发环境';
}
