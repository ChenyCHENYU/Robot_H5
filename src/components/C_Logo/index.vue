<template>
    <img class="logo" :src="logoUrl" :width="size" :height="size" alt="Robot H5" />
</template>
<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'CLogo' });
    withDefaults(defineProps<{ size?: number }>(), { size: 56 });
    const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;
</script>
