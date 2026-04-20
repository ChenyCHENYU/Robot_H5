<template>
    <div class="hook-demo">
        <C_NavBar title="useQrScanner" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #5856D6">
                <C_Icon name="ph:qr-code-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">扫码识别</h2>
            <p class="hook-demo__header-desc">二维码 / 条形码扫描</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="scan()">
                    扫描二维码
                </VanButton>
                <VanButton size="small" :loading="loading" @click="scan({ type: 'barcode' })">
                    扫描条形码
                </VanButton>
            </div>
        </div>

        <div v-if="result" class="hook-demo__state">
            <p class="hook-demo__state-label">扫描结果</p>
            <div class="hook-demo__state-body">{{ result }}</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useQrScanner } from '@robot-h5/core';

    defineOptions({ name: 'HookQrScanner' });

    const { result, loading, error, scan } = useQrScanner();
</script>
