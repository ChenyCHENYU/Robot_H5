<template>
    <div class="edit-info-page">
        <C_NavBar title="编辑资料" />

        <!-- Avatar Hero -->
        <div class="edit-info-page__avatar-hero">
            <UploaderImage @uploaded="onAvatarUploaded">
                <div class="edit-info-page__avatar-wrap">
                    <C_Avatar class="edit-info-page__avatar" :src="userStore.getUserInfo.avatar" />
                    <div class="edit-info-page__avatar-badge">
                        <i class="i-ph:camera-bold" />
                    </div>
                </div>
            </UploaderImage>
            <p class="edit-info-page__avatar-hint">点击更换头像</p>
        </div>

        <!-- Basic Info Group -->
        <h3 class="edit-info-page__heading">基本信息</h3>
        <div class="edit-info-page__group">
            <VanField
                v-model="state.nickname"
                label="昵称"
                readonly
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                to="/editNickname"
            />
            <VanField
                v-model="state.genderText"
                label="性别"
                readonly
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                @click="showGenderPicker = true"
            />
            <VanField
                v-model="state.sign"
                label="签名"
                readonly
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                to="/editSign"
            />
            <VanField
                v-model="state.industryText"
                label="行业"
                readonly
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                @click="showIndustryPicker = true"
            />
        </div>

        <!-- Cover Group -->
        <h3 class="edit-info-page__heading">主页封面</h3>
        <div class="edit-info-page__group">
            <VanField
                label="封面图"
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                readonly
            >
                <template #input>
                    <UploaderImage @uploaded="onCoverUploaded">
                        <VanImage class="edit-info-page__cover" fit="cover" :src="coverSrc" />
                    </UploaderImage>
                </template>
            </VanField>
        </div>

        <VanPopup v-model:show="showGenderPicker" position="bottom" round>
            <VanPicker
                v-model="state.genderValues"
                visible-option-num="3"
                :columns="genderColumns"
                @confirm="handleGender"
                @cancel="showGenderPicker = false"
            />
        </VanPopup>

        <VanPopup v-model:show="showIndustryPicker" position="bottom" round>
            <VanPicker
                v-model="state.industryValues"
                :columns="industryColumns"
                @confirm="handleIndustry"
                @cancel="showIndustryPicker = false"
            />
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast } from 'vant';
    import UploaderImage from '../components/UploaderImage.vue';
    import { genderColumns, industryColumns, type FormColumns } from '../pickColumns';
    import { defaultAvatar } from '@/components/C_Avatar/data';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'EditUserInfo' });

    const userStore = useUserStore();

    const coverSrc = computed(() => userStore.getUserInfo.cover || defaultAvatar);

    const showGenderPicker = ref(false);
    const showIndustryPicker = ref(false);

    const state = reactive({
        nickname: '',
        sign: '',
        genderText: '',
        industryText: '',
        industryValues: [0],
        genderValues: [0],
    });

    async function saveProfile(profile: Parameters<typeof userStore.UpdateProfile>[0]) {
        try { await userStore.UpdateProfile(profile); showToast('资料已保存'); }
        catch { /* HTTP 层已反馈 */ }
    }
    const onAvatarUploaded = (url: string) => saveProfile({ avatar: url });
    const onCoverUploaded = (url: string) => saveProfile({ cover: url });
    async function handleGender({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        if (!selectedOptions[0]) return;
        await saveProfile({ gender: selectedOptions[0].value });
        showGenderPicker.value = false;
    }
    async function handleIndustry({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        if (!selectedOptions[0]) return;
        await saveProfile({ industry: selectedOptions[0].value });
        showIndustryPicker.value = false;
    }

    function getFromText(columns: FormColumns[], value = 0) {
        return columns.find(item => item.value === value)?.text;
    }

    watch(() => userStore.getUserInfo, info => {
        state.nickname = info.nickname;
        state.sign = info.sign || '';
        state.genderText = getFromText(genderColumns, info.gender) || '';
        state.industryText = getFromText(industryColumns, info.industry) || '';
        state.genderValues = [info.gender];
        state.industryValues = [info.industry || 0];
    }, { immediate: true });
</script>
