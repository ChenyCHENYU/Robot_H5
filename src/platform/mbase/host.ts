import { detectMbaseHost, type MbaseHostType } from '@robot-h5/core/bridge';

export type MbaseHost = MbaseHostType | null;

export function getMbaseHost(): MbaseHost {
    if (typeof window === 'undefined' || import.meta.env.VITE_APP_MODE !== 'integrated') return null;
    // Core 在首次识别后缓存结果，不受认证层清理 from/portal_token 影响。
    return detectMbaseHost();
}

export function isMbaseHosted(): boolean {
    return getMbaseHost() !== null;
}

export function isMbaseAppHost(): boolean {
    return getMbaseHost() === 'app';
}

export function applyMbaseHostClass(): void {
    if (typeof document === 'undefined') return;
    const host = getMbaseHost();
    if (!host) return;
    document.documentElement.classList.add('mbase-hosted', `mbase-host-${host}`);
}
