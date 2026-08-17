<template>
    <div class="update-pwd-page">
        <C_NavBar title="修改密码" />

        <VanForm @submit="onSubmit">
            <VanCellGroup inset class="update-pwd-page__form-group">
                <VanField
                    v-model="form.password"
                    label="新密码"
                    name="password"
                    type="password"
                    placeholder="请输入新密码"
                    required
                    :rules="[{ required: true, message: '请填写新密码' }]"
                />
                <VanField
                    v-model="form.againPassword"
                    label="确认密码"
                    name="againPassword"
                    type="password"
                    placeholder="请输入确认密码"
                    required
                    :rules="[{ validator: validatorPwd, message: '确认密码不匹配' }]"
                />
            </VanCellGroup>

            <div class="update-pwd-page__hints">
                <p v-for="(hint, index) in PWD_HINTS" :key="index">{{ hint }}</p>
            </div>

            <div class="update-pwd-page__submit">
                <VanButton
                    size="large"
                    type="primary"
                    native-type="submit"
                    class="update-pwd-page__submit-btn"
                >
                    确认修改
                </VanButton>
            </div>
        </VanForm>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useRouter } from 'vue-router';
    import { showDialog, showToast } from 'vant';
    import { updatePwd } from '@/api/auth';
    import { getStore } from '@/utils/store';
    import { useUserStore } from '@/store/modules/user';
    import { PWD_PATTERN, DEFAULT_PWD, PWD_HINTS, type PwdForm } from './data';

    defineOptions({ name: 'UpdatePassword' });

    const router = useRouter();
    const userStore = useUserStore();

    const form = reactive<PwdForm>({ password: '', againPassword: '' });

    const validatorPwd = (val: string) => form.password === val;

    async function onSubmit() {
        if (!PWD_PATTERN.test(form.password) || form.password === DEFAULT_PWD) {
            showDialog({ message: '请输入正确的8-10位大小写字母、数字密码' });
            return;
        }
        try {
            // 老接口契约：oldPassword/newPassword 均 RSA 加密（auth.ts 内部已加密）
            const res: any = await updatePwd(getStore('pwd') || '', form.password);
            showToast(res?.message || '修改成功');
            // 改密成功后清除登录态，强制重新登录（与老逻辑一致）
            userStore.setToken('');
            userStore.setBusinessUserInfo({});
            router.replace({ path: '/login' });
        } catch {
            // 失败提示已由 http 层统一处理
        }
    }
</script>
