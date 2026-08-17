// jsencrypt 无内置类型声明，补充最小类型
declare module 'jsencrypt' {
    export default class JSEncrypt {
        constructor(options?: Record<string, unknown>);
        setPublicKey(key: string): void;
        setPrivateKey(key: string): void;
        encrypt(text: string): string | null;
        decrypt(text: string): string | false;
    }
}
