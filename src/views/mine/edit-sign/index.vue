<script setup lang="ts">
    import './index.scss';
    import type { FormInstance } from 'vant';
    import { showToast } from 'vant';
    import { useUserStore } from '@/store/modules/user';

    const userStore = useUserStore();
    const { sign } = userStore.getUserInfo;
    const formRef = ref<FormInstance>();
    const formValue = reactive({ sign: sign ?? '' });

    const handleSave = () => {
        formRef.value?.validate().then(async () => {
            try {
                showToast({ message: '签名已保存' });
            } finally {}
        }).catch(() => {});
    };
</script>

<template>
    <div class="form-page">
        <CNavBar>
            <template #right>
                <span class="form-page__save" @click="handleSave">保存</span>
            </template>
        </CNavBar>
        <div class="form-page__body">
            <div class="form-page__section">
                <h3 class="form-page__section-title">个性签名</h3>
                <van-form ref="formRef">
                    <div class="form-page__group">
                        <van-field
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
                </van-form>
            </div>
        </div>
    </div>
</template>
