# Skill：路由注册 route-register

> 触发词：`注册路由` / `添加菜单` / `注册页面`

## 输入

页面信息（路径、标题、是否缓存、是否菜单页）

## 操作

### 子页面路由 → `src/router/modules.ts`

在 `routeModuleList` 数组末尾追加：

```ts
{
    path: '/customerArchive',
    name: 'CustomerArchive',       // 必须与 defineOptions({ name }) 一致
    meta: {
        title: '客户档案',
        keepAlive: false,
    },
    component: () => import('@/views/customer/archive/index.vue'),
},
```

### TabBar 主页 → `src/router/menu.ts`

```ts
{
    path: '/customer',
    name: 'Customer',
    meta: {
        title: '客户',
        icon: 'ph:user-list-bold',
        keepAlive: true,
    },
    component: () => import('@/views/customer/index.vue'),
},
```

### 详情/表单子页面

只注册在 `modules.ts`，不注册菜单。

## keepAlive 规则

| 页面类型 | keepAlive |
|----------|-----------|
| 列表页 | `true`（保留搜索条件 + 滚动位置） |
| 详情页 | `false` |
| 表单页 | `false` |

## 注意事项

- 路由 `name` = `defineOptions({ name })` = `<keep-alive :include>`，三者必须一致
- path 使用 camelCase（`/customerArchive`）
- name 使用 PascalCase（`CustomerArchive`）
