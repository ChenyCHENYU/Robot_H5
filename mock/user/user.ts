import type { MockMethod } from 'vite-plugin-mock';
import { getRequestToken, resultError, resultSuccess, type requestParams } from '../_util';
import { ResultEnum } from '@/utils/http/httpEnum';
import { demoRepository } from '../_demo';
import { validateCaptcha } from '../captcha';
import type { UserInfo, UserProfile } from '#/User/type';

const seed = [
    {
        userId: 1,
        username: 'CHENY',
        password: '123456',
        nickname: 'CHENY',
        avatar: '',
        cover: '',
        sign: '把复杂的事做简单，把简单的事做极致。',
        industry: 4,
        gender: 0,
        phone: '13800138000',
        token: 'fakeToken1',
    },
    {
        userId: 2,
        username: 'test',
        password: '123456',
        nickname: '哈哈你个大西瓜',
        avatar: '',
        cover: '',
        sign: '这个家伙很懒，什么都没有写~',
        industry: 7,
        gender: 1,
        phone: '13800138001',
        token: 'fakeToken2',
    },
];


const users = demoRepository('users', seed);
const smsCodes = demoRepository<Record<string, number>>('sms', {});
const publicUser = (user: typeof seed[number]): UserInfo => {
    const { password: _password, token: _token, ...info } = user;
    void _password; void _token;
    return info;
};
export function getDemoUser(request: requestParams) {
    const token = getRequestToken(request)?.replace(/^Bearer /, '');
    return users.read().find(user => user.token === token);
}
function checkSms(mobile: string, code: string, purpose: string) {
    const key = `${purpose}:${mobile}`;
    const codes = smsCodes.read();
    const valid = code === '123456' && codes[key] > Date.now();
    if (valid) { delete codes[key]; smsCodes.write(codes); }
    return valid;
}
function authError() { return resultError('登录身份已失效', { code: ResultEnum.TOKEN_EXPIRED }); }

export default [
    { url: '/api/login', method: 'post', timeout: 300, response: ({ body }) => {
        if (!validateCaptcha(body.captchaId, body.captchaCode)) return resultError('验证码错误或已过期，请刷新');
        const user = users.read().find(item => item.username === body.username && item.password === body.password);
        return user ? resultSuccess({ token: user.token }) : resultError('帐号或密码不正确');
    } },
    { url: '/api/getUserInfo', method: 'get', response: (request: requestParams) => {
        const user = getDemoUser(request);
        return user ? resultSuccess(publicUser(user)) : authError();
    } },
    { url: '/api/logout', method: 'post', response: () => resultSuccess(null) },
    { url: '/api/user/sms', method: 'post', response: ({ body }) => {
        if (!/^1\d{10}$/.test(body.mobile) || !['register', 'reset'].includes(body.purpose)) return resultError('请填写正确的手机号码');
        const codes = smsCodes.read();
        codes[`${body.purpose}:${body.mobile}`] = Date.now() + 300000;
        smsCodes.write(codes);
        return resultSuccess({ demoCode: '123456' }, { message: '演示验证码：123456' });
    } },
    { url: '/api/register', method: 'post', response: ({ body }) => {
        const list = users.read();
        if (!body.policy || !/^[A-Za-z0-9_]{3,24}$/.test(body.username) || String(body.password).length < 6) return resultError('账号须为 3-24 位字母、数字或下划线，密码至少 6 位，并同意协议');
        if (list.some(user => user.username === body.username || user.phone === body.mobile)) return resultError('用户名或手机号已注册');
        if (!checkSms(body.mobile, body.sms, 'register')) return resultError('短信验证码错误或已过期');
        list.push({ ...seed[0], userId: Date.now(), username: body.username, nickname: body.username, phone: body.mobile, password: body.password, token: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}` });
        users.write(list);
        return resultSuccess(null);
    } },
    { url: '/api/user/reset-password', method: 'post', response: ({ body }) => {
        const list = users.read();
        const user = list.find(item => item.username === body.username && item.phone === body.mobile);
        if (!user) return resultError('账号与手机号不匹配');
        if (String(body.password).length < 6 || !checkSms(body.mobile, body.sms, 'reset')) return resultError('请检查密码和短信验证码');
        user.password = body.password; users.write(list);
        return resultSuccess(null);
    } },
    { url: '/api/user/profile', method: 'put', response: (request: requestParams) => {
        const current = getDemoUser(request);
        if (!current) return authError();
        const list = users.read();
        const user = list.find(item => item.userId === current.userId)!;
        const profile = request.body as UserProfile;
        for (const key of ['nickname', 'avatar', 'cover', 'gender', 'sign', 'industry'] as const) {
            if (profile[key] !== undefined) Object.assign(user, { [key]: profile[key] });
        }
        users.write(list);
        return resultSuccess(publicUser(user));
    } },
    { url: '/api/user/password', method: 'put', response: (request: requestParams) => {
        const current = getDemoUser(request);
        if (!current) return authError();
        if (current.password !== request.body.oldPassword) return resultError('当前密码不正确');
        if (String(request.body.newPassword).length < 6) return resultError('新密码至少 6 位');
        const list = users.read();
        list.find(item => item.userId === current.userId)!.password = request.body.newPassword;
        users.write(list);
        return resultSuccess(null);
    } },
] as MockMethod[];
