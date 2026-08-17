/**
 * @description: 请求结果集
 */
export enum ResultEnum {
    // jhlc 后端成功码（老系统兼容 200）
    SUCCESS = 2000,
    TOKEN_EXPIRED = 401,
    TOKEN_EXPIRED_2 = 4001,
    // license 过期（老系统跳 licenseRegister，新项目改为提示跳登录）
    LICENSE_EXPIRED = 4103,
    ERROR = 300,
    TIMEOUT = 10042,
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // json
    TEXT = 'text/plain;charset=UTF-8',
    // form-data 一般配合qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  上传
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
