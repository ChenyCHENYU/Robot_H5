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

        <!-- 环境检测 -->
        <div class="hook-demo__state">
            <p class="hook-demo__state-label">环境检测</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">Notification API</span>
                    <span class="hook-demo__info-value">{{ envInfo.notification ? '✅ 支持' : '❌ 不支持' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">Service Worker</span>
                    <span class="hook-demo__info-value">{{ envInfo.serviceWorker ? '✅ 支持' : '❌ 不支持' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">Push API</span>
                    <span class="hook-demo__info-value">{{ envInfo.pushManager ? '✅ 支持' : '❌ 不支持' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">协议</span>
                    <span class="hook-demo__info-value">{{ envInfo.protocol }}</span>
                </div>
                <div v-if="notificationPermission" class="hook-demo__info-row">
                    <span class="hook-demo__info-label">通知权限</span>
                    <span class="hook-demo__info-value">{{ permissionLabel }}</span>
                </div>
            </div>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <!-- Push API 注册（需要完整环境） -->
                <VanButton
                    type="primary"
                    size="small"
                    :loading="loading"
                    :disabled="!envInfo.pushManager"
                    @click="register('demo-token')"
                >
                    注册推送
                </VanButton>
                <!-- 浏览器本地通知（降级方案） -->
                <VanButton
                    size="small"
                    :disabled="!envInfo.notification"
                    @click="sendLocalNotification"
                >
                    发送本地通知
                </VanButton>
                <VanButton v-if="messages.length" plain size="small" @click="clearMessages">
                    清空消息
                </VanButton>
            </div>
        </div>

        <!-- 提示信息 -->
        <div v-if="!envInfo.pushManager" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--warning">
                <C_Icon name="ph:info-bold" :size="14" />
                Push API 需要 HTTPS + Service Worker
            </span>
        </div>

        <div v-if="messages.length" class="hook-demo__state">
            <p class="hook-demo__state-label">消息列表 ({{ messages.length }})</p>
            <div class="hook-demo__state-body">
                <div v-for="(msg, i) in messages" :key="i" style="margin-bottom: 8px">
                    <strong>{{ msg.title }}</strong><br />
                    <span>{{ msg.body }}</span>
                    <span style="opacity: 0.5; margin-left: 8px">{{ formatTime(msg.timestamp) }}</span>
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
    const notificationPermission = ref('');

    const envInfo = reactive({
        notification: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        protocol: location.protocol,
    });

    const permissionLabel = computed(() => {
        const map: Record<string, string> = {
            granted: '✅ 已授权',
            denied: '🚫 已拒绝',
            default: '⏳ 未授权',
        };
        return map[notificationPermission.value] || notificationPermission.value;
    });

    function formatTime(ts: number) {
        return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    async function sendLocalNotification() {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'default') {
            const perm = await Notification.requestPermission();
            notificationPermission.value = perm;
            if (perm !== 'granted') return;
        } else if (Notification.permission !== 'granted') {
            notificationPermission.value = Notification.permission;
            return;
        }

        const title = 'Robot H5 通知';
        const body = `测试消息 — ${new Date().toLocaleTimeString('zh-CN')}`;
        new Notification(title, { body, icon: '/favicon.ico' });
        messages.value.push({ title, body, timestamp: Date.now() });
        notificationPermission.value = Notification.permission;
    }

    onMounted(() => {
        if ('Notification' in window) {
            notificationPermission.value = Notification.permission;
        }
    });
</script>
