import { get, post, toast } from '@/utils/http';

/** 用户登录 */
export const login = (data: { username: string; password: string }) =>
    post('/login', data, toast('登录成功，即将进入系统'));

/** 获取用户信息 */
export const getUserInfo = () => get('/getUserInfo');

/** 用户登出 */
export const doLogout = () => post('/logout');
