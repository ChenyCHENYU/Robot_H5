import { acceptHMRUpdate, defineStore, type StateTree } from 'pinia';
import { store } from '@/store';
import { doLogout, getUserInfo, login } from '@/api/user';
import { PageEnum } from '@/enums/pageEnum';
import router from '@/router';
import { encryptAES, decryptAES } from '@miracle-web/utils';
import { useEnv } from '@/hooks/useEnv';
import { usePermissionStoreWidthOut } from './permission';
import { useRouteStoreWidthOut } from './route';
import {
    clearPortalSource,
    isIntegratedMode,
    isFromPortal,
    notifyPortalUserLogout,
} from '@/utils/auth';

interface UserInfo {
    userId: string | number;
    username: string;
    nickname: string;
    avatar: string;
    cover: string;
    gender: number;
    phone: string;
    sign?: string;
    industry?: number;
}

interface IUserState {
    token?: string;
    // 集成模式下从 mbase 透传的公司 ID（后端权限校验必需）
    companyId?: string;
    // 仅用于展示；权限与数据范围只认 companyId
    companyName?: string;
    companyContextStatus: 'idle' | 'syncing' | 'ready' | 'error';
    companyContextError: {
        code: string;
        message: string;
        endpoint?: string;
    } | null;
    userInfo: UserInfo;
}

interface LoginParams {
    username: string;
    password: string;
}

const { isProdMode } = useEnv();

const createEmptyUserInfo = (): UserInfo => ({
    userId: '',
    username: '',
    nickname: '',
    avatar: '',
    cover: '',
    gender: 0,
    phone: '',
});

export const useUserStore = defineStore('app-user-store', {
    state: (): IUserState => ({
        userInfo: createEmptyUserInfo(),
        token: '',
        companyId: '',
        companyName: '',
        companyContextStatus: 'idle',
        companyContextError: null,
    }),
    getters: {
        getUserInfo: state => state.userInfo,
        getToken: state => state.token,
        getCompanyId: state => state.companyId || '',
        getCompanyName: state => state.companyName || '',
    },
    actions: {
        setToken(token: string) {
            this.token = token || '';
        },
        setCompanyId(companyId: string) {
            this.companyId = companyId || '';
        },
        setCompanyContext(companyId: string, companyName = '') {
            this.companyId = companyId || '';
            this.companyName = companyName || '';
        },
        setCompanyContextStatus(
            status: IUserState['companyContextStatus'],
            error: IUserState['companyContextError'] = null
        ) {
            this.companyContextStatus = status;
            this.companyContextError = error;
        },
        setUserInfo(info: UserInfo) {
            this.userInfo = info;
        },
        clearLocalSession() {
            this.setToken('');
            this.setCompanyContext('', '');
            this.setCompanyContextStatus('idle');
            this.setUserInfo(createEmptyUserInfo());
            usePermissionStoreWidthOut().resetPermissions();
            useRouteStoreWidthOut().setKeepAliveComponents([]);
            clearPortalSource();
        },

        async Login(params: LoginParams) {
            try {
                const { data } = await login(params);
                if (data.token) {
                    this.setToken(data.token);
                    await this.GetUserInfo();
                    // 登录后加载菜单权限
                    const permissionStore = usePermissionStoreWidthOut();
                    await permissionStore.loadPermissions();
                    return Promise.resolve(data.token);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        },

        async GetUserInfo() {
            try {
                const { data } = await getUserInfo();
                this.setUserInfo(data);
                return Promise.resolve(data);
            } catch (error) {
                return Promise.reject(error);
            }
        },

        async Logout() {
            // 集成模式：用户主动退出时通知基座执行完整退出流程
            // （避免子应用退出后基座会话残留），由基座统一跳登录页
            if (isIntegratedMode() && isFromPortal()) {
                try {
                    await notifyPortalUserLogout();
                    // 基座负责退出和跳转；子应用仍须清理自身持久化状态，
                    // 避免 WebView 被复用或下次换号进入时短暂展示旧用户。
                    this.clearLocalSession();
                    return;
                } catch {
                    // 宿主通信失败才执行本地退出兜底，避免成功通知后继续刷新 iframe。
                }
            }
            if (this.getToken) {
                try {
                    await doLogout();
                } catch {
                    console.error('注销Token失败');
                }
            }
            this.clearLocalSession();
            router.push(PageEnum.BASE_LOGIN);
            location.reload();
        },
    },
    // 开启数据缓存
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
