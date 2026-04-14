<script setup lang="ts">
    import './index.scss';
    import { svgList } from './data';
</script>

<template>
    <div class="svg-page">
        <CNavBar />
        <div class="svg-page__body">
            <p class="svg-page__tip">
                <i class="i-ph:folder-open-bold" />
                SVG 文件存放于 <code>assets/svgs/</code> 目录
            </p>
            <div class="svg-page__grid">
                <div v-for="name in svgList" :key="name" class="svg-page__item">
                    <div class="svg-page__card">
                        <div class="svg-page__card-shine" />
                        <CSvgIcon class="svg-page__icon" :name="name" />
                    </div>
                    <span class="svg-page__label">{{ name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
