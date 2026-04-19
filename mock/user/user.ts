import type { MockMethod } from 'vite-plugin-mock';
import type { requestParams } from '../_util';
import { getRequestToken, resultError, resultSuccess } from '../_util';
import { ResultEnum } from '@/utils/http/httpEnum';

const fakeUserList = [
    {
        userId: 1,
        username: 'admin',
        password: '123456',
        nickname: 'CHENY',
        avatar: 'https://via.placeholder.com/100',
        cover: 'https://via.placeholder.com/400x200',
        sign: '把复杂的事做简单，把简单的事做极致。',
        industry: 4,
        gender: 0,
        phone: '1234567890',
        token: 'fakeToken1',
    },
    {
        userId: 2,
        username: 'test',
        password: '123456',
        nickname: '哈哈你个大西瓜',
        avatar: 'https://via.placeholder.com/100',
        cover: 'https://via.placeholder.com/400x200',
        sign: '这个家伙很懒，什么都没有写~',
        industry: 7,
        gender: 1,
        phone: '1234567890',
        token: 'fakeToken2',
    },
];

export default [
    {
        url: '/pcApi/login',
        timeout: 1000,
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body;
            const checkUser = fakeUserList.find(item => item.username === username && password === item.password);
            if (!checkUser) {
                return resultError('帐号或密码不正确');
            }
            const { token } = checkUser;
            return resultSuccess({ token });
        },
    },
    {
        url: '/pcApi/getUserInfo',
        timeout: 1000,
        method: 'get',
        response: (request: requestParams) => {
            const token = getRequestToken(request);
            if (!token) {
                return resultError('无效令牌');
            }
            const checkUser = fakeUserList.find(item => item.token === token);
            if (!checkUser) {
                return resultError('没有获取到对应的用户信息', {
                    code: ResultEnum.TOKEN_EXPIRED,
                });
            }
            return resultSuccess(checkUser);
        },
    },
    {
        url: '/pcApi/logout',
        timeout: 1000,
        method: 'post',
        response: (request: requestParams) => {
            const token = getRequestToken(request);
            if (!token) {
                return resultError('无效令牌');
            }
            const checkUser = fakeUserList.find(item => item.token === token);
            if (!checkUser) {
                return resultError('无效令牌');
            }
            return resultSuccess(undefined, { message: '令牌已被销毁' });
        },
    },
] as MockMethod[];
