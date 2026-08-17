<template>
    <div class="theme-page">
        <C_NavBar />

        <div class="theme-page__body">
            <!-- 外观模式 -->
            <div class="theme-page__section">
                <h3 class="theme-page__section-title">外观</h3>
                <div class="theme-page__group">
                    <VanCell center title="跟随系统" class="theme-page__cell">
                        <template #icon>
                            <div class="theme-page__cell-icon" style="background:#5856d6">
                                <i class="i-ph:device-mobile-bold" />
                            </div>
                        </template>
                        <template #right-icon>
                            <VanSwitch v-model="followSystem" size="22" @change="handleFollowSystem" />
                        </template>
                    </VanCell>
                    <VanCell center title="暗黑模式" class="theme-page__cell">
                        <template #icon>
                            <div class="theme-page__cell-icon" style="background:#1c1c1e">
                                <i class="i-ph:moon-bold" />
                            </div>
                        </template>
                        <template #right-icon>
                            <VanSwitch v-model="toggleTheme" size="22" :disabled="followSystem" />
                        </template>
                    </VanCell>
                </div>
            </div>

            <!-- 主题色 -->
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
                <!-- 主题色预览卡片 -->
                <div class="theme-page__preview" :style="{ '--preview-color': themeStore.themeColor }">
                    <div class="theme-page__preview-shine" />
                    <div class="theme-page__preview-header">
                        <div class="theme-page__preview-dot" />
                        <span class="theme-page__preview-title">预览效果</span>
                    </div>
                    <div class="theme-page__preview-row">
                        <VanButton size="small" :color="themeStore.themeColor" round>主要按钮</VanButton>
                        <VanButton size="small" :color="themeStore.themeColor" round plain>次要按钮</VanButton>
                        <VanTag :color="themeStore.themeColor" round size="medium">标签</VanTag>
                    </div>
                </div>
            </div>

            <!-- 字体大小 -->
            <div class="theme-page__section">
                <h3 class="theme-page__section-title">字体大小</h3>
                <div class="theme-page__group">
                    <div class="theme-page__font-row">
                        <span class="theme-page__font-label" style="font-size:12px">A</span>
                        <VanSlider
                            v-model="fontScale"
                            :min="85"
                            :max="115"
                            :step="15"
                            bar-height="3px"
                            active-color="var(--ds-accent)"
                            @change="handleFontScale"
                        />
                        <span class="theme-page__font-label" style="font-size:20px">A</span>
                    </div>
                    <p class="theme-page__font-hint">
                        {{ fontScaleLabel }}
                    </p>
                </div>
            </div>

            <!-- 页面动画 -->
            <div class="theme-page__section">
                <h3 class="theme-page__section-title">动画</h3>
                <div class="theme-page__group">
                    <VanCell center title="页面切换动画" class="theme-page__cell">
                        <template #icon>
                            <div class="theme-page__cell-icon" style="background:#ff9500">
                                <i class="i-ph:sparkle-bold" />
                            </div>
                        </template>
                        <template #right-icon>
                            <VanSwitch v-model="themeStore.isPageAnimate" size="22" />
                        </template>
                    </VanCell>
                    <VanCell center title="动画类型" class="theme-page__cell">
                        <template #icon>
                            <div class="theme-page__cell-icon" style="background:#34c759">
                                <i class="i-ph:play-bold" />
                            </div>
                        </template>
                        <VanField
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
                    </VanCell>
                </div>
            </div>
        </div>

        <VanPopup v-model:show="animateState.showPicker" position="bottom" round>
            <VanPicker
                v-model="animateState.value"
                :columns="animateOptions"
                @confirm="handleSaveAnimateType"
                @cancel="animateState.showPicker = false"
            />
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useThemeStore } from '@/store/modules/theme';
    import { useTheme } from '@/hooks/useTheme';
    import { animates as animateOptions } from '@/utils/const/theme';

    const { toggleTheme } = useTheme();
    const themeStore = useThemeStore();

    // ---- 跟随系统 ----
    const followSystem = ref(themeStore.followSystem);
    let systemDarkMQ: MediaQueryList | null = null;

    function syncSystemTheme(e: MediaQueryListEvent | MediaQueryList) {
        const shouldDark = 'matches' in e ? e.matches : false;
        const current = themeStore.getThemeMode;
        if ((shouldDark && current === 'light') || (!shouldDark && current === 'dark')) {
            toggleTheme.value = shouldDark;
        }
    }

    function handleFollowSystem(val: boolean) {
        themeStore.setFollowSystem(val);
        if (val) {
            systemDarkMQ = window.matchMedia('(prefers-color-scheme: dark)');
            syncSystemTheme(systemDarkMQ);
            systemDarkMQ.addEventListener('change', syncSystemTheme);
        } else {
            systemDarkMQ?.removeEventListener('change', syncSystemTheme);
            systemDarkMQ = null;
        }
    }

    onMounted(() => {
        if (followSystem.value) handleFollowSystem(true);
    });

    onUnmounted(() => {
        systemDarkMQ?.removeEventListener('change', syncSystemTheme);
    });

    // ---- 主题色 ----
    function togTheme(color: string) {
        themeStore.themeColor = color;
    }

    // ---- 字体大小 ----
    const fontScale = ref(themeStore.fontScale * 100);
    const fontScaleLabel = computed(() => {
        const v = fontScale.value;
        if (v <= 85) return '小号字体';
        if (v >= 115) return '大号字体';
        return '标准字体';
    });

    function handleFontScale(val: number) {
        themeStore.setFontScale(val / 100);
    }

    // ---- 页面动画 ----
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

    function handleSaveAnimateType({ selectedOptions }: { selectedOptions: { text: string; value: string }[] }) {
        animateState.text = selectedOptions[0].text;
        themeStore.setPageAnimateType(selectedOptions[0].value);
        animateState.showPicker = false;
    }
</script>
