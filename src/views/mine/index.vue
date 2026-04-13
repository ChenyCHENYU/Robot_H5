<template>
    <div class="mine-page">
        <!-- Profile Card -->
        <div class="mine-page__profile" @click="$router.push('/editUserInfo')">
            <van-image class="mine-page__avatar" round fit="cover" :src="userStore.getUserInfo.avatar" />
            <div class="mine-page__info">
                <h2 class="mine-page__name">{{ userStore.getUserInfo.nickname || 'CHENY' }}</h2>
                <p class="mine-page__sign">{{ userStore.getUserInfo.sign || '把复杂的事做简单，把简单的事做极致。' }}</p>
            </div>
            <i class="i-ph:caret-right-bold mine-page__arrow" />
        </div>

        <!-- Settings Groups -->
        <div v-for="(group, gi) in settingsGroups" :key="gi" class="mine-page__group">
            <van-cell
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
            </van-cell>
        </div>

        <van-action-sheet
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
    import { settingsGroups, createLogoutActions } from './data';
    import { useUserStore } from '@/store/modules/user';

    defineOptions({ name: 'MinePage' });

    const userStore = useUserStore();
    const showLogoutAction = ref(false);

    const logoutActions = createLogoutActions();
</script>
