<template>
    <div class="logo" :style="{ width: size + 'px', height: size + 'px', '--logo-size': size + 'px' }">
        <!-- 替换成图片时: 移除 logo__glow/logo__inner，改用 <img class="logo__img"> -->
        <div class="logo__glow" />
        <div class="logo__inner">
            <!-- 顶部光泽层 -->
            <div class="logo__shine" />
            <!-- 品牌缩写 -->
            <span class="logo__letter">R</span>
            <!-- H5 角标 -->
            <span class="logo__badge">H5</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'CLogo' });

    withDefaults(defineProps<{ size?: number }>(), { size: 56 });
</script>
