<template>
    <div class="hook-demo">
        <C_NavBar title="useSignature" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF2D55">
                <C_Icon name="ph:pen-nib-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">手写签名</h2>
            <p class="hook-demo__header-desc">Canvas 签名板 + 撤销 + 保存</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__canvas-wrap">
                <canvas ref="canvasEl" width="640" height="320" />
            </div>
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton type="primary" size="small" :disabled="isEmpty" @click="handleSave">
                    保存签名
                </VanButton>
                <VanButton size="small" @click="undo">撤销</VanButton>
                <VanButton plain size="small" @click="clear">清除</VanButton>
            </div>
        </div>

        <div v-if="savedUrl" class="hook-demo__state">
            <p class="hook-demo__state-label">签名预览</p>
            <div class="hook-demo__state-body" style="text-align: center; padding: 16px">
                <img :src="savedUrl" style="max-width: 100%; border-radius: 8px" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useSignature } from '@robot-h5/core';

    defineOptions({ name: 'HookSignature' });

    const { isEmpty, bindCanvas, clear, save, undo } = useSignature({
        lineWidth: 3,
        strokeColor: '#000',
    });

    const canvasEl = ref<HTMLCanvasElement>();
    const savedUrl = ref('');

    onMounted(() => {
        if (canvasEl.value) {
            bindCanvas(canvasEl.value);
        }
    });

    async function handleSave() {
        const file = await save();
        if (file) {
            savedUrl.value = URL.createObjectURL(file);
        }
    }
</script>
