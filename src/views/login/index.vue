<template>
    <div class="login-page">
        <div class="login-page__ambient" aria-hidden="true" />

        <div class="login-page__inner">
            <LoginTitle />
            <div class="login-page__card">
                <div class="login-page__card-header">
                    <h2 class="login-page__card-title">{{ loginHeadings[getLoginState].title }}</h2>
                    <p class="login-page__card-sub">{{ loginHeadings[getLoginState].subtitle }}</p>
                </div>
                <LoginForm />
                <ForgetPasswordForm />
                <RegisterForm />
            </div>
        </div>

        <footer class="login-page__footer">
            <span class="login-page__footer-text">© {{ currentYear }} CHENY · Robot H5 · v{{ appVersion }}</span>
        </footer>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import LoginTitle from './components/LoginTitle/index.vue';
    import LoginForm from './components/LoginForm/index.vue';
    import ForgetPasswordForm from './components/ForgetPasswordForm/index.vue';
    import RegisterForm from './components/RegisterForm/index.vue';
    import { loginHeadings, appVersion, currentYear } from './data';
    import { useLoginState } from './useLogin';

    // eslint-disable-next-line vue/multi-word-component-names -- 与既有 Login 路由保持同名。
    defineOptions({ name: 'Login' });

    const { getLoginState } = useLoginState();
</script>
