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
                    <VanStepper v-model="fontSize" :min="12" :max="120" :step="4" />
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
            <VanField label="位置">
                <template #input>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap">
                        <VanTag
                            v-for="p in positionOptions"
                            :key="p.value"
                            :type="position === p.value ? 'primary' : 'default'"
                            round
                            size="medium"
                            style="cursor: pointer"
                            @click="position = p.value"
                        >
                            {{ p.label }}
                        </VanTag>
                    </div>
                </template>
            </VanField>
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton type="primary" size="small" :loading="processing" @click="pickAndWatermark">
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

        <div v-if="errorMsg" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ errorMsg }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';

    defineOptions({ name: 'HookWatermark' });

    const watermarkText = ref('Robot H5 水印');
    const opacity = ref(80);
    const fontSize = ref(48);
    const fontColor = ref('#ff3b30');
    const position = ref('bottomRight');
    const resultUrl = ref('');
    const processing = ref(false);
    const errorMsg = ref('');

    const colorOptions = [
        { value: '#000000' },
        { value: '#ffffff' },
        { value: '#ff3b30' },
        { value: '#007aff' },
        { value: '#34c759' },
        { value: '#ff9500' },
    ];

    const positionOptions = [
        { value: 'topLeft', label: '左上' },
        { value: 'topRight', label: '右上' },
        { value: 'center', label: '居中' },
        { value: 'bottomLeft', label: '左下' },
        { value: 'bottomRight', label: '右下' },
    ];

    /** 纯前端 Canvas 水印 — 不依赖 @robot-h5/core */
    async function applyWatermark(file: File): Promise<Blob | null> {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d')!;

        // 绘制原图
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        // 绘制水印 —— 带描边让文字在任何底色上都可见
        const text = watermarkText.value || '';
        if (!text) return canvasToBlob(canvas, file.type);

        const size = fontSize.value;
        ctx.globalAlpha = opacity.value / 100;
        ctx.font = `bold ${size}px sans-serif`;
        ctx.fillStyle = fontColor.value;
        ctx.strokeStyle = fontColor.value === '#ffffff' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
        ctx.lineWidth = Math.max(2, size / 16);
        ctx.lineJoin = 'round';

        const metrics = ctx.measureText(text);
        const tw = metrics.width;
        const pad = size * 0.6;

        let x = pad;
        let y = pad + size;
        switch (position.value) {
            case 'topRight':
                x = canvas.width - tw - pad;
                break;
            case 'bottomLeft':
                y = canvas.height - pad;
                break;
            case 'bottomRight':
                x = canvas.width - tw - pad;
                y = canvas.height - pad;
                break;
            case 'center':
                x = (canvas.width - tw) / 2;
                y = (canvas.height + size) / 2;
                break;
        }

        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);

        return canvasToBlob(canvas, file.type);
    }

    function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
        return new Promise(resolve => canvas.toBlob(resolve, type || 'image/jpeg', 0.92));
    }

    function pickAndWatermark() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            processing.value = true;
            errorMsg.value = '';
            try {
                const blob = await applyWatermark(file);
                if (blob) {
                    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value);
                    resultUrl.value = URL.createObjectURL(blob);
                }
            } catch (e: any) {
                errorMsg.value = e.message || String(e);
            } finally {
                processing.value = false;
            }
        };
        input.click();
    }
</script>
