import { acceptHMRUpdate, defineStore, type StateTree } from 'pinia';
import { store } from '@/store';
import { doLogout, getUserInfo, login, type LoginParams } from '@/api/auth';
import { PageEnum } from '@/enums/pageEnum';
import router from '@/router';
import { encryptAES, decryptAES } from '@miracle-web/utils';
import { useEnv } from '@/hooks/useEnv';
import {
    removeToken as removeCookieToken,
    isIntegratedMode,
    isFromPortal,
    notifyPortalUserLogout,
} from '@/utils/auth';

interface UserInfo {
    /** 业务用户编号（老计量系统字段） */
    userNo: string;
    /** 业务用户姓名 */
    personName: string;
    /** 业务用户 ID（兼容老代码：值为 userNo） */
    personId: string;
    personType: string;
    roles: string[];
    deptName: string;
    deptId: string;
}

interface IUserState {
    token?: string;
    // 集成模式下从 mbase 透传的公司 ID（后端权限校验必需）
    companyId?: string;
    userInfo: UserInfo;
}

const { isProdMode } = useEnv();

export const useUserStore = defineStore('app-user-store', {
    state: (): IUserState => ({
        userInfo: {
            userNo: '',
            personName: '',
            personId: '',
            personType: '',
            roles: [],
            deptName: '',
            deptId: '',
        },
        // token 存 pinia + persist（localStorage），不依赖 Cookie（对齐 wl-app-tms）
        token: '',
        companyId: '',
    }),
    getters: {
        getUserInfo: state => state.userInfo,
        getToken: state => state.token,
        getCompanyId: state => state.companyId || '',
        getPersonName: state => state.userInfo.personName,
        getUserNo: state => state.userInfo.userNo,
        getPersonId: state => state.userInfo.personId,
        getDeptName: state => state.userInfo.deptName,
        getDeptId: state => state.userInfo.deptId,
    },
    actions: {
        setToken(token: string) {
            this.token = token || '';
        },
        setCompanyId(companyId: string) {
            this.companyId = companyId || '';
        },
        setRoles(roles: string[]) {
            this.userInfo.roles = roles || [];
        },
        setBusinessUserInfo(user: Partial<UserInfo>) {
            this.userInfo = { ...this.userInfo, ...user };
        },

        /**
         * 登录（jhlc 后端 /auth/oauth/token + /hrms/user/getCurUser）
         */
        async Login(params: LoginParams) {
            try {
                const res: any = await login(params);
                // 响应体 {code, data:{access_token, roles, user_auth}, message}
                const payload = res?.data ?? res ?? {};
                const accessToken = payload.access_token || payload.token;
                if (!accessToken) {
                    throw new Error(payload.message || '登录失败');
                }
                this.setToken(accessToken);
                this.setRoles(payload.roles || []);
                await this.GetUserInfo();
                return Promise.resolve(accessToken);
            } catch (error) {
                return Promise.reject(error);
            }
        },

        /**
         * 获取当前登录用户业务信息（/hrms/user/getCurUser）
         * 映射：personId/userNo ← user.userNo，personName ← user.name，
         *      deptId ← dept.id，deptName ← dept.strName
         */
        async GetUserInfo() {
            try {
                const res: any = await getUserInfo();
                const { user, dept, roles } = res?.data ?? res ?? {};
                this.setBusinessUserInfo({
                    personId: user?.userNo ?? '',
                    userNo: user?.userNo != null ? String(user.userNo) : '',
                    personName: user?.name ?? '',
                    deptId: dept?.id ?? '',
                    deptName: dept?.strName ?? '',
                });
                if (Array.isArray(roles)) {
                    this.setRoles(roles);
                }
                return Promise.resolve(res);
            } catch (error) {
                return Promise.reject(error);
            }
        },

        async Logout() {
            // 集成模式：用户主动退出时通知基座执行完整退出流程
            // （避免子应用退出后基座会话残留），由基座统一跳登录页
            if (isIntegratedMode() && isFromPortal()) {
                notifyPortalUserLogout();
            }
            if (this.getToken) {
                try {
                    await doLogout();
                } catch {
                    console.error('注销Token失败');
                }
            }
            this.setToken('');
            removeCookieToken();
            this.setBusinessUserInfo({});
            router.push(PageEnum.BASE_LOGIN);
            location.reload();
        },
    },
    // 开启数据缓存（token + 业务用户信息全量持久化，刷新后保持登录态；对齐 wl-app-tms）
    persist: {
        key: 'CURRENT-USER',
        storage: window.localStorage,
        serializer: {
            serialize: isProdMode()
                ? (value: StateTree) => {
                      return encryptAES(value);
                  }
                : JSON.stringify,
            deserialize: isProdMode()
                ? (value: string) => {
                      return JSON.parse(decryptAES(value));
                  }
                : JSON.parse,
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

// Need to be used outside the setup
export function useUserStoreWidthOut() {
    return useUserStore(store);
}
