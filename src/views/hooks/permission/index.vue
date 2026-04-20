<template>
    <div class="hook-demo">
        <C_NavBar title="usePermission" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF3B30">
                <C_Icon name="ph:key-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">权限管理</h2>
            <p class="hook-demo__header-desc">系统权限查询 + 请求 + 监听</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__perm-grid">
                <div
                    v-for="perm in permList"
                    :key="perm.name"
                    class="hook-demo__perm-item"
                    @click="handleQuery(perm.name)"
                >
                    <C_Icon :name="perm.icon" :size="24" :color="perm.color" />
                    <span class="hook-demo__perm-name">{{ perm.label }}</span>
                    <span
                        v-if="permStates[perm.name]"
                        :class="['hook-demo__badge', badgeClass(permStates[perm.name])]"
                    >
                        {{ permStates[perm.name] }}
                    </span>
                </div>
            </div>
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

    const { error, query } = usePermission();

    const permList = [
        { name: 'camera' as PermName, label: '相机', icon: 'ph:camera-bold', color: '#007AFF' },
        { name: 'microphone' as PermName, label: '麦克风', icon: 'ph:microphone-bold', color: '#FF3B30' },
        { name: 'geolocation' as PermName, label: '定位', icon: 'ph:map-pin-bold', color: '#34C759' },
        { name: 'notifications' as PermName, label: '通知', icon: 'ph:bell-bold', color: '#FF9500' },
        { name: 'clipboard-read' as PermName, label: '剪贴板读', icon: 'ph:clipboard-text-bold', color: '#5856D6' },
        { name: 'clipboard-write' as PermName, label: '剪贴板写', icon: 'ph:clipboard-bold', color: '#5AC8FA' },
    ];

    const permStates = reactive<Record<string, string>>({});

    async function handleQuery(name: PermName) {
        const state = await query(name);
        permStates[name] = state;
    }

    function badgeClass(state: string) {
        if (state === 'granted') return 'hook-demo__badge--success';
        if (state === 'denied') return 'hook-demo__badge--danger';
        return 'hook-demo__badge--warning';
    }

    onMounted(() => {
        permList.forEach(p => handleQuery(p.name));
    });
</script>
