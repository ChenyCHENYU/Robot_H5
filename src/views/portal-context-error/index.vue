<template>
    <main class="context-error">
        <section class="context-error__card">
            <div class="context-error__icon">!</div>
            <h1>公司上下文未就绪</h1>
            <p class="context-error__message">{{ errorMessage }}</p>

            <dl class="context-error__details">
                <div>
                    <dt>错误码</dt>
                    <dd>{{ errorCode }}</dd>
                </div>
                <div>
                    <dt>目标公司</dt>
                    <dd>{{ companyText }}</dd>
                </div>
                <div v-if="endpoint">
                    <dt>同步接口</dt>
                    <dd>{{ endpoint }}</dd>
                </div>
            </dl>

            <VanButton v-if="canRetry" type="primary" round block :loading="retrying" @click="retry">
                重新同步
            </VanButton>
            <VanButton class="context-error__back" plain round block @click="backToPortal">
                返回移动门户
            </VanButton>
            <p class="context-error__hint">
                重试仍失败时，请将错误码、目标公司和同步接口提供给开发人员。
            </p>
        </section>
    </main>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { showFailToast } from 'vant';
    import { initializeMbaseCompanyContext } from '@/platform/mbase/company-context';
    import { PageEnum } from '@/enums/pageEnum';
    import { usePermissionStoreWidthOut } from '@/store/modules/permission';
    import { useUserStoreWidthOut } from '@/store/modules/user';
    import './index.scss';

    defineOptions({ name: 'PortalContextError' });

    const router = useRouter();
    const userStore = useUserStoreWidthOut();
    const retrying = ref(false);
    const errorCode = computed(() => userStore.companyContextError?.code || 'company_context_unknown');
    const errorMessage = computed(
        () => userStore.companyContextError?.message || '未取得有效的公司上下文，请从移动门户重新进入'
    );
    const endpoint = computed(() => userStore.companyContextError?.endpoint || '');
    const canRetry = computed(() => Boolean(userStore.getCompanyId));
    const companyText = computed(() => {
        if (!userStore.getCompanyId) return '未获取';
        return userStore.getCompanyName
            ? `${userStore.getCompanyName}（${userStore.getCompanyId}）`
            : userStore.getCompanyId;
    });

    async function retry() {
        if (retrying.value) return;
        retrying.value = true;
        try {
            await initializeMbaseCompanyContext({
                companyId: userStore.getCompanyId,
                companyName: userStore.getCompanyName,
            });
            await userStore.GetUserInfo();
            const permissionStore = usePermissionStoreWidthOut();
            permissionStore.resetPermissions();
            await permissionStore.loadPermissions();
            await router.replace(PageEnum.BASE_HOME);
        } catch (error) {
            showFailToast(error instanceof Error ? error.message : '公司上下文同步失败');
        } finally {
            retrying.value = false;
        }
    }

    function backToPortal() {
        window.history.back();
    }
</script>
