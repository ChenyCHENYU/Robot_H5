<script setup lang="ts">
    import './index.scss';
    import { useOpenInstall } from '@/hooks/useOpeninstall';

    const { openInstall } = useOpenInstall('3rqhu6');

    const onInstall = () => openInstall.value?.install();
    const onWakeup = () => openInstall.value?.schemeWakeup();
    const onWakeupOrInstall = () => openInstall.value?.wakeupOrInstall();

    const actions = [
        { icon: 'i-ph:device-mobile-bold', color: '#0071e3', title: '安装 App', desc: '调用此方法可安装 APP', handler: onInstall },
        { icon: 'i-ph:arrow-square-out-bold', color: '#34c759', title: '唤起 App', desc: '在已安装情况下唤起 APP', handler: onWakeup },
        { icon: 'i-ph:rocket-launch-bold', color: '#5856d6', title: '唤起或安装', desc: '自动判断唤起或安装 APP', handler: onWakeupOrInstall },
    ];
</script>

<template>
    <div class="oi-page">
        <CNavBar />
        <div class="oi-page__body">
            <div class="oi-page__hero">
                <div class="oi-page__hero-shine" />
                <div class="oi-page__hero-icon"><i class="i-ph:rocket-launch-bold" /></div>
                <div>
                    <h2 class="oi-page__hero-title">OpenInstall</h2>
                    <p class="oi-page__hero-desc">统一 App 安装 & 唤起方案</p>
                </div>
            </div>
            <div class="oi-page__list">
                <div
                    v-for="action in actions" :key="action.title"
                    class="oi-page__item"
                    @click="action.handler"
                >
                    <div class="oi-page__item-icon" :style="{ background: action.color }">
                        <i :class="action.icon" />
                    </div>
                    <div class="oi-page__item-text">
                        <span class="oi-page__item-title">{{ action.title }}</span>
                        <span class="oi-page__item-desc">{{ action.desc }}</span>
                    </div>
                    <i class="i-ph:caret-right-bold oi-page__item-arrow" />
                </div>
            </div>
        </div>
    </div>
</template>
