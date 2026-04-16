<template>
    <div class="form-page">
        <C_NavBar>
            <template #right>
                <span class="form-page__save" @click="onSubmit">保存</span>
            </template>
        </C_NavBar>
        <div class="form-page__body">
            <VanForm ref="formRef">
                <div class="form-page__section">
                    <h3 class="form-page__section-title">修改密码</h3>
                    <div class="form-page__group">
                        <VanField
                            v-model="form.oldPwd" class="form-page__cell"
                            label="当前密码" type="password" placeholder="请输入当前密码"
                            :rules="[{ required: true, message: '请输入当前密码' }]"
                        />
                        <VanField
                            v-model="form.newPwd" class="form-page__cell"
                            label="新密码" type="password" placeholder="请输入新密码（8位以上）"
                            :rules="[{ required: true, message: '请输入新密码' }]"
                        />
                        <VanField
                            v-model="form.confirmPwd" class="form-page__cell"
                            label="确认密码" type="password" placeholder="再次输入新密码"
                            :rules="[{ validator: validateConfirm }]"
                        />
                    </div>
                </div>
            </VanForm>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast, type FormInstance } from 'vant';

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
