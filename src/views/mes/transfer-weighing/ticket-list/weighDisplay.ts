/** 磅单毛/皮/净与格式化（详情页与打印预览共用） */

export const WEIGHBILL_STATUS_MAP: Record<string, string> = {
    PENDING: '待过磅',
    ONCE_COMPLETE: '一次过磅',
    TWICE_COMPLETE: '二次过磅',
    COMPLETE: '过磅完成',
    EXCEPTION: '过磅异常',
    SUSPEND: '暂停过磅',
};

export function getWeighStatusLabel(status: string | undefined) {
    if (!status) return '未知';
    return WEIGHBILL_STATUS_MAP[status] || status;
}

export function toWeightNum(v: unknown) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export function roundTon2(n: number) {
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100) / 100;
}

type TicketLike = Record<string, unknown> | null;

/**
 * 与后端扣杂公式一致：净重(t) = |一磅-二磅|(t) - 扣杂(kg)/1000
 */
export function buildDisplayWeight(d: TicketLike) {
    const empty = { gross: null as number | null, tare: null as number | null, net: null as number | null, grossTime: '', tareTime: '' };
    if (!d) return empty;
    const g = toWeightNum(d.grossWgt);
    const t = toWeightNum(d.tareWgt);
    const nRaw = toWeightNum(d.netWgt);
    const mk = toWeightNum(d.moistureDeductWgt) ?? 0;
    const pk = toWeightNum(d.packageDeductWgt) ?? 0;
    const ik = toWeightNum(d.impurityDeductWgt) ?? 0;
    const totalDeductTon = (Number(mk) + Number(pk) + Number(ik)) / 1000;

    let gross = g;
    let tare = t;
    let grossTime = String(d.grossDateTime || '');
    let tareTime = String(d.tareDateTime || '');

    if (g != null && t != null) {
        if (g > t) {
            gross = g;
            tare = t;
            grossTime = String(d.grossDateTime || '');
            tareTime = String(d.tareDateTime || '');
        } else if (t > g) {
            gross = t;
            tare = g;
            grossTime = String(d.tareDateTime || '');
            tareTime = String(d.grossDateTime || '');
        } else {
            gross = g;
            tare = t;
            grossTime = String(d.grossDateTime || '');
            tareTime = String(d.tareDateTime || '');
        }
    } else {
        grossTime = String(d.grossDateTime || '');
        tareTime = String(d.tareDateTime || '');
    }

    let net: number | null = null;
    if (g != null && t != null) {
        const raw = roundTon2(Math.abs(g - t) - totalDeductTon);
        net = raw;
    } else if (nRaw != null) {
        net = roundTon2(Math.abs(nRaw)) ?? null;
    }

    return {
        gross: gross != null ? roundTon2(gross) : null,
        tare: tare != null ? roundTon2(tare) : null,
        net,
        grossTime,
        tareTime,
    };
}

export function formatWeightNum(val: unknown) {
    if (val === null || val === undefined || val === '') return '-';
    const n = Number(val);
    if (!Number.isFinite(n)) return '-';
    return n.toFixed(2);
}

export function formatDeductNum(v: unknown) {
    if (v === null || v === undefined || v === '') return '-';
    const n = Number(v);
    if (!Number.isFinite(n)) return '-';
    return n.toFixed(2);
}

export function formatTime(dateTime: string | undefined) {
    if (!dateTime) return '';
    const timePart = dateTime.split(' ')[1];
    return timePart ? timePart.substring(0, 8) : dateTime;
}

export function matSpecFromDetail(d: TicketLike) {
    if (!d) return '-';
    const raw = d.matSpec ?? d.matSpecification;
    if (raw == null || String(raw).trim() === '') return '-';
    return String(raw).trim();
}
