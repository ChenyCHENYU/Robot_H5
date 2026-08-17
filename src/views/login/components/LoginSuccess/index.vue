<template>
    <Teleport to="body">
        <Transition name="login-success">
            <div v-if="visible" class="login-success">
                <!-- 背景光晕 -->
                <div class="login-success__orb login-success__orb--1" />
                <div class="login-success__orb login-success__orb--2" />
                <div class="login-success__orb login-success__orb--3" />

                <!-- 主体内容 -->
                <div class="login-success__content">
                    <!-- 成功图标：渐变圆环 + 对勾动画 -->
                    <div class="login-success__icon">
                        <div class="login-success__icon-ring" />
                        <svg class="login-success__check" viewBox="0 0 52 52">
                            <path
                                class="login-success__check-path"
                                fill="none"
                                d="M14 27l7.8 7.8L38 17"
                            />
                        </svg>
                    </div>

                    <!-- 文字 -->
                    <div class="login-success__text">
                        <span class="login-success__title">欢迎回来</span>
                        <span class="login-success__subtitle">{{ nickname || '正在进入系统' }}</span>
                    </div>

                    <!-- 底部进度光束 -->
                    <div class="login-success__beam">
                        <div class="login-success__beam-fill" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import './index.scss';

    defineOptions({ name: 'LoginSuccess' });

    defineProps<{
        visible: boolean;
        nickname?: string;
    }>();
</script>
