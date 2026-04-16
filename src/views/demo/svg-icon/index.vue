<template>
    <div class="svg-page">
        <C_NavBar />
        <div class="svg-page__body">
            <VanTabs v-model:active="activeTab" shrink line-width="20" class="svg-page__tabs">
                <!-- Iconify 图标 -->
                <VanTab title="Iconify 图标" name="iconify">
                    <p class="svg-page__tip">
                        <i class="i-ph:globe-bold" />
                        基于 <code>@iconify/vue</code>，支持 200,000+ 开源图标
                    </p>
                    <div class="svg-page__grid">
                        <div
                            v-for="icon in iconifyList"
                            :key="icon.name"
                            class="svg-page__item"
                            @click="handleCopyName(icon.name)"
                        >
                            <div class="svg-page__card">
                                <div class="svg-page__card-shine" />
                                <C_Icon :name="icon.name" :size="28" color="var(--ds-accent)" />
                            </div>
                            <span class="svg-page__label">{{ icon.label }}</span>
                        </div>
                    </div>
                </VanTab>

                <!-- 本地 SVG -->
                <VanTab title="本地 SVG" name="svg">
                    <p class="svg-page__tip">
                        <i class="i-ph:folder-open-bold" />
                        SVG 文件存放于 <code>assets/svgs/</code> 目录
                    </p>
                    <div class="svg-page__grid">
                        <div v-for="name in svgList" :key="name" class="svg-page__item">
                            <div class="svg-page__card">
                                <div class="svg-page__card-shine" />
                                <C_SvgIcon class="svg-page__icon" :name="name" />
                            </div>
                            <span class="svg-page__label">{{ name }}</span>
                        </div>
                    </div>
                </VanTab>
            </VanTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { svgList, iconifyList } from './data';
    import { showToast } from 'vant';

    const activeTab = ref('iconify');

    const handleCopyName = (name: string) => {
        navigator.clipboard?.writeText(name).then(() => {
            showToast({ message: `已复制：${name}`, position: 'top' });
        });
    };
</script>
