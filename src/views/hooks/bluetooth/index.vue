<template>
    <div class="hook-demo">
        <C_NavBar title="useBluetooth" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #007AFF">
                <C_Icon name="ph:bluetooth-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">蓝牙连接</h2>
            <p class="hook-demo__header-desc">扫描设备 + 配对连接</p>
        </div>

        <div class="hook-demo__playground">
            <div style="text-align: center; margin-bottom: 12px">
                <span :class="['hook-demo__badge', connected ? 'hook-demo__badge--success' : 'hook-demo__badge--info']">
                    {{ connected ? '已连接' : '未连接' }}
                </span>
            </div>

            <div class="hook-demo__btn-group" style="justify-content: center">
                <VanButton
                    v-if="!connected"
                    type="primary"
                    size="small"
                    :loading="loading"
                    @click="connect('')"
                >
                    搜索设备
                </VanButton>
                <VanButton v-else type="danger" plain size="small" @click="disconnect">
                    断开连接
                </VanButton>
            </div>
        </div>

        <div v-if="device" class="hook-demo__state">
            <p class="hook-demo__state-label">设备信息</p>
            <div class="hook-demo__state-body">{{ JSON.stringify(device, null, 2) }}</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useBluetooth } from '@robot-h5/core';

    defineOptions({ name: 'HookBluetooth' });

    const { device, connected, loading, error, connect, disconnect } = useBluetooth();
</script>
