<template>
    <div class="form-page">
        <C_NavBar>
            <template #right>
                <VanButton size="small" type="primary" :loading="saving" @click="handleSave">保存</VanButton>
            </template>
        </C_NavBar>
        <div class="form-page__body">
            <div class="form-page__section">
                <h3 class="form-page__section-title">个性签名</h3>
                <VanForm ref="formRef">
                    <div class="form-page__group">
                        <VanField
                            v-model="formValue.sign"
                            class="form-page__cell"
                            name="sign"
                            clearable
                            rows="4"
                            autosize
                            type="textarea"
                            maxlength="70"
                            placeholder="写下你的个人签名…"
                            show-word-limit
                        />
                    </div>
                </VanForm>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast, type FormInstance } from 'vant';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'EditSign' });
    const saving = ref(false);
    const router = useRouter();
    const userStore = useUserStore();
    const { sign } = userStore.getUserInfo;
    const formRef = ref<FormInstance>();
    const formValue = reactive({ sign: sign ?? '' });

    const handleSave = async () => {
        if (saving.value) return;
        try {
            await formRef.value?.validate();
            saving.value = true;
            await userStore.UpdateProfile({ sign: formValue.sign });
            showToast('签名已保存');
            await router.replace('/editInfo');
        } catch { /* 失败保留表单 */ }
        finally { saving.value = false; }
    };
</script>
