<template>
    <div class="form-page">
        <C_NavBar>
            <template #right>
                <VanButton size="small" type="primary" :loading="saving" @click="handleSave">保存</VanButton>
            </template>
        </C_NavBar>
        <div class="form-page__body">
            <div class="form-page__section">
                <h3 class="form-page__section-title">修改昵称</h3>
                <VanForm ref="formRef">
                    <div class="form-page__group">
                        <VanField
                            v-model="formValue.nickname"
                            name="nickname"
                            class="form-page__cell"
                            placeholder="请输入昵称（2-12字）"
                            clearable
                            :rules="[{ validator: validateNickname, trigger: 'onChange' }]"
                        />
                    </div>
                </VanForm>
            </div>
            <p class="form-page__note">
                支持 2-12 个字符，可使用中文、英文、数字及 - _ . ·
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast, type FormInstance } from 'vant';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'EditNickname' });

    const saving = ref(false);
    const router = useRouter();
    const userStore = useUserStore();
    const { nickname } = userStore.getUserInfo;
    const formRef = ref<FormInstance>();
    const formValue = reactive({ nickname: nickname || '' });

    const validateNickname = (value: string) => {
        if (value.length < 2 || value.length > 12) return '长度应在 2-12 个字符之间';
        if (!/^[一-龥A-Za-z0-9-_.·]+$/.test(value)) return '仅支持中文、英文、数字及 -_.·';
        return true;
    };

    const handleSave = async () => {
        if (saving.value) return;
        try {
            await formRef.value?.validate();
            saving.value = true;
            await userStore.UpdateProfile({ nickname: formValue.nickname });
            showToast('昵称已保存');
            await router.replace('/editInfo');
        } catch { /* 失败保留表单 */ }
        finally { saving.value = false; }
    };
</script>
