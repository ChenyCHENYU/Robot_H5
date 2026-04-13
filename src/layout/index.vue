<template>
    <div class="layout">
        <div class="layout__content">
            <routerView v-slot="{ Component, route }">
                <keep-alive :include="keepAliveComponents">
                    <component :is="Component" :key="route.name" />
                </keep-alive>
            </routerView>
        </div>

        <van-tabbar route fixed placeholder class="layout__tabbar">
            <van-tabbar-item v-for="menu in getMenus[0].children" :key="menu.name" replace :to="menu.path">
                <template #icon="{ active }">
                    <C_Icon
                        :name="String(menu.meta?.icon || '')"
                        :size="22"
                        :color="active ? 'var(--ds-accent)' : 'var(--ds-text-tertiary)'"
                    />
                </template>
                {{ menu.meta?.title }}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import type { RouteRecordRaw } from 'vue-router';
    import { useRouteStore } from '@/store/modules/route';

    const routeStore = useRouteStore();
    const keepAliveComponents = computed(() => routeStore.keepAliveComponents);
    const getMenus: ComputedRef<RouteRecordRaw[]> = computed(() => routeStore.menus);
</script>
