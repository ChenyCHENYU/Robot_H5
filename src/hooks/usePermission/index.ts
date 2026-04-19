import type { App, Directive, DirectiveBinding } from 'vue';
import { usePermissionStoreWidthOut } from '@/store/modules/permission';

/**
 * 权限校验 Hook
 *
 * @example
 * ```ts
 * const { hasPermission } = usePermission();
 * const canAdd = hasPermission('customer:add');
 * ```
 */
export function usePermission() {
    const permissionStore = usePermissionStoreWidthOut();

    /** 检查是否拥有指定按钮权限 */
    function hasPermission(code: string): boolean {
        // 无权限数据时默认放行（Mock 模式 / 权限接口未对接）
        if (permissionStore.buttonPermissions.length === 0) return true;
        return permissionStore.hasPermission(code);
    }

    /** 检查是否拥有任一权限 */
    function hasAnyPermission(codes: string[]): boolean {
        if (permissionStore.buttonPermissions.length === 0) return true;
        return codes.some(code => permissionStore.hasPermission(code));
    }

    return { hasPermission, hasAnyPermission };
}

/**
 * v-permission 指令
 *
 * 用于按钮级权限控制，无权限时移除 DOM 元素。
 *
 * @example
 * ```html
 * <van-button v-permission="'customer:add'">新增客户</van-button>
 * <van-button v-permission="['customer:edit', 'customer:admin']">编辑</van-button>
 * ```
 */
const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
        const { value } = binding;
        if (!value) return;

        const permissionStore = usePermissionStoreWidthOut();

        // 无权限数据时默认显示（Mock 模式 / 权限接口未对接）
        if (permissionStore.buttonPermissions.length === 0) return;

        const codes = Array.isArray(value) ? value : [value];
        const hasPermission = codes.some(code => permissionStore.hasPermission(code));

        if (!hasPermission) {
            el.parentNode?.removeChild(el);
        }
    },
};

/** 注册 v-permission 指令 */
export function setupPermissionDirective(app: App) {
    app.directive('permission', permissionDirective);
}
