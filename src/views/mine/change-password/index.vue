<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { showToast } from 'vant';

    const formRef = ref<FormInstance>();
    const form = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' });

    const validateConfirm = (val: string) => {
        if (val !== form.newPwd) return '两次密码不一致';
        return true;
    };

    const onSubmit = () => {
        formRef.value?.validate().then(() => {
            showToast('密码修改成功');
        }).catch(() => {});
    };
</script>

<template>
    <div class="form-page">
        <CNavBar>
            <template #right>
                <span class="form-page__save" @click="onSubmit">保存</span>
            </template>
        </CNavBar>
        <div class="form-page__body">
            <van-form ref="formRef">
                <div class="form-page__section">
                    <h3 class="form-page__section-title">修改密码</h3>
                    <div class="form-page__group">
                        <van-field
                            v-model="form.oldPwd" class="form-page__cell"
                            label="当前密码" type="password" placeholder="请输入当前密码"
                            :rules="[{ required: true, message: '请输入当前密码' }]"
                        />
                        <van-field
                            v-model="form.newPwd" class="form-page__cell"
                            label="新密码" type="password" placeholder="请输入新密码（8位以上）"
                            :rules="[{ required: true, message: '请输入新密码' }]"
                        />
                        <van-field
                            v-model="form.confirmPwd" class="form-page__cell"
                            label="确认密码" type="password" placeholder="再次输入新密码"
                            :rules="[{ validator: validateConfirm }]"
                        />
                    </div>
                </div>
            </van-form>
        </div>
    </div>
</template>
