<template>
    <div class="hook-demo">
        <C_NavBar title="useOfflineStorage" />
        <div class="hook-demo__header">
            <div class="hook-demo__header-icon" style="background: #5856D6">
                <C_Icon name="ph:database-bold" :size="28" color="#fff" />
            </div>
            <h2 class="hook-demo__header-title">离线存储</h2>
            <p class="hook-demo__header-desc">IndexedDB 键值存储 + 同步队列</p>
        </div>

        <div class="hook-demo__playground">
            <VanField v-model="inputKey" label="Key" placeholder="键名" />
            <VanField v-model="inputValue" label="Value" placeholder="键值" />
            <div class="hook-demo__btn-group" style="margin-top: 12px">
                <VanButton type="primary" size="small" :disabled="!inputKey" @click="handleSet">
                    写入
                </VanButton>
                <VanButton size="small" :disabled="!inputKey" @click="handleGet">
                    读取
                </VanButton>
                <VanButton type="danger" plain size="small" :disabled="!inputKey" @click="handleRemove">
                    删除
                </VanButton>
                <VanButton plain size="small" @click="handleRefreshKeys">
                    刷新列表
                </VanButton>
            </div>
        </div>

        <div v-if="readResult !== null" class="hook-demo__state">
            <p class="hook-demo__state-label">读取结果</p>
            <div class="hook-demo__state-body">{{ readResult }}</div>
        </div>

        <div v-if="storedKeys.length" class="hook-demo__state">
            <p class="hook-demo__state-label">已存储的键 ({{ storedKeys.length }})</p>
            <div class="hook-demo__state-body">
                <div v-for="k in storedKeys" :key="k" class="hook-demo__kv-item">
                    <span class="hook-demo__kv-key">{{ k }}</span>
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
    import { showToast } from 'vant';
    import { useOfflineStorage } from '@robot-h5/core';

    defineOptions({ name: 'HookOfflineStorage' });

    const { error, get, set, remove, keys } = useOfflineStorage({ dbName: 'hook-demo' });

    const inputKey = ref('');
    const inputValue = ref('');
    const readResult = ref<string | null>(null);
    const storedKeys = ref<string[]>([]);

    async function handleSet() {
        await set(inputKey.value, inputValue.value);
        showToast('写入成功');
        handleRefreshKeys();
    }

    async function handleGet() {
        const val = await get(inputKey.value);
        readResult.value = val !== null ? JSON.stringify(val) : '(null)';
    }

    async function handleRemove() {
        await remove(inputKey.value);
        showToast('已删除');
        handleRefreshKeys();
    }

    async function handleRefreshKeys() {
        storedKeys.value = await keys();
    }

    onMounted(() => {
        handleRefreshKeys();
    });
</script>
