interface BuildIdentity {
    application: { id: string; version: string };
    build: { commitSha: string; builtAt: string };
}
const fingerprint = (value: BuildIdentity) => `${value.application.version}:${value.build.commitSha}:${value.build.builtAt}`;

/** 使用独立版本文件检测部署变化，兼容子目录部署，更新只提示一次。 */
export class Updater {
    private timer: ReturnType<typeof setInterval> | undefined;
    private callbacks: Partial<Record<'no-update' | 'update', (() => void)[]>> = {};
    private notified = false;
    private checking = false;
    constructor(options: { timer?: number } = {}) {
        this.timer = setInterval(() => { void this.check(); }, options.timer ?? 30000);
    }
    on(key: 'no-update' | 'update', callback: () => void): this {
        (this.callbacks[key] ||= []).push(callback);
        return this;
    }
    async check() {
        if (this.checking || this.notified || document.visibilityState === 'hidden') return;
        this.checking = true;
        try {
            const identity = await this.getIdentity();
            if (!identity) return;
            const changed = fingerprint(identity) !== fingerprint(__BUILD_ID__);
            if (changed) this.notified = true;
            this.callbacks[changed ? 'update' : 'no-update']?.forEach(callback => callback());
        } catch { /* 离线或代理返回非 JSON 时保留当前可用版本 */ }
        finally { this.checking = false; }
    }
    private async getIdentity(): Promise<BuildIdentity | undefined> {
        const response = await fetch(`${import.meta.env.BASE_URL}env.json`, { cache: 'no-store' });
        if (!response.ok) return;
        const identity = await response.json() as BuildIdentity;
        if (identity.application?.id === __BUILD_ID__.application.id && identity.build?.builtAt) return identity;
    }
    stopTiming() { clearInterval(this.timer); this.timer = undefined; }
}
