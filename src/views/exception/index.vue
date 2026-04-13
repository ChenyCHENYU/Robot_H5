<template>
    <div class="error-page">
        <div class="error-page__content">
            <img class="error-page__img" src="~@/assets/icons/exception/404.svg" alt="404" />
            <h2 class="error-page__title">页面不存在</h2>
            <p class="error-page__desc">抱歉，你访问的页面已被移除或不存在</p>
            <van-button class="error-page__btn" type="primary" @click="goHome">回到首页</van-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import './index.scss';

    const router = useRouter();
    function goHome() {
        router.push('/');
    }
</script>
