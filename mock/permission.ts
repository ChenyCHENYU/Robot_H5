import { resultSuccess } from './_util';

/**
 * Mock — 移动端权限菜单 & 按钮权限码
 *
 * 菜单树结构映射说明：
 * menuType: D=目录（TabBar 容器）, M=菜单（页面）, B=按钮（权限点）
 * visible: 是否在 TabBar 中显示
 */

// 模拟菜单树（与 src/router/menu.ts 对应）
const MENU_TREE = [
    {
        menuId: 1,
        parentId: 0,
        menuName: 'Robot H5',
        menuType: 'D',
        path: '/',
        icon: '',
        orderNum: 1,
        visible: true,
        children: [
            {
                menuId: 10,
                parentId: 1,
                menuName: '首页',
                menuType: 'M',
                path: '/dashboard',
                icon: 'ph:house-bold',
                orderNum: 1,
                visible: true,
                keepAlive: true,
                children: [],
            },
            {
                menuId: 20,
                parentId: 1,
                menuName: 'Demo',
                menuType: 'M',
                path: '/demo',
                icon: 'ph:squares-four-bold',
                orderNum: 2,
                visible: true,
                keepAlive: false,
                children: [
                    {
                        menuId: 201,
                        parentId: 20,
                        menuName: '新增Demo',
                        menuType: 'B',
                        path: '',
                        permission: 'demo:add',
                        orderNum: 1,
                        visible: false,
                    },
                    {
                        menuId: 202,
                        parentId: 20,
                        menuName: '编辑Demo',
                        menuType: 'B',
                        path: '',
                        permission: 'demo:edit',
                        orderNum: 2,
                        visible: false,
                    },
                    {
                        menuId: 203,
                        parentId: 20,
                        menuName: '删除Demo',
                        menuType: 'B',
                        path: '',
                        permission: 'demo:delete',
                        orderNum: 3,
                        visible: false,
                    },
                ],
            },
            {
                menuId: 30,
                parentId: 1,
                menuName: '图表',
                menuType: 'M',
                path: '/chart',
                icon: 'ph:chart-bar-bold',
                orderNum: 3,
                visible: true,
                keepAlive: false,
                children: [],
            },
            {
                menuId: 40,
                parentId: 1,
                menuName: '我的',
                menuType: 'M',
                path: '/mine',
                icon: 'ph:user-bold',
                orderNum: 4,
                visible: true,
                keepAlive: false,
                children: [],
            },
        ],
    },
];

// 模拟按钮权限码
const PERMISSION_CODES = [
    'demo:add',
    'demo:edit',
    'demo:delete',
    'customer:add',
    'customer:edit',
    'customer:delete',
    'order:add',
    'order:edit',
    'order:delete',
    'order:export',
];

export default [
    {
        url: '/api/system/menu/getRouters',
        timeout: 300,
        method: 'get',
        response: () => {
            return resultSuccess(MENU_TREE);
        },
    },
    {
        url: '/api/system/menu/getPermissions',
        timeout: 300,
        method: 'get',
        response: () => {
            return resultSuccess(PERMISSION_CODES);
        },
    },
];
