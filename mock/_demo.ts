/** 演示站持久化到浏览器；开发 Mock 在服务运行期间保留进程内存。 */
const runtime = globalThis as typeof globalThis & { __robotH5DemoMemory?: Map<string, string> };
const memory = runtime.__robotH5DemoMemory ||= new Map<string, string>();
export function demoRepository<T>(key: string, seed: T) {
    if (!memory.has(key)) memory.set(key, JSON.stringify(seed));
    return {
        read(): T {
            if (typeof window !== 'undefined') {
                try { const value = window.localStorage.getItem(`robot-demo:${key}`); if (value) return JSON.parse(value); } catch { /* 使用内存兜底 */ }
            }
            return JSON.parse(memory.get(key)!);
        },
        write(value: T) {
            const json = JSON.stringify(value);
            if (typeof window !== 'undefined') {
                // 存储失败应向页面报告，不能声称已持久化。
                window.localStorage.setItem(`robot-demo:${key}`, json);
            }
            memory.set(key, json);
        },
    };
}
