/** 新密码强度正则：8-10 位，含数字、小写、大写字母（与老计量系统一致） */
export const PWD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;

/** 初始/默认密码（老系统约定，不可作为新密码使用） */
export const DEFAULT_PWD = 'Bxgt@258';

/** 修改密码页底部提示文案 */
export const PWD_HINTS: string[] = [
    '当前密码为初始密码或强度较弱，请修改登录密码。',
    '密码规则：长度 8-10 位，包括数字、大小写字母。',
    '请牢记修改后密码！',
];

/** 改密表单 */
export interface PwdForm {
    password: string;
    againPassword: string;
}
