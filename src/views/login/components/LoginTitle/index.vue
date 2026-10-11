<template>
    <div class="login-title">
        <C_Logo class="login-title__logo" :size="64" />
        <h1 class="login-title__heading">Robot H5</h1>
        <p class="login-title__sub">企业级移动应用框架</p>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';

    defineOptions({ name: 'LoginTitle' });
</script>
