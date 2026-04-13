<script setup lang="ts">
    import './index.scss';
    import { useUserStore } from '@/store/modules/user';

    const userStore = useUserStore();
    const { username, phone } = userStore.getUserInfo;

    const afterPhone = computed(() => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
</script>

<template>
    <div class="form-page">
        <CNavBar />
        <div class="form-page__body">
            <div class="form-page__section">
                <h3 class="form-page__section-title">账号信息</h3>
                <div class="form-page__group">
                    <van-cell
                        class="form-page__cell"
                        title="用户名"
                        :value="username"
                        center
                    />
                    <van-cell
                        class="form-page__cell"
                        title="手机号"
                        :value="afterPhone"
                        is-link
                        center
                    />
                </div>
            </div>
            <div class="form-page__section">
                <h3 class="form-page__section-title">安全设置</h3>
                <div class="form-page__group">
                    <van-cell
                        class="form-page__cell"
                        title="修改登录密码"
                        is-link
                        to="/changePassword"
                        center
                    />
                </div>
            </div>
        </div>
    </div>
</template>
