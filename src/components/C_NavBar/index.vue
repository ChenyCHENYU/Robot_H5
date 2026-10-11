<template>
    <VanNavBar v-if="!isMbaseHosted()" @click-left="onBack" placeholder fixed>
        <template #title>
            {{ getTitle }}
        </template>

        <template #left>
            <button type="button" class="c-navbar__back" aria-label="返回">
                <i class="i-ph:caret-left-bold c-navbar__back-icon" />
            </button>
        </template>

        <template #right>
            <slot name="right" />
        </template>
    </VanNavBar>
</template>

<script setup lang="ts">
    import './index.scss';
    import { isMbaseHosted } from '@/platform/mbase';

    defineOptions({ name: 'CNavBar' });

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
    });

    const route = useRoute();

    const getTitle = computed(() => props.title || (route.meta.title as string));

    const router = useRouter();
    const onBack = () => {
        if (window.history.state?.back) router.back();
        else void router.replace('/dashboard');
    };
</script>
