<template>
    <div class="layout">
        <div class="layout__content">
            <RouterView v-slot="{ Component, route }">
                <transition name="tab-fade" mode="out-in">
                    <KeepAlive :include="keepAliveComponents">
                        <component :is="Component" :key="route.name" />
                    </KeepAlive>
                </transition>
            </RouterView>
        </div>

        <VanTabbar route fixed placeholder class="layout__tabbar">
            <VanTabbarItem v-for="menu in tabBarMenus" :key="menu.key" replace :to="menu.path">
                <template #icon="{ active }">
                    <C_Icon
                        :name="menu.icon"
                        :size="22"
                        :color="active ? 'var(--ds-accent)' : 'var(--ds-text-tertiary)'"
                    />
                </template>
                {{ menu.title }}
            </VanTabbarItem>
        </VanTabbar>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import type { RouteRecordRaw } from 'vue-router';
    import { useRouteStore } from '@/store/modules/route';

    interface TabBarItem {
        key: string;
        path: string;
        title: string;
        icon: string;
    }

    const routeStore = useRouteStore();
    const keepAliveComponents = computed(() => routeStore.keepAliveComponents);

    /** 将 RouteRecordRaw 转为统一格式 */
    function fromRoute(route: RouteRecordRaw): TabBarItem {
        return {
            key: String(route.name || route.path),
            path: route.path || '',
            title: String(route.meta?.title || ''),
            icon: String(route.meta?.icon || ''),
        };
    }

    /** TabBar 菜单来源：本地路由定义（menu.ts） */
    const tabBarMenus = computed<TabBarItem[]>(() => {
        const {menus} = routeStore;
        const children = menus[0]?.children || [];
        return children.map(fromRoute);
    });
</script>
