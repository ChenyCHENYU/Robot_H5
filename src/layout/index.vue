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
            <VanTabbarItem v-for="menu in getMenus[0].children" :key="menu.name" replace :to="menu.path">
                <template #icon="{ active }">
                    <C_Icon
                        :name="String(menu.meta?.icon || '')"
                        :size="22"
                        :color="active ? 'var(--ds-accent)' : 'var(--ds-text-tertiary)'"
                    />
                </template>
                {{ menu.meta?.title }}
            </VanTabbarItem>
        </VanTabbar>
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
