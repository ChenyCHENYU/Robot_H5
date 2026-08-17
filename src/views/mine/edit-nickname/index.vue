<template>
    <div class="form-page">
        <C_NavBar>
            <template #right>
                <span class="form-page__save" @click="handleSave">保存</span>
            </template>
        </C_NavBar>
        <div class="form-page__body">
            <div class="form-page__section">
                <h3 class="form-page__section-title">修改昵称</h3>
                <VanForm ref="formRef">
                    <div class="form-page__group">
                        <VanField
                            v-model="formValue.nickname"
                            class="form-page__cell"
                            placeholder="请输入昵称（2-12字）"
                            clearable
                            :rules="[{ validator: validateNickname, trigger: 'onChange' }]"
                        />
                    </div>
                </VanForm>
            </div>
            <p class="form-page__note">
                支持 2-12 个中文字符或 3-24 个英文字符，符号仅支持 - _ . ·
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast, type FormInstance } from 'vant';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'EditNickname' });

    const userStore = useUserStore();
    const { nickname } = userStore.getUserInfo;
    const formRef = ref<FormInstance>();
    const formValue = reactive({ nickname: nickname || '' });

    const validateNickname = (value: string) => {
        if (value.length < 2 || value.length > 12) return '长度应在 2-12 个字符之间';
        if (!/^[一-龥A-Za-z0-9-_.·]+$/.test(value)) return '仅支持中文、英文、数字及 -_.·';
        return true;
    };

    const handleSave = () => {
        formRef.value?.validate().then(async () => {
            try {
                const vals = formRef.value?.getValues();
                showToast({ message: `昵称已更新为：${vals?.nickname}` });
            } finally {}
        }).catch(() => {});
    };
</script>
