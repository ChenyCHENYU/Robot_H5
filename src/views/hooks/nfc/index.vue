<template>
    <div class="hook-demo">
        <C_NavBar title="useNfc" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF9500">
                <C_Icon name="ph:contactless-payment-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">NFC</h2>
            <p class="hook-demo__header-desc">NFC 标签读写</p>
        </div>

        <!-- 环境检测 -->
        <div class="hook-demo__state">
            <p class="hook-demo__state-label">环境检测</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">Web NFC API</span>
                    <span class="hook-demo__info-value">{{ env.nfc ? '✅ 支持' : '❌ 不支持' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">协议</span>
                    <span class="hook-demo__info-value">{{ env.protocol }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">浏览器</span>
                    <span class="hook-demo__info-value">{{ env.browser }}</span>
                </div>
            </div>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" :disabled="!env.nfc" @click="read">
                    读取 NFC 标签
                </VanButton>
            </div>
        </div>

        <!-- 使用指南 -->
        <div v-if="!env.nfc" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--danger">
                <C_Icon name="ph:warning-bold" :size="14" />
                当前浏览器不支持 NFC
            </span>
            <div class="hook-demo__state-body" style="margin-top: 8px; font-family: inherit; font-size: 13px; line-height: 1.8">
                <strong>NFC 功能要求：</strong><br />
                📱 <strong>设备</strong>：仅支持 Android 手机（有 NFC 硬件）<br />
                🌐 <strong>浏览器</strong>：Chrome 89+ for Android<br />
                🔒 <strong>协议</strong>：必须 HTTPS（localhost 除外）<br />
                ⚙️ <strong>实验特性</strong>：chrome://flags → #enable-web-nfc → Enabled<br />
                <br />
                <strong>替代方案：</strong><br />
                1️⃣ 钉钉/微信小程序：内置 NFC 插件<br />
                2️⃣ 原生 APP：通过 Bridge 调用系统 NFC 接口<br />
                <br />
                <em style="color: var(--ds-text-tertiary)">⚠ iOS 完全不支持 Web NFC（Safari 未实现此 API）</em>
            </div>
        </div>

        <div v-if="data" class="hook-demo__state">
            <p class="hook-demo__state-label">标签数据</p>
            <div class="hook-demo__state-body">{{ JSON.stringify(data, null, 2) }}</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useNfc } from '@robot-h5/core';

    defineOptions({ name: 'HookNfc' });

    const { data, loading, error, read } = useNfc();

    const env = reactive({
        nfc: 'NDEFReader' in window,
        protocol: location.protocol,
        browser: /Chrome\/(\d+)/.test(navigator.userAgent)
            ? `Chrome ${RegExp.$1}`
            : /Safari/.test(navigator.userAgent) ? 'Safari (不支持)' : navigator.userAgent.slice(0, 30),
    });
</script>
