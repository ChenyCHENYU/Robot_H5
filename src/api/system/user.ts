import { get, post } from '@/utils/http';

export interface BasicResponseModel<T = any> {
    code: number;
    message: string;
    data: T;
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface UserInfo {
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
}

/** 用户登录 */
export const login = (data: LoginParams) =>
    post<BasicResponseModel>('/login', data, { successMessageText: '登录成功，即将进入系统' });

/** 获取用户信息 */
export const getUserInfo = () =>
    get<UserInfo>('/getUserInfo');

/** 用户登出 */
export const doLogout = () =>
    post('/logout');
