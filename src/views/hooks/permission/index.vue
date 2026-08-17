<template>
    <div class="hook-demo">
        <C_NavBar title="usePermission" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF3B30">
                <C_Icon name="ph:key-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">权限管理</h2>
            <p class="hook-demo__header-desc">查询系统权限状态，点击卡片请求授权</p>
        </div>

        <!-- 权限卡片 -->
        <div class="hook-demo__section">
            <p class="hook-demo__section-title">权限列表（点击卡片查询/请求）</p>
            <div class="hook-demo__perm-grid">
                <div
                    v-for="perm in permList"
                    :key="perm.name"
                    class="hook-demo__perm-item"
                    @click="handlePermission(perm)"
                >
                    <div
                        class="hook-demo__perm-icon"
                        :style="{ background: perm.bgColor }"
                    >
                        <C_Icon :name="perm.icon" :size="24" color="#fff" />
                    </div>
                    <span class="hook-demo__perm-name">{{ perm.label }}</span>
                    <span
                        :class="['hook-demo__badge', stateClass(permStates[perm.name])]"
                        :style="{ fontSize: '11px', padding: '2px 8px' }"
                    >
                        {{ stateEmoji(permStates[perm.name]) }} {{ stateLabel(permStates[perm.name]) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 状态说明 -->
        <div class="hook-demo__section">
            <p class="hook-demo__section-title">状态说明</p>
            <div style="display: flex; flex-direction: column; gap: 8px; padding: 0 4px">
                <div style="display: flex; align-items: center; gap: 8px">
                    <span class="hook-demo__badge hook-demo__badge--success" style="font-size: 12px">✅ 已授权</span>
                    <span style="font-size: 13px; color: var(--ds-text-secondary)">可正常使用该功能</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <span class="hook-demo__badge hook-demo__badge--danger" style="font-size: 12px">🚫 已拒绝</span>
                    <span style="font-size: 13px; color: var(--ds-text-secondary)">需到系统设置手动开启</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <span class="hook-demo__badge hook-demo__badge--warning" style="font-size: 12px">❓ 待询问</span>
                    <span style="font-size: 13px; color: var(--ds-text-secondary)">点击卡片可触发授权弹窗</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <span class="hook-demo__badge hook-demo__badge--info" style="font-size: 12px">⏳ 查询中</span>
                    <span style="font-size: 13px; color: var(--ds-text-secondary)">正在检测权限状态</span>
                </div>
            </div>
        </div>

        <!-- 操作日志 -->
        <div v-if="logs.length" class="hook-demo__state">
            <p class="hook-demo__state-label">操作日志</p>
            <div class="hook-demo__state-body">{{ logs.join('\n') }}</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { usePermission } from '@robot-h5/core';

    defineOptions({ name: 'HookPermission' });

    type PermName = 'camera' | 'microphone' | 'geolocation' | 'notifications' | 'clipboard-read' | 'clipboard-write';

    interface PermItem {
        name: PermName;
        label: string;
        icon: string;
        bgColor: string;
        desc: string;
    }

    const { error, query } = usePermission();
    const logs = ref<string[]>([]);

    const permList: PermItem[] = [
        { name: 'camera', label: '相机', icon: 'ph:camera-bold', bgColor: '#007AFF', desc: '拍照 / 录像' },
        { name: 'microphone', label: '麦克风', icon: 'ph:microphone-bold', bgColor: '#FF3B30', desc: '语音录入' },
        { name: 'geolocation', label: '定位', icon: 'ph:map-pin-bold', bgColor: '#34C759', desc: 'GPS 位置' },
        { name: 'notifications', label: '通知', icon: 'ph:bell-bold', bgColor: '#FF9500', desc: '推送消息' },
        { name: 'clipboard-read', label: '剪贴板读', icon: 'ph:clipboard-text-bold', bgColor: '#5856D6', desc: '读取粘贴板' },
        { name: 'clipboard-write', label: '剪贴板写', icon: 'ph:clipboard-bold', bgColor: '#5AC8FA', desc: '写入粘贴板' },
    ];

    const permStates = reactive<Record<string, string>>({});

    function stateClass(state?: string) {
        if (!state || state === 'loading') return 'hook-demo__badge--info';
        if (state === 'granted') return 'hook-demo__badge--success';
        if (state === 'denied') return 'hook-demo__badge--danger';
        return 'hook-demo__badge--warning';
    }

    function stateEmoji(state?: string) {
        if (!state || state === 'loading') return '⏳';
        if (state === 'granted') return '✅';
        if (state === 'denied') return '🚫';
        return '❓';
    }

    function stateLabel(state?: string) {
        if (!state || state === 'loading') return '查询中';
        if (state === 'granted') return '已授权';
        if (state === 'denied') return '已拒绝';
        if (state === 'prompt') return '待询问';
        return state;
    }

    async function handlePermission(perm: PermItem) {
        const prev = permStates[perm.name];
        permStates[perm.name] = 'loading';
        const now = new Date().toLocaleTimeString();
        try {
            const state = await query(perm.name);
            permStates[perm.name] = state;
            logs.value.unshift(`[${now}] ${perm.label}: ${prev || '未知'} → ${state}`);
        } catch (e: any) {
            permStates[perm.name] = 'error';
            logs.value.unshift(`[${now}] ${perm.label}: 查询失败 - ${e.message}`);
        }
    }

    onMounted(() => {
        permList.forEach(p => handlePermission(p));
    });
</script>
