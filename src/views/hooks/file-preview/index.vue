<template>
    <div class="hook-demo">
        <C_NavBar title="useFilePreview" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #8E8E93">
                <C_Icon name="ph:eye-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">文件预览</h2>
            <p class="hook-demo__header-desc">PDF / Office / 图片在线预览</p>
        </div>

        <div class="hook-demo__playground">
            <VanField
                v-model="previewUrl"
                label="URL"
                placeholder="输入文件地址"
                clearable
            />
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton
                    type="primary"
                    size="small"
                    :loading="loading"
                    :disabled="!previewUrl"
                    @click="preview(previewUrl)"
                >
                    预览文件
                </VanButton>
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
    import { useFilePreview } from '@robot-h5/core';

    defineOptions({ name: 'HookFilePreview' });

    const { loading, error, preview } = useFilePreview();
    const previewUrl = ref('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
</script>
