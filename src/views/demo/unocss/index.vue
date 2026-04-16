<script setup lang="ts">
    import './index.scss';
    import { iconList } from './data';

    const addAnimation = () => {
        document.querySelector('.unocss-demo__text')?.classList.add('animate-bounce-alt', 'animate-count-infinite', 'animate-duration-1s');
    };
    const removeAnimation = () => {
        document.querySelector('.unocss-demo__text')?.classList.remove('animate-bounce-alt', 'animate-count-infinite', 'animate-duration-1s');
    };
    const changeFont = () => {
        document.querySelector('.unocss-demo__text')?.classList.add('font-msz');
    };
    const resetFont = () => {
        document.querySelector('.unocss-demo__text')?.classList.remove('font-msz');
    };
</script>

<template>
    <div class="unocss-page">
        <C_NavBar />
        <div class="unocss-page__body">

            <div class="unocss-page__section">
                <h3 class="unocss-page__section-title">动画演示</h3>
                <div class="unocss-page__card">
                    <div class="unocss-page__card-shine" />
                    <span class="unocss-demo__text">即时按需的原子 CSS 引擎</span>
                    <div class="unocss-page__btn-row">
                        <VanButton size="small" type="primary" @click="addAnimation">添加动画</VanButton>
                        <VanButton size="small" type="default" @click="removeAnimation">移除动画</VanButton>
                        <VanButton size="small" type="warning" @click="changeFont">切换字体</VanButton>
                        <VanButton size="small" type="default" @click="resetFont">重置字体</VanButton>
                    </div>
                </div>
            </div>

            <div class="unocss-page__section">
                <h3 class="unocss-page__section-title">CSS 图标</h3>
                <div class="unocss-page__card">
                    <div class="unocss-page__card-shine" />
                    <div class="unocss-page__icon-row">
                        <div v-for="icon in iconList" :key="icon" class="unocss-page__icon-box">
                            <i :class="icon" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="unocss-page__section">
                <h3 class="unocss-page__section-title">文本截断</h3>
                <div class="unocss-page__card">
                    <div class="unocss-page__card-shine" />
                    <p class="unocss-page__label">line-clamp-2 截断多行文本</p>
                    <p class="line-clamp-2 unocss-page__clamp-text">
                        Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt
                        deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad.
                        Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum.
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>
