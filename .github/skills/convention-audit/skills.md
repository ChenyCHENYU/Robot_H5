# Skill：规范审计 convention-audit

> 触发词：`审计规范` / `代码检查` / `规范检查`

## 检查维度

### 🔴 Error（必须修复）

| 检查项 | 规则 |
|--------|------|
| 硬编码颜色 | 不允许 `#xxx` / `rgb()` / `rgba()`，必须用 `var(--ds-xxx)` |
| 硬编码圆角 | 不允许 `border-radius: Npx`，必须用 `var(--ds-radius-*)` |
| 缺少 defineOptions | `<script setup>` 必须有 `defineOptions({ name: 'PageName' })` |
| 内联 style 块 | 禁止 `<style>` 块，样式必须外置 `.scss` 文件 |
| 类型错误 | `pnpm type-check` 必须零错误 |
| script setup 导出类型 | 禁止在 `<script setup>` 中 `export` 类型，放 `types/{Name}/type.ts` |
| import 未使用 | 不允许未使用的导入 |

### 🟡 Warning（建议修复）

| 检查项 | 规则 |
|--------|------|
| 缺少 C_NavBar | 页面级组件必须以 `<C_NavBar>` 开头 |
| 安全区缺失 | 底部固定栏必须有 `env(safe-area-inset-bottom)` |
| 图标不合规 | 必须用 `i-ph:xxx-bold` 或 `i-ic:xxx`，禁止 CDN |
| API 命名 | 必须遵循 `get/add/update/delete + Module` 命名 |
| 状态映射缺失 | 状态字段必须有 `xxxMap` 常量 + `<VanTag>` 渲染 |
| Vant 类型约束 | VanTag size 只接受 `'large' \| 'medium'`，Picker columns 必须 `PickerOption[]` |

### 🟢 Info（建议优化）

| 检查项 | 规则 |
|--------|------|
| 间距不合规 | 间距值必须是 4 的倍数 |
| 字号不合规 | font-size 必须在 11/12/13/14/15/16/17/20/22/28/34 范围内 |
| data.ts 缺失 | 有重复结构应提取到 data.ts 用 v-for 驱动 |
| Mock 不完整 | Mock 数据应 6-10 条、覆盖所有枚举值 |

## 原型对比检查

生成页面后必须核对：

1. **字段完整性** — data.ts 的 interface 字段 ≥ 原型字段，不可遗漏
2. **按钮文案** — 操作按钮标签必须与原型一字不差（"修改"不可改"编辑"）
3. **状态标签** — 所有状态枚举值都有对应 Map 映射和 VanTag 渲染
4. **按钮条件显示** — 不同状态显示不同按钮时，用 `show: (row) => boolean` 控制
5. **接口对应** — 每个 API 都有 Mock 端点，字段名与前端一致

## 执行步骤

1. 扫描目标文件
2. 逐项匹配规则
3. 输出偏差报告（分 Error / Warning / Info 三级）
4. 提供自动修复建议
