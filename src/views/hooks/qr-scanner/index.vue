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

        <!-- 环境检测 -->
        <div class="hook-demo__state">
            <p class="hook-demo__state-label">环境检测</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">摄像头 API</span>
                    <span class="hook-demo__info-value">{{ env.camera ? '✅ 支持' : '❌ 不支持' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">BarcodeDetector</span>
                    <span class="hook-demo__info-value">{{ env.barcode ? '✅ 原生支持' : '❌ 需 jsQR 库' }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">协议</span>
                    <span class="hook-demo__info-value">{{ env.protocol }}</span>
                </div>
            </div>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="scan()">
                    扫描二维码
                </VanButton>
                <VanButton size="small" :loading="loading" @click="scan({ type: 'barcode' })">
                    扫描条形码
                </VanButton>
                <VanButton plain size="small" @click="pickImage">
                    从相册识别
                </VanButton>
            </div>
        </div>

        <!-- 使用指南 -->
        <div v-if="!env.barcode" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--warning">
                <C_Icon name="ph:info-bold" :size="14" />
                浏览器不支持 BarcodeDetector
            </span>
            <div class="hook-demo__state-body" style="margin-top: 8px; font-family: inherit; font-size: 13px; line-height: 1.8">
                <strong>解决方案：</strong><br />
                1️⃣ <strong>原生 APP</strong>：通过钉钉/微信/原生桥接调用系统相机扫码<br />
                2️⃣ <strong>Chrome 83+</strong>：Android Chrome 原生支持 BarcodeDetector API<br />
                3️⃣ <strong>jsQR 库</strong>：<code>npm i jsqr</code>，h5-core 自动检测并使用
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

    const env = reactive({
        camera: !!(navigator.mediaDevices?.getUserMedia),
        barcode: 'BarcodeDetector' in window,
        protocol: location.protocol,
    });

    function pickImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                if ('BarcodeDetector' in window) {
                    const bitmap = await createImageBitmap(file);
                    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'code_128'] });
                    const results = await detector.detect(bitmap);
                    bitmap.close();
                    if (results.length > 0) {
                        (result as any).value = results[0].rawValue;
                    } else {
                        (error as any).value = new Error('未识别到二维码/条形码');
                    }
                } else {
                    (error as any).value = new Error('当前浏览器不支持 BarcodeDetector，请安装 jsQR 或使用原生 APP');
                }
            } catch (e: any) {
                (error as any).value = e;
            }
        };
        input.click();
    }
</script>
