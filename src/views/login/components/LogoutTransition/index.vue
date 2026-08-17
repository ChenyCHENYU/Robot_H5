<template>
    <Teleport to="body">
        <Transition name="logout-transition">
            <div v-if="visible" class="logout-transition">
                <!-- 背景光晕 -->
                <div class="logout-transition__orb logout-transition__orb--1" />
                <div class="logout-transition__orb logout-transition__orb--2" />

                <!-- 主体内容 -->
                <div class="logout-transition__content">
                    <!-- 退出图标：渐变圆环 + 挥手动画 -->
                    <div class="logout-transition__icon">
                        <div class="logout-transition__icon-ring" />
                        <span class="logout-transition__wave">👋</span>
                    </div>

                    <!-- 文字 -->
                    <div class="logout-transition__text">
                        <span class="logout-transition__title">已安全退出</span>
                        <span class="logout-transition__subtitle">期待下次见面</span>
                    </div>

                    <!-- 底部光束 -->
                    <div class="logout-transition__beam">
                        <div class="logout-transition__beam-fill" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import './index.scss';

    defineOptions({ name: 'LogoutTransition' });

    defineProps<{
        visible: boolean;
    }>();
</script>
