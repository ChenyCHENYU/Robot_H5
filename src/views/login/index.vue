<template>
    <div class="login-page">
        <!-- Animated background orbs -->
        <div v-for="n in 5" :key="n" class="login-page__orb" :class="`login-page__orb--${n}`" />

        <div class="login-page__inner">
            <LoginTitle />
            <div class="login-page__card">
                <LoginForm />
                <ForgetPasswordForm />
                <RegisterForm />
            </div>
        </div>

        <!-- Footer -->
        <div class="login-page__footer">
            <span class="login-page__footer-brand">Robot H5 · Enterprise Mobile Template</span>
            <span class="login-page__footer-text">© 2026 @CHENY · v1.5.0</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import LoginTitle from './components/LoginTitle/index.vue';
    import LoginForm from './components/LoginForm/index.vue';
    import ForgetPasswordForm from './components/ForgetPasswordForm/index.vue';
    import RegisterForm from './components/RegisterForm/index.vue';

    defineOptions({ name: 'LoginPage' });
</script>
