import { get, post, put } from '@/utils/http';
import type { UserInfo, LoginParams, RegisterParams, UserProfile } from '#/User/type';

export const login = (data: LoginParams) => post<{ token: string }>('/login', data, { withToken: false });
export const getUserInfo = () => get<UserInfo>('/getUserInfo');
export const doLogout = () => post<void>('/logout');
export const addUser = (data: RegisterParams) => post<void>('/register', data, { withToken: false });
export const sendUserSms = (mobile: string, purpose: 'register' | 'reset') => post<{ demoCode?: string }>('/user/sms', { mobile, purpose }, { withToken: false });
export const resetUserPassword = (data: { username: string; mobile: string; sms: string; password: string }) => post<void>('/user/reset-password', data, { withToken: false });
export const updateUserProfile = (data: UserProfile) => put<UserInfo>('/user/profile', data);
export const updateUserPassword = (data: { oldPassword: string; newPassword: string }) => put<void>('/user/password', data);
