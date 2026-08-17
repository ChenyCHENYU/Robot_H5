import { get, post, put } from '@/utils/http';
import { encrypt } from '@/utils/jsencrypt';

// 与 @jhlc/common-core 一致（client_id/client_secret 固定值）
const clientId = 'c1';
const clientSecret = 'secret';

/** 登录参数（老计量系统契约） */
export interface LoginParams {
    username: string;
    password: string;
    companyId?: string;
    captchaId?: string;
    verifyCode?: string;
}

/** 获取图形验证码（匿名接口：cookie 中残留的无效 token 会导致网关 401） */
export const getCaptcha = () => get('/system/captcha/getCaptcha', undefined, { withToken: false });

/**
 * 用户登录（POST /auth/oauth/token，query 参数提交，user_code/client_code RSA 加密）
 */
export const login = (params: LoginParams) => {
    const { username, password, companyId = '1', captchaId = '', verifyCode = '' } = params;
    const query = {
        companyId,
        grant_type: 'password',
        client_code: encrypt(`${clientId},${clientSecret}`),
        // 注意英文逗号拼接
        user_code: encrypt(`${username},${password}`),
        captchaId,
        verifyCode,
    };
    // joinParamsToUrl: 后端为 @RequestParam 契约，参数必须走 query
    // withToken: false：登录接口为匿名接口，避免携带残留的无效 token 导致 401
    return post('/auth/oauth/token', query, { joinParamsToUrl: true, isShowSuccessMessage: false, withToken: false });
};

/** 获取当前登录用户详细信息 */
export const getUserInfo = () => get('/hrms/user/getCurUser');

/** 退出登录 */
export const doLogout = () => post('/auth/oauth/logout');

/** 修改密码（oldPassword/newPassword 均 RSA 加密，走 query） */
export const updatePwd = (oldPassword: string, newPassword: string) =>
    put('/system/user/profile/update/pwd', {
        oldPassword: encrypt(oldPassword),
        newPassword: encrypt(newPassword),
    }, { joinParamsToUrl: true });

// ─── 忘记密码（短信验证码找回）───

/** 发送短信验证码（匿名接口） */
export const getMsgCode = (userNo: string) =>
    post('/relatedparty/ehsUserVerify/getMsgCode', { userNo }, { withToken: false });

/** 校验短信验证码（匿名接口） */
export const compareCodeByPhone = (userNo: string, msgCode: string) =>
    post('/relatedparty/ehsUserVerify/compareCodeByPhone', { userNo, msgCode }, { withToken: false });

/** 根据手机号查询用户名（匿名接口） */
export const getUserNoByPhone = (phone: string) =>
    get('/relatedparty/ehsRelPersonInfo/getUserNo', { phone }, { withToken: false });
