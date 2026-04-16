<template>
    <VanNavBar @click-left="onBack()" placeholder fixed>
        <template #title>
            {{ getTitle }}
        </template>

        <template #left>
            <span class="c-navbar__back">
                <i class="i-ph:caret-left-bold c-navbar__back-icon" />
            </span>
        </template>

        <template #right>
            <slot name="right" />
        </template>
    </VanNavBar>
</template>

<script setup lang="ts">
    import './index.scss';
    import JsCallNative from '@/services/jsCallNative';

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
    });

    const route = useRoute();

    const getTitle = computed(() => props.title || (route.meta.title as string));

    const onBack = () => JsCallNative.back();
</script>
