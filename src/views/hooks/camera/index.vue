<template>
    <div class="hook-demo">
        <C_NavBar title="useCamera" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #007AFF">
                <C_Icon name="ph:camera-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">拍照相册</h2>
            <p class="hook-demo__header-desc">拍照 / 相册选取 + 自动压缩</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="capture()">
                    拍照
                </VanButton>
                <VanButton size="small" :loading="loading" @click="capture({ source: 'album' })">
                    从相册选取
                </VanButton>
                <VanButton v-if="preview" plain size="small" @click="clear">清除</VanButton>
            </div>
            <div v-if="preview" class="hook-demo__result">
                <img :src="preview" class="hook-demo__result-img" />
            </div>
        </div>

        <div v-if="photo" class="hook-demo__state">
            <p class="hook-demo__state-label">文件信息</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">文件名</span>
                    <span class="hook-demo__info-value">{{ photo.name }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">大小</span>
                    <span class="hook-demo__info-value">{{ formatSize(photo.size) }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">类型</span>
                    <span class="hook-demo__info-value">{{ photo.type }}</span>
                </div>
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
    import { useCamera } from '@robot-h5/core';

    defineOptions({ name: 'HookCamera' });

    const { photo, preview, loading, error, capture, clear } = useCamera();

    function formatSize(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
</script>
