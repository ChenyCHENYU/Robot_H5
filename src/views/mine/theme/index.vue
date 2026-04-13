<template>
    <div class="theme-page">
        <CNavBar />

        <div class="theme-page__body">
            <div class="theme-page__section">
                <h3 class="theme-page__section-title">外观</h3>
                <div class="theme-page__group">
                    <van-cell center title="暗黑模式" class="theme-page__cell">
                        <template #right-icon>
                            <van-switch v-model="toggleTheme" size="22" />
                        </template>
                    </van-cell>
                </div>
            </div>

            <div class="theme-page__section">
                <h3 class="theme-page__section-title">主题色</h3>
                <div class="theme-page__colors">
                    <span
                        v-for="(item, index) in themeStore.themeColorList"
                        :key="index"
                        class="theme-page__color-dot"
                        :style="{ background: item }"
                        @click="togTheme(item)"
                    >
                        <i
                            v-show="item === themeStore.themeColor"
                            class="i-ph:check-bold"
                            style="color: #fff; font-size: 16px"
                        />
                    </span>
                </div>
            </div>

            <div class="theme-page__section">
                <h3 class="theme-page__section-title">动画</h3>
                <div class="theme-page__group">
                    <van-cell center title="页面切换动画" class="theme-page__cell">
                        <template #right-icon>
                            <van-switch v-model="themeStore.isPageAnimate" size="22" />
                        </template>
                    </van-cell>
                    <van-cell center title="动画类型" class="theme-page__cell">
                        <van-field
                            v-model="animateState.text"
                            readonly
                            class="!p-0"
                            :disabled="!themeStore.isPageAnimate"
                            is-link
                            input-align="right"
                            :center="true"
                            :border="false"
                            @click="openAnimatePick"
                        />
                    </van-cell>
                </div>
            </div>
        </div>

        <van-popup v-model:show="animateState.showPicker" position="bottom" round>
            <van-picker
                v-model="animateState.value"
                :columns="animateOptions"
                @confirm="handleSaveAnimateType"
                @cancel="animateState.showPicker = false"
            />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useThemeStore } from '@/store/modules/theme';
    import { useTheme } from '@/hooks/useTheme';
    import { animates as animateOptions } from '@/utils/const/theme';

    const { toggleTheme } = useTheme();

    const themeStore = useThemeStore();

    function togTheme(color: string) {
        themeStore.themeColor = color;
    }

    const findCurrentAnimateType = animateOptions.find(item => item.value === themeStore.pageAnimateType);

    const animateState = reactive({
        text: findCurrentAnimateType?.text,
        value: [themeStore.pageAnimateType],
        showPicker: false,
    });

    function openAnimatePick() {
        if (themeStore.isPageAnimate) {
            animateState.showPicker = true;
        }
    }

    function handleSaveAnimateType({ selectedOptions }) {
        animateState.text = selectedOptions[0].text;
        themeStore.setPageAnimateType(selectedOptions[0].value);
        animateState.showPicker = false;
    }
</script>
