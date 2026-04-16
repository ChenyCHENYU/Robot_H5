<template>
    <div class="edit-info-page">
        <C_NavBar />

        <h3 class="edit-info-page__heading">基本信息</h3>
        <div class="edit-info-page__group">
            <VanField
                label="头像"
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                readonly
            >
                <template #input>
                    <UploaderImage>
                        <VanImage class="h-16 w-16" round fit="cover" :src="avatar" />
                    </UploaderImage>
                </template>
            </VanField>

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
                label="主页封面"
                class="edit-info-page__cell"
                label-class="font-bold"
                input-align="right"
                :center="true"
                :border="false"
                is-link
                readonly
            >
                <template #input>
                    <UploaderImage>
                        <VanImage class="bg-cover h-15 w-25" fit="cover" :src="cover ? cover : avatar" />
                    </UploaderImage>
                </template>
            </VanField>

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
    import { useUserStore } from '@/store/modules/user';

    const userStore = useUserStore();
    const { avatar, gender, industry, cover } = userStore.getUserInfo;

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

    function handleGender({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        state.genderText = selectedOptions[0].text;
        showToast(JSON.stringify(selectedOptions));
        // do something
        showGenderPicker.value = false;
    }

    function handleIndustry({ selectedOptions }: { selectedOptions: { text: string; value: number }[] }) {
        state.industryText = selectedOptions[0].text;
        showToast(JSON.stringify(selectedOptions));
        // do something
        showIndustryPicker.value = false;
    }

    function getFromText(columns: FormColumns[], value = 0) {
        return columns.find(item => item.value === value)?.text;
    }

    function initState() {
        Object.keys(state).forEach(key => {
            (state as Record<string, unknown>)[key] = (userStore.getUserInfo as Record<string, unknown>)[key];
        });
        // set field text value.
        state.genderText = getFromText(genderColumns, gender) ?? '';
        state.industryText = getFromText(industryColumns, industry) ?? '';
        // set the pick selected value.
        state.industryValues = [industry ?? 0];
        state.genderValues = [gender];
    }

    onMounted(() => {
        initState();
    });
</script>

