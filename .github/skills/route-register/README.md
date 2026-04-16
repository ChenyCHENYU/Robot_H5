# route-register — 路由注册技能说明

## 工作流位置

```
[page-codegen] → 代码文件 → [route-register] → 路由配置 → 页面可访问
```

## 触发方式

- 对话中提到：`注册路由` / `添加菜单` / `注册页面`

## 两个路由文件说明

| 文件 | 用途 | 规则 |
|------|------|------|
| `src/router/modules.ts` | 所有业务子页面 | 子页面、详情页、表单页均注册于此 |
| `src/router/menu.ts` | TabBar 底部菜单主页 | 只有 TabBar 显示的主页面 |

## name 一致性三角

路由 `name` / `defineOptions({ name })` / `<keep-alive :include>` **三者必须完全一致**：

```
路由 name: 'CustomerArchive'
          ↕ 完全相同
defineOptions({ name: 'CustomerArchive' })
          ↕ 完全相同
keepAlive include: ['CustomerArchive']
```

## 已知局限（Gaps）

- 动态路由（权限路由）暂未集成，当前为静态路由配置
- 路由过渡动画方向（左进右出/右进左出）目前在 `src/App.vue` 统一控制，不支持页面级配置
- 二级 TabBar（详情页内部的 Tab）不在本技能范围，需手动处理

## 维护指引

- 新增路由后运行 `pnpm type-check` 确认路由类型无误
- TabBar 菜单顺序与 `src/router/menu.ts` 中数组顺序一致，调整顺序直接排序数组
- 路由 `path` 使用 camelCase（`/customerArchive`），`name` 使用 PascalCase（`CustomerArchive`）
