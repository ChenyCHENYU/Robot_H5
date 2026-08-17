import type { RouteRecordRaw } from 'vue-router';

// 业务子页面路由（路径/name 沿用老计量系统，避免破坏已部署入口与 keepAlive 缓存）
const routeModuleList: Array<RouteRecordRaw> = [
    // ─── 厂内调拨过磅委托管理 ─────────────────────
    {
        path: '/transferWeighing/entrustList',
        name: 'transEntrust',
        meta: {
            title: '过磅委托列表',
            keepAlive: true,
        },
        component: () => import('@/views/mes/transfer-weighing/entrust-list/index.vue'),
    },
    {
        path: '/transferWeighing/entrustList/detail',
        name: 'transEntrustDetail',
        meta: {
            title: '计划详情',
            keepAlive: false,
        },
        component: () => import('@/views/mes/transfer-weighing/entrust-list/detail.vue'),
    },
    {
        path: '/transferWeighing/ticketList',
        name: 'transTicket',
        meta: {
            title: '磅单列表',
            keepAlive: true,
        },
        component: () => import('@/views/mes/transfer-weighing/ticket-list/index.vue'),
    },
    {
        path: '/transferWeighing/ticketList/detail',
        name: 'transTicketDetail',
        meta: {
            title: '磅单列表',
            keepAlive: true,
        },
        component: () => import('@/views/mes/transfer-weighing/ticket-list/detail.vue'),
    },
    {
        path: '/transferWeighing/ticketList/print',
        name: 'transTicketPrint',
        meta: {
            title: '磅单预览',
            keepAlive: false,
        },
        component: () => import('@/views/mes/transfer-weighing/ticket-list/print.vue'),
    },

    // ─── 磅秤巡检管理 ────────────────────────────
    {
        path: '/scaleInspection/taskList',
        name: 'scaleInspectionTask',
        meta: {
            title: '磅秤巡检任务',
            keepAlive: true,
        },
        component: () => import('@/views/mes/scale-inspection/task-list/index.vue'),
    },
    {
        path: '/scaleInspection/taskList/detail',
        name: 'scaleInspectionTaskDetail',
        meta: {
            title: '磅秤巡检详情',
            keepAlive: true,
        },
        component: () => import('@/views/mes/scale-inspection/task-list/detail.vue'),
    },

    // ─── 校秤任务管理 ────────────────────────────
    {
        path: '/weightVerify/taskList',
        name: 'weightVerifyTask',
        meta: {
            title: '校秤任务',
            keepAlive: true,
        },
        component: () => import('@/views/mes/weight-verify/task-list/index.vue'),
    },
    {
        path: '/weightVerify/taskList/detail',
        name: 'weightVerifyDetail',
        meta: {
            title: '校秤任务详情',
            keepAlive: true,
        },
        component: () => import('@/views/mes/weight-verify/task-list/detail.vue'),
    },

    // ─── 修改密码（无 TabBar） ────────────────────
    {
        path: '/updatePassword',
        name: 'UpdatePassword',
        meta: {
            title: '修改密码',
        },
        component: () => import('@/views/mine/update-password/index.vue'),
    },
];

export default routeModuleList;
