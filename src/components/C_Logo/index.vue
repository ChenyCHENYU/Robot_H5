<template>
    <div class="logo" :style="{ width: size + 'px', height: size + 'px', '--logo-size': size + 'px' }">
        <!-- 环境光晕 -->
        <div class="logo__glow" />
        <!-- 圆角方块主体 -->
        <div class="logo__inner">
            <!-- 顶部半椭圆高光 -->
            <div class="logo__shine" />
            <!-- 左上角镜面光斑 -->
            <div class="logo__gloss" />
            <!-- 品牌字母 -->
            <span class="logo__letter">R</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'CLogo' });

    withDefaults(defineProps<{ size?: number }>(), { size: 56 });
</script>
