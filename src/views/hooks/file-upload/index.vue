<template>
    <div class="hook-demo">
        <C_NavBar title="useFileUpload" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #0071E3">
                <C_Icon name="ph:cloud-arrow-up-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">文件上传</h2>
            <p class="hook-demo__header-desc">分片上传 + 进度条 + 断点续传</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" @click="pickFile">
                    选择文件
                </VanButton>
                <VanButton
                    v-if="uploading"
                    type="danger"
                    plain
                    size="small"
                    @click="abort"
                >
                    取消上传
                </VanButton>
            </div>

            <div v-if="selectedFile" style="margin-top: 12px">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">{{ selectedFile.name }}</span>
                    <span class="hook-demo__info-value">{{ formatSize(selectedFile.size) }}</span>
                </div>
            </div>

            <div v-if="uploading || progress.percent > 0" class="hook-demo__progress">
                <div class="hook-demo__progress-fill" :style="{ width: `${progress.percent}%` }" />
            </div>
            <p v-if="uploading || progress.percent > 0" style="font-size: 13px; color: var(--ds-text-secondary); margin-top: 8px; text-align: center">
                {{ progress.percent.toFixed(1) }}%
            </p>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useFileUpload } from '@robot-h5/core';

    defineOptions({ name: 'HookFileUpload' });

    const { progress, uploading, error, upload, abort } = useFileUpload();
    const selectedFile = ref<File | null>(null);

    function pickFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                selectedFile.value = file;
                upload(file);
            }
        };
        input.click();
    }

    function formatSize(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
</script>
