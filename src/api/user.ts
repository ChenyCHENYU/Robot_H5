import { pcGet, pcPost } from '@/utils/http/pcHttp';
import { toast } from '@/utils/http';

/** 用户登录（走 PC 端网关） */
export const login = (data: { username: string; password: string }) =>
    pcPost('/login', data, toast('登录成功，即将进入系统'));

/** 获取用户信息（走 PC 端网关） */
export const getUserInfo = () => pcGet('/getUserInfo');

/** 用户登出（走 PC 端网关） */
export const doLogout = () => pcPost('/logout');
