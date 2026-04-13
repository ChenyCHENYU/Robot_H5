/**
 * @description 封装原生 App 调用 JS 的方法
 * 按需添加具体的回调方法，示例：
 * static onScanResult(data: string) {
 *   emitter.emit('scan-result', isAndroid ? JSON.parse(data) : data);
 * }
 */
export default class NativeCallJs {}
