import type { MockMethod } from 'vite-plugin-mock';
import type { requestParams } from './_util';
import { getRequestToken, resultError, resultSuccess } from './_util';

// 1px 透明 PNG（验证码占位，联调期可直观看到图片是否加载）
const captchaImageBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export default [
    {
        url: '/api/system/captcha/getCaptcha',
        timeout: 500,
        method: 'get',
        response: () =>
            resultSuccess({
                image: captchaImageBase64,
                captchaId: 'mock-captcha-001',
                verificationCode: '1234', // 开发环境预填，方便联调
            }),
    },
    {
        url: '/api/auth/oauth/token',
        timeout: 1000,
        method: 'post',
        response: (request: requestParams) => {
            // 参数走 query（joinParamsToUrl）
            const { companyId, grant_type, user_code, verifyCode } = request.query || {};
            if (grant_type !== 'password') {
                return resultError('不支持的登录方式');
            }
            if (!user_code) {
                return resultError('登录参数缺失');
            }
            if (companyId && verifyCode && verifyCode !== '1234') {
                return resultError('验证码错误');
            }
            // user_code 为 RSA 密文，mock 阶段直接放行
            return resultSuccess({
                access_token: 'mock-token-wl-mes',
                roles: ['mes-admin'],
                user_auth: { nickname: '计量测试员' },
            });
        },
    },
    {
        url: '/api/hrms/user/getCurUser',
        timeout: 500,
        method: 'get',
        response: (request: requestParams) => {
            if (!getRequestToken(request)) {
                return resultError('无效令牌');
            }
            return resultSuccess({
                user: { userNo: 'admin', name: '计量测试员', id: 'u001' },
                dept: { id: 'd001', strName: '计量科' },
                roles: ['mes-admin'],
                permissions: [],
                companyId: '1',
            });
        },
    },
    {
        url: '/api/auth/oauth/logout',
        timeout: 500,
        method: 'post',
        response: () => resultSuccess(null, { message: '已退出登录' }),
    },
    {
        url: '/api/system/user/profile/update/pwd',
        timeout: 500,
        method: 'put',
        response: () => resultSuccess(null, { message: '密码修改成功' }),
    },
] as MockMethod[];
