<template>
    <div class="hook-demo">
        <C_NavBar title="useNfc" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #FF9500">
                <C_Icon name="ph:contactless-payment-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">NFC</h2>
            <p class="hook-demo__header-desc">NFC 标签读写</p>
        </div>

        <div class="hook-demo__playground">
            <div class="hook-demo__btn-group">
                <VanButton type="primary" size="small" :loading="loading" @click="read">
                    读取 NFC 标签
                </VanButton>
            </div>
        </div>

        <div v-if="data" class="hook-demo__state">
            <p class="hook-demo__state-label">标签数据</p>
            <div class="hook-demo__state-body">{{ JSON.stringify(data, null, 2) }}</div>
        </div>

        <div v-if="error" class="hook-demo__state">
            <p class="hook-demo__state-label">错误</p>
            <div class="hook-demo__state-body">{{ error.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useNfc } from '@robot-h5/core';

    defineOptions({ name: 'HookNfc' });

    const { data, loading, error, read } = useNfc();
</script>
