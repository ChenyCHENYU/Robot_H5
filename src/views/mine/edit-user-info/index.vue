<template>
    <div class="edit-info-page">
        <C_NavBar title="编辑资料" />

        <!-- Avatar Hero -->
        <div class="edit-info-page__avatar-hero">
            <UploaderImage @uploaded="onAvatarUploaded">
                <div class="edit-info-page__avatar-wrap">
                    <VanImage class="edit-info-page__avatar" round fit="cover" :src="avatarSrc" />
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
    import { DEFAULT_AVATAR } from '../data';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'EditUserInfo' });

    const userStore = useUserStore();
    const { gender, industry } = userStore.getUserInfo;

    const avatarSrc = computed(() => userStore.getUserInfo.avatar || DEFAULT_AVATAR);
    const coverSrc = computed(() => userStore.getUserInfo.cover || avatarSrc.value);

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

    function onAvatarUploaded(url: string) {
        userStore.setUserInfo({ ...userStore.getUserInfo, avatar: url });
    }

    function onCoverUploaded(url: string) {
        userStore.setUserInfo({ ...userStore.getUserInfo, cover: url });
    }

    function handleGender({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        state.genderText = selectedOptions[0].text;
        showToast(JSON.stringify(selectedOptions));
        showGenderPicker.value = false;
    }

    function handleIndustry({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        state.industryText = selectedOptions[0].text;
        showToast(JSON.stringify(selectedOptions));
        showIndustryPicker.value = false;
    }

    function getFromText(columns: FormColumns[], value = 0) {
        return columns.find(item => item.value === value)?.text;
    }

    function initState() {
        Object.keys(state).forEach(key => {
            (state as Record<string, unknown>)[key] = (userStore.getUserInfo as Record<string, unknown>)[key];
        });
        state.genderText = getFromText(genderColumns, gender) ?? '';
        state.industryText = getFromText(industryColumns, industry) ?? '';
        state.industryValues = [industry ?? 0];
        state.genderValues = [gender];
    }

    onMounted(() => {
        initState();
    });
</script>

