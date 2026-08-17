import { ref, onUnmounted } from 'vue';

/** 将磅秤编号规范化，用于与推送中的 weighSiteNo 对应（忽略大小写与首尾空格） */
function normalizeWeighSiteNo(no: string | undefined | null) {
    return String(no ?? '')
        .trim()
        .toUpperCase();
}

export type ScaleWeightPayload = {
    weight: number;
    time: string;
};

const DEFAULT_WS =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SCALE_WS_URL) ||
    'ws://172.18.191.135:8080/ws/scale';

/**
 * 地磅（scale）过磅值 WebSocket：按磅秤编号 subscribe 最新一条重量，供「取值」使用。
 */
export function useScaleWebsocket() {
    /** 各磅秤编号 -> 最近一条过磅值 */
    const latestByWeighSiteNo = ref<Record<string, ScaleWeightPayload>>({});
    const connected = ref(false);
    const urlUsed = ref('');

    let ws: WebSocket | null = null;

    function parseMessage(raw: string) {
        const data = JSON.parse(raw) as {
            weighSiteNo?: string;
            weight?: number;
            time?: string;
        };
        const no = normalizeWeighSiteNo(data.weighSiteNo);
        if (!no) return;
        const w = Number(data.weight);
        if (Number.isNaN(w)) return;
        const time = data.time != null ? String(data.time) : '';
        const key = no;
        latestByWeighSiteNo.value = {
            ...latestByWeighSiteNo.value,
            [key]: { weight: w, time },
        };
    }

    function connect(url: string = DEFAULT_WS) {
        if (!url || typeof WebSocket === 'undefined') return;
        disconnect();
        urlUsed.value = url;
        try {
            ws = new WebSocket(url);
        } catch {
            connected.value = false;
            return;
        }
        ws.onopen = () => {
            connected.value = true;
        };
        ws.onclose = () => {
            connected.value = false;
            ws = null;
        };
        ws.onerror = () => {
            connected.value = false;
        };
        ws.onmessage = (ev) => {
            if (typeof ev.data !== 'string') return;
            try {
                parseMessage(ev.data);
            } catch {
                /* 忽略非 JSON 或异常结构 */
            }
        };
    }

    function disconnect() {
        if (ws) {
            try {
                ws.close();
            } catch {
                /* ignore */
            }
            ws = null;
        }
        connected.value = false;
    }

    /**
     * 按磅秤编号取最近一次推送的值（「取值」按钮调用）
     */
    function getLatest(weighSiteNo: string): ScaleWeightPayload | null {
        const key = normalizeWeighSiteNo(weighSiteNo);
        if (!key) return null;
        return latestByWeighSiteNo.value[key] ?? null;
    }

    onUnmounted(() => {
        disconnect();
    });

    return {
        latestByWeighSiteNo,
        connected,
        urlUsed,
        connect,
        disconnect,
        getLatest,
    };
}
