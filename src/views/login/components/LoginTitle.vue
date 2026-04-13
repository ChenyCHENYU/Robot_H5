<template>
    <div class="login-title">
        <CLogo class="login-title__logo" :size="64" />
        <h1 class="login-title__heading">欢迎回来</h1>
        <p class="login-title__sub">登录以继续使用</p>
    </div>
</template>

<script setup lang="ts">
    defineOptions({ name: "LoginTitle" });
</script>
