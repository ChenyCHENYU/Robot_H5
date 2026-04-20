<template>
    <div class="hook-demo">
        <C_NavBar title="useVideoRecorder" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF9500">
                <C_Icon name="ph:film-strip-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">视频录制</h2>
            <p class="hook-demo__header-desc">实时预览 + 录制 + 回放</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__video-wrap">
                <video ref="previewEl" autoplay muted playsinline />
            </div>

            <p class="hook-demo__duration">{{ formatDuration(duration) }}</p>

            <div class="hook-demo__btn-group" style="justify-content: center">
                <VanButton
                    v-if="!isRecording"
                    type="danger"
                    size="small"
                    @click="start"
                >
                    开始录制
                </VanButton>
                <VanButton v-else type="primary" size="small" @click="handleStop">
                    停止录制
                </VanButton>
            </div>
        </div>

        <div v-if="playbackUrl" class="hook-demo__state">
            <p class="hook-demo__state-label">录制回放</p>
            <div class="hook-demo__state-body" style="padding: 0; overflow: hidden; border-radius: 12px">
                <video :src="playbackUrl" controls playsinline style="width: 100%; display: block" />
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
    import { useVideoRecorder } from '@robot-h5/core';

    defineOptions({ name: 'HookVideoRecorder' });

    const { isRecording, duration, stream, error, start, stop } = useVideoRecorder();
    const previewEl = ref<HTMLVideoElement>();
    const playbackUrl = ref('');

    watch(stream, (s) => {
        if (previewEl.value && s) {
            previewEl.value.srcObject = s;
        }
    });

    async function handleStop() {
        const blob = await stop();
        if (blob) {
            playbackUrl.value = URL.createObjectURL(blob);
        }
        if (previewEl.value) {
            previewEl.value.srcObject = null;
        }
    }

    function formatDuration(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
</script>
