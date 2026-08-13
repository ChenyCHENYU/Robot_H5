import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { postMbaseMessage, waitForMbaseAppBridge } from '@robot-h5/core/bridge';
import { getMbaseHost, isMbaseAppHost, isMbaseHosted } from './host';

const SOURCE = 'mbase-navigation';
const PROTOCOL = 1;
const COMMAND_EVENT = 'mbase:navigation-command';
const MESSAGE_ID_PATTERN = /^[A-Za-z0-9:_-]{1,100}$/;

let installed = false;
let sequence = 0;
let latestRoute: RouteLocationNormalizedLoaded | undefined;
let pendingAckRequestId = '';
let queuedAppState: Record<string, unknown> | undefined;
let appFlushInProgress = false;

function routeTitle(route: RouteLocationNormalizedLoaded): string {
    return String(route.meta.title || document.title || import.meta.env.VITE_GLOB_APP_TITLE || '应用')
        .trim()
        .slice(0, 100);
}

function isRootRoute(route: RouteLocationNormalizedLoaded): boolean {
    return route.meta.mbaseRoot === true;
}

function createNavigationState(route: RouteLocationNormalizedLoaded, ackRequestId = '') {
    return {
        source: SOURCE,
        type: 'navigation:state',
        protocol: PROTOCOL,
        title: routeTitle(route),
        canGoBack: !isRootRoute(route),
        seq: ++sequence,
        ...(ackRequestId ? { ackRequestId } : {}),
    };
}

async function reportRoute(route: RouteLocationNormalizedLoaded, ackRequestId = ''): Promise<void> {
    const host = getMbaseHost();
    if (!host) return;
    try {
        if (host === 'iframe') {
            await postMbaseMessage({ title: routeTitle(route) });
            return;
        }

        queuedAppState = createNavigationState(route, ackRequestId);
        void flushLatestAppState();
    } catch (error) {
        console.warn('[mbase-navigation] 导航信息上报失败', {
            error,
            host,
            route: route.fullPath,
        });
    }
}

async function flushLatestAppState(): Promise<void> {
    if (appFlushInProgress) return;
    appFlushInProgress = true;
    let shouldContinue = false;
    try {
        // SDK 就绪前可能发生重定向或连续路由变化；等待完成后只发送最新状态。
        await waitForMbaseAppBridge();
        const state = queuedAppState;
        if (!state) return;
        queuedAppState = undefined;
        try {
            await postMbaseMessage(state);
            // 发送期间若又发生路由变化，下一轮只发送新的最新状态。
            shouldContinue = Boolean(queuedAppState);
        } catch (error) {
            // 发送瞬间容器失联时保留最新状态，等待下一次 bridge ready 重试。
            if (!queuedAppState) queuedAppState = state;
            throw error;
        }
    } catch (error) {
        console.warn('[mbase-navigation] App/PDA 导航状态上报失败', {
            error,
            state: queuedAppState,
        });
    } finally {
        appFlushInProgress = false;
        if (shouldContinue) void flushLatestAppState();
    }
}

function parseBackCommand(event: Event): { id: string } | null {
    const command = (event as CustomEvent).detail as Record<string, unknown> | undefined;
    if (
        !command ||
        command.source !== SOURCE ||
        command.type !== 'navigation:back' ||
        Number(command.protocol) !== PROTOCOL ||
        typeof command.id !== 'string' ||
        !MESSAGE_ID_PATTERN.test(command.id)
    ) return null;
    return { id: command.id };
}

export function installMbaseNavigation(router: Router): void {
    if (installed || !isMbaseHosted()) return;
    installed = true;

    router.afterEach((to, _from, failure) => {
        if (failure) return;
        latestRoute = to;
        const ackRequestId = pendingAckRequestId;
        pendingAckRequestId = '';
        void reportRoute(to, ackRequestId);
    });

    if (!isMbaseAppHost()) return;

    const retryFlush = () => void flushLatestAppState();
    // 部分 PDA 上 SDK 与原生容器就绪顺序不固定；超时后仍可由任一就绪事件重试。
    document.addEventListener('UniAppJSBridgeReady', retryFlush);
    document.addEventListener('plusready', retryFlush);

    window.addEventListener(COMMAND_EVENT, event => {
        const command = parseBackCommand(event);
        if (!command || !latestRoute) return;

        if (isRootRoute(latestRoute)) {
            void reportRoute(latestRoute, command.id);
            return;
        }

        pendingAckRequestId = command.id;
        router.back();
    });
}
