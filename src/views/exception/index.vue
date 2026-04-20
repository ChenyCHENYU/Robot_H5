<template>
    <div class="error-page">
        <!-- 装饰光球 -->
        <div class="error-page__orb error-page__orb--1" />
        <div class="error-page__orb error-page__orb--2" />

        <div class="error-page__content">
            <!-- 毛玻璃卡片 -->
            <div class="error-page__card">
                <div class="error-page__card-shine" />
                <div class="error-page__code">404</div>
                <h2 class="error-page__title">页面不存在</h2>
                <p class="error-page__desc">抱歉，你访问的页面已被移除或不存在</p>
                <VanButton class="error-page__btn" type="primary" round @click="goHome">
                    <i class="i-ph:house-bold" style="margin-right:6px" />
                    回到首页
                </VanButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import './index.scss';

    defineOptions({ name: 'NotFound' });

    const router = useRouter();
    function goHome() {
        router.push('/');
    }
</script>
