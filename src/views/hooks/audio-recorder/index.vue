<template>
    <div class="hook-demo">
        <C_NavBar title="useAudioRecorder" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF3B30">
                <C_Icon name="ph:microphone-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">录音</h2>
            <p class="hook-demo__header-desc">录音 + 暂停恢复 + 播放</p>
        </div>

        <div class="hook-demo__playground">
            <p class="hook-demo__duration">{{ formatDuration(duration) }}</p>

            <div v-if="isRecording" style="text-align: center; margin-bottom: 12px">
                <span :class="['hook-demo__badge', isPaused ? 'hook-demo__badge--warning' : 'hook-demo__badge--danger']">
                    {{ isPaused ? '已暂停' : '录音中' }}
                </span>
            </div>

            <div class="hook-demo__btn-group" style="justify-content: center">
                <VanButton
                    v-if="!isRecording"
                    type="danger"
                    size="small"
                    @click="start"
                >
                    开始录音
                </VanButton>
                <template v-else>
                    <VanButton
                        size="small"
                        @click="isPaused ? resume() : pause()"
                    >
                        {{ isPaused ? '继续' : '暂停' }}
                    </VanButton>
                    <VanButton type="primary" size="small" @click="handleStop">
                        停止
                    </VanButton>
                </template>
            </div>
        </div>

        <div v-if="audioUrl" class="hook-demo__state">
            <p class="hook-demo__state-label">录音回放</p>
            <div class="hook-demo__state-body" style="padding: 12px">
                <audio :src="audioUrl" controls style="width: 100%" />
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
    import { useAudioRecorder } from '@robot-h5/core';

    defineOptions({ name: 'HookAudioRecorder' });

    const { isRecording, isPaused, duration, error, start, stop, pause, resume } = useAudioRecorder();
    const audioUrl = ref('');

    async function handleStop() {
        const blob = await stop();
        if (blob) {
            audioUrl.value = URL.createObjectURL(blob);
        }
    }

    function formatDuration(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
</script>
