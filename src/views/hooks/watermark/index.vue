<template>
    <div class="hook-demo">
        <C_NavBar title="useWatermark" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #34C759">
                <C_Icon name="ph:drop-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">图片水印</h2>
            <p class="hook-demo__header-desc">文字水印叠加 + 位置 / 透明度调节</p>
        </div>

        <div class="hook-demo__playground">
            <VanField v-model="watermarkText" label="水印文字" placeholder="输入水印文字" />
            <VanField label="透明度">
                <template #input>
                    <VanSlider v-model="opacity" :min="10" :max="100" :step="10" />
                </template>
            </VanField>
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton type="primary" size="small" :loading="loading" @click="pickAndWatermark">
                    选择图片并添加水印
                </VanButton>
            </div>
        </div>

        <div v-if="resultUrl" class="hook-demo__state">
            <p class="hook-demo__state-label">水印效果</p>
            <div class="hook-demo__state-body" style="padding: 8px; text-align: center">
                <img :src="resultUrl" class="hook-demo__result-img" />
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
    import { useWatermark } from '@robot-h5/core';

    defineOptions({ name: 'HookWatermark' });

    const watermarkText = ref('Robot H5 水印');
    const opacity = ref(50);
    const resultUrl = ref('');

    const { loading, error, addWatermark } = useWatermark();

    function pickAndWatermark() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const result = await addWatermark(file, {
                    text: watermarkText.value,
                    opacity: opacity.value / 100,
                    position: 'bottomRight',
                });
                if (result) {
                    resultUrl.value = URL.createObjectURL(result);
                }
            }
        };
        input.click();
    }
</script>
