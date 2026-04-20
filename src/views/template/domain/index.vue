<template>
    <div class="template-domain">
        <C_NavBar :title="currentDomain?.name || '模板模块'" />
        <div class="template-domain__body">
            <VanEmpty
                image="search"
                :description="`${currentDomain?.name || '该领域'}模块开发中`"
            />
            <p class="template-domain__hint">后续将陆续补充业务页面模板</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { domainList } from '../data';

    defineOptions({ name: 'TemplateDomain' });

    const route = useRoute();
    const currentDomain = computed(() =>
        domainList.find(d => d.slug === route.params.domain),
    );
</script>
