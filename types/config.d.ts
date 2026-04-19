export interface GlobConfig {
    title: string;
    titleCN: string;
    apiUrl: string;
    shortName: string;
    urlPrefix?: string;
    pcApiUrl?: string;
    pcUrlPrefix?: string;
    appId?: string;
    uploadUrl?: string;
    imgUrl?: string;
}

export interface GlobEnvConfig {
    // 标题
    VITE_GLOB_APP_TITLE: string;
    // 中文标题
    VITE_GLOB_APP_TITLE_CN: string;
    // 接口地址
    VITE_GLOB_API_URL: string;
    // 接口前缀
    VITE_GLOB_API_URL_PREFIX?: string;
    // PC 端网关地址（菜单/登录/权限）
    VITE_GLOB_PC_API_URL?: string;
    // PC 端网关接口前缀
    VITE_GLOB_PC_API_PREFIX?: string;
    // 移动端应用 ID（PC 系统中注册的应用标识）
    VITE_GLOB_APP_ID?: string;
    // Project abbreviation
    VITE_GLOB_APP_SHORT_NAME: string;
    // 图片上传地址
    VITE_GLOB_UPLOAD_URL?: string;
    // 图片前缀地址
    VITE_GLOB_IMG_URL?: string;
    // 生产环境开启mock
    VITE_GLOB_PROD_MOCK: boolean;
}
