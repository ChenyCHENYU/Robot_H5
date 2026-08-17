<template>
    <div class="hook-demo">
        <C_NavBar title="useFileDownload" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #5AC8FA">
                <C_Icon name="ph:cloud-arrow-down-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">文件下载</h2>
            <p class="hook-demo__header-desc">流式下载 + 进度跟踪</p>
        </div>

        <div class="hook-demo__playground">
            <VanField
                v-model="downloadUrl"
                label="URL"
                placeholder="输入文件下载地址"
                clearable
            />
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton
                    type="primary"
                    size="small"
                    :loading="downloading"
                    :disabled="!downloadUrl"
                    @click="download(downloadUrl)"
                >
                    开始下载
                </VanButton>
                <VanButton
                    v-if="downloading"
                    type="danger"
                    plain
                    size="small"
                    @click="abort"
                >
                    取消
                </VanButton>
            </div>

            <div v-if="downloading || progress.percent > 0" class="hook-demo__progress">
                <div class="hook-demo__progress-fill" :style="{ width: `${progress.percent}%` }" />
            </div>
            <p v-if="downloading || progress.percent > 0" style="font-size: 13px; color: var(--ds-text-secondary); margin-top: 8px; text-align: center">
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
    import { useFileDownload } from '@robot-h5/core';

    defineOptions({ name: 'HookFileDownload' });

    const { progress, downloading, error, download, abort } = useFileDownload();
    const downloadUrl = ref('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
</script>
