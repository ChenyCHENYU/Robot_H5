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
            <VanField label="字号">
                <template #input>
                    <VanStepper v-model="fontSize" :min="12" :max="72" :step="4" />
                </template>
            </VanField>
            <VanField label="透明度">
                <template #input>
                    <VanSlider v-model="opacity" :min="10" :max="100" :step="10" />
                </template>
            </VanField>
            <VanField label="颜色">
                <template #input>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap">
                        <span
                            v-for="c in colorOptions"
                            :key="c.value"
                            :style="{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: c.value, border: fontColor === c.value ? '2px solid var(--ds-accent)' : '2px solid var(--ds-border)',
                                cursor: 'pointer',
                            }"
                            @click="fontColor = c.value"
                        />
                    </div>
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
    const opacity = ref(80);
    const fontSize = ref(28);
    const fontColor = ref('#000000');
    const resultUrl = ref('');

    const colorOptions = [
        { value: '#000000' },
        { value: '#ffffff' },
        { value: '#ff3b30' },
        { value: '#007aff' },
        { value: '#34c759' },
        { value: '#ff9500' },
    ];

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
                    fontSize: fontSize.value,
                    fontColor: fontColor.value,
                    position: 'bottomRight',
                });
                if (result) {
                    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value);
                    resultUrl.value = URL.createObjectURL(result);
                }
            }
        };
        input.click();
    }
</script>
