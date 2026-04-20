<template>
    <div class="hook-demo">
        <C_NavBar title="useLocation" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #34C759">
                <C_Icon name="ph:map-pin-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">GPS 定位</h2>
            <p class="hook-demo__header-desc">单次 / 持续定位 + 坐标展示</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="getCurrentPosition">
                    获取当前位置
                </VanButton>
                <VanButton v-if="!isWatching" size="small" @click="startWatch">
                    持续追踪
                </VanButton>
                <VanButton v-else type="danger" plain size="small" @click="stopWatchAndMark">
                    停止追踪
                </VanButton>
            </div>
        </div>

        <div v-if="position" class="hook-demo__state">
            <p class="hook-demo__state-label">坐标信息</p>
            <div class="hook-demo__state-body">
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">经度</span>
                    <span class="hook-demo__info-value">{{ position.longitude.toFixed(6) }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">纬度</span>
                    <span class="hook-demo__info-value">{{ position.latitude.toFixed(6) }}</span>
                </div>
                <div class="hook-demo__info-row">
                    <span class="hook-demo__info-label">精度</span>
                    <span class="hook-demo__info-value">{{ position.accuracy?.toFixed(1) ?? '-' }} m</span>
                </div>
            </div>
        </div>

        <div v-if="isWatching" class="hook-demo__section">
            <span class="hook-demo__badge hook-demo__badge--success">
                <C_Icon name="ph:broadcast-bold" :size="14" />
                持续追踪中
            </span>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useLocation } from '@robot-h5/core';

    defineOptions({ name: 'HookLocation' });

    const { position, loading, error, getCurrentPosition, watchPosition, stopWatch } = useLocation();
    const isWatching = ref(false);

    function startWatch() {
        watchPosition();
        isWatching.value = true;
    }

    function stopWatchAndMark() {
        stopWatch();
        isWatching.value = false;
    }
</script>
