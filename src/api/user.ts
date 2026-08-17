import { get, post } from '@/utils/http';

/** 用户登录 */
export const login = (data: { username: string; password: string }) =>
    post('/login', data);

/** 获取用户信息 */
export const getUserInfo = () => get('/getUserInfo');

/** 用户登出 */
export const doLogout = () => post('/logout');
