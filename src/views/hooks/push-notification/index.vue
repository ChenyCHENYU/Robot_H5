<template>
    <div class="hook-demo">
        <C_NavBar title="usePushNotification" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF9500">
                <C_Icon name="ph:bell-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">推送通知</h2>
            <p class="hook-demo__header-desc">消息接收 + 通知注册</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="register('demo-token')">
                    注册推送
                </VanButton>
                <VanButton v-if="messages.length" plain size="small" @click="clearMessages">
                    清空消息
                </VanButton>
            </div>
        </div>

        <div v-if="messages.length" class="hook-demo__state">
            <p class="hook-demo__state-label">消息列表 ({{ messages.length }})</p>
            <div class="hook-demo__state-body">
                <div v-for="(msg, i) in messages" :key="i" style="margin-bottom: 8px">
                    {{ JSON.stringify(msg) }}
                </div>
            </div>
        </div>

        <div v-if="!messages.length && !loading" class="hook-demo__section">
            <div class="hook-demo__empty">暂无推送消息</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { usePushNotification } from '@robot-h5/core';

    defineOptions({ name: 'HookPushNotification' });

    const { messages, loading, error, register, clearMessages } = usePushNotification();
</script>
