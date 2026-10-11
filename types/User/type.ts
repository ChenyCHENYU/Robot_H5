export interface UserInfo {
    userId: string | number;
    username: string;
    nickname: string;
    avatar: string;
    cover: string;
    gender: number;
    phone: string;
    sign?: string;
    industry?: number;
}
export interface LoginParams { username: string; password: string; captchaId: string; captchaCode: string }
export interface RegisterParams { username: string; mobile: string; sms: string; password: string; policy: boolean }
export type UserProfile = Partial<Pick<UserInfo, 'nickname' | 'avatar' | 'cover' | 'gender' | 'sign' | 'industry'>>;
