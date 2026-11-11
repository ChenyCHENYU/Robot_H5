<template>
    <VanConfigProvider class="app-provider" :theme="getThemeMode" :theme-vars="themeVarsCache">
        <div class="app-viewport w-full flex flex-col overflow-hidden">
            <C_VirtualStatusBar />
            <!-- 用真实 div 承接 flex-1，避免 routerView v-slot fallthrough
                 把样式传递到子路由组件根元素导致内部滚动失效
                 overflow-y-auto 让非 Layout 的子页面（demo 等）可滚动 -->
            <div class="app-page-scroll w-full flex-1 min-h-0 overflow-x-hidden overflow-y-auto" data-page-scroll>
                <RouterView v-slot="{ Component, route }">
                    <transition :name="transitionName" mode="out-in">
                        <KeepAlive :include="keepAliveComponents" :key="sessionKey" :max="20">
                            <component :is="Component" :key="route.matched[0]?.path" />
                        </KeepAlive>
                    </transition>
                </RouterView>
            </div>
        </div>
    </VanConfigProvider>
</template>

<script setup lang="ts">
    import { useTheme } from '@/hooks/useTheme';
    import { useThemeStore } from '@/store/modules/theme';
    import { useRouteStore } from '@/store/modules/route';
    import { useUserStore } from '@/store/modules/user';
    import { useThemeRuntime } from '@/hooks/useTheme/runtime';
    import { PageEnum } from '@/enums/pageEnum';

    defineOptions({ name: 'App' });

    const { getThemeMode, getThemeVars } = useTheme();
    const themeStore = useThemeStore();

    useThemeRuntime();
    const route = useRoute();
    const routeStore = useRouteStore();
    const userStore = useUserStore();
    const keepAliveComponents = computed(() => ['MainLayout', ...routeStore.keepAliveComponents]);
    const sessionKey = computed(() => {
        // 免登录页（登录/门户异常页）冻结会话 key：登录成功写入 token 的瞬间
        // 不把当前页面整棵重挂载（登录页闪烁根因）；换号清 KeepAlive 缓存的语义
        // 保留——离开免登录页进入业务路由时 key 即随身份切换。
        if (route.path === PageEnum.BASE_LOGIN || route.path === PageEnum.PORTAL_CONTEXT_ERROR) {
            return 'pre-auth';
        }
        return `${userStore.getToken}:${userStore.getCompanyId}`;
    });

    // 缓存 themeVars 避免每次渲染都重新计算
    const themeVarsCache = computed(() => getThemeVars());

    // 页面过渡动画名称：关闭动画时返回空字符串（无过渡）
    const transitionName = computed(() =>
        themeStore.isPageAnimate ? themeStore.pageAnimateType : '',
    );
</script>
