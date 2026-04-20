<template>
    <div class="mine-page">
        <!-- Ambient Orbs -->
        <div class="mine-page__bg">
            <div class="mine-page__bg-orb mine-page__bg-orb--1" />
            <div class="mine-page__bg-orb mine-page__bg-orb--2" />
        </div>

        <!-- Profile Card -->
        <div class="mine-page__profile" @click="$router.push('/editUserInfo')">
            <VanImage class="mine-page__avatar" round fit="cover" :src="avatarSrc" />
            <div class="mine-page__info">
                <h2 class="mine-page__name">{{ userStore.getUserInfo.nickname || 'CHENY' }}</h2>
                <p class="mine-page__sign">{{ userStore.getUserInfo.sign || '把复杂的事做简单，把简单的事做极致。' }}</p>
            </div>
            <i class="i-ph:caret-right-bold mine-page__arrow" />
        </div>

        <!-- Settings Groups -->
        <div v-for="(group, gi) in settingsGroups" :key="gi" class="mine-page__group">
            <VanCell
                v-for="cell in group"
                :key="cell.title"
                :title="cell.title"
                :is-link="!!cell.to || !!cell.action"
                :to="cell.to"
                class="mine-page__cell"
                :class="{ 'mine-page__cell--danger': cell.danger }"
                @click="cell.action === 'logout' ? (showLogoutAction = true) : undefined"
            >
                <template #icon>
                    <div class="mine-page__icon-box" :style="{ background: cell.color }">
                        <C_Icon :name="cell.icon" :size="18" color="#fff" />
                    </div>
                </template>
                <template v-if="cell.value" #value>
                    <span class="mine-page__hint">{{ cell.value }}</span>
                </template>
            </VanCell>
        </div>

        <VanActionSheet
            v-model:show="showLogoutAction"
            teleport="body"
            :actions="logoutActions"
            cancel-text="取消"
            description="确认退出当前账号？"
            close-on-click-action
        />
    </div>
</template>

<script lang="ts" setup>
    import './index.scss';
    import { settingsGroups, createLogoutActions, DEFAULT_AVATAR } from './data';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'MinePage' });

    const userStore = useUserStore();
    const showLogoutAction = ref(false);
    const avatarSrc = computed(() => userStore.getUserInfo.avatar || DEFAULT_AVATAR);

    const logoutActions = createLogoutActions();
</script>
