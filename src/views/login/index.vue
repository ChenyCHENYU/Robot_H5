<template>
    <div class="login-page">
        <div v-for="n in 3" :key="n" class="login-page__orb" :class="`login-page__orb--${n}`" />
        <div class="login-page__inner">
            <LoginTitle />
            <LoginForm />
            <ForgetPasswordForm />
            <RegisterForm />
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import LoginTitle from './components/LoginTitle.vue';
    import LoginForm from './components/LoginForm.vue';
    import ForgetPasswordForm from './components/ForgetPasswordForm.vue';
    import RegisterForm from './components/RegisterForm.vue';

    defineOptions({ name: 'LoginPage' });
</script>
