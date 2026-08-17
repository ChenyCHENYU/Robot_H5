import { get } from '@/utils/http';

export interface CaptchaResult {
    captchaId: string;
    image: string;
}

/** 获取图形验证码 */
export const getCaptcha = () => get<CaptchaResult>('/captcha');
