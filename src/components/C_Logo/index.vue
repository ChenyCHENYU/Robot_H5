<template>
    <div class="logo" :style="{ width: size + 'px', height: size + 'px' }">
        <div class="logo__inner">
            <i class="i-ph:rocket-launch-bold logo__icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'CLogo' });

    withDefaults(defineProps<{ size?: number }>(), { size: 56 });
</script>
