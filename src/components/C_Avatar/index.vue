<template>
    <span class="c-avatar" role="img" :aria-label="alt">
        <img class="c-avatar__image" :src="defaultAvatar" alt="" aria-hidden="true" />
        <img
            v-if="src && !failed"
            :key="src"
            class="c-avatar__image c-avatar__image--custom"
            :class="{ 'c-avatar__image--loaded': loaded }"
            :src="src"
            alt=""
            aria-hidden="true"
            @load="loaded = true"
            @error="failed = true"
        />
    </span>
</template>

<script setup lang="ts">
    import './index.scss';
    import { defaultAvatar } from './data';

    defineOptions({ name: 'C_Avatar' });

    const props = withDefaults(defineProps<{ src?: string; alt?: string }>(), {
        src: '',
        alt: '用户头像',
    });
    const loaded = ref(false);
    const failed = ref(false);

    watch(() => props.src, () => {
        loaded.value = false;
        failed.value = false;
    });
</script>
