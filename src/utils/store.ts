/** 存储 localStorage（老计量系统 storeutil 迁移） */

export const setStore = (name: string, content: unknown): void => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content as string);
};

export const getStore = (name: string): string | null => {
    if (!name) return null;
    return window.localStorage.getItem(name);
};

export const removeStore = (name: string): void => {
    if (!name) return;
    window.localStorage.removeItem(name);
};

export function getUrlData(): Record<string, string> {
    /**
     * tempStr 格式是 http://域名/路由?key=value&key=value...
     */
    const tempStr = window.location.href;
    /**
     * tempArr 是一个字符串数组 格式是 ["key=value", "key=value", ...]
     */
    const tempArr = tempStr.split('?')[1] ? tempStr.split('?')[1].split('&') : [];
    /**
     * returnArr 是要返回出去的数据对象 格式是 { key: value, key: value, ... }
     */
    const returnArr: Record<string, string> = {};
    tempArr.forEach(element => {
        returnArr[element.split('=')[0]] = element.split('=')[1];
    });
    return returnArr;
}
