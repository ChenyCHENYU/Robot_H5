# convention-audit — 规范审计技能说明

## 工作流位置

```
任意代码文件 → [convention-audit] → 偏差报告（Error/Warning/Info）
```

可在任何阶段调用，通常在 `page-codegen` 生成代码后运行。

## 触发方式

- 对话中提到：`审计规范` / `代码检查` / `规范检查`

## 检查优先级

| 级别 | 含义 | 处理方式 |
|------|------|---------|
| 🔴 Error | 违反项目强制规范，必须修复 | 立即修复，不允许提交 |
| 🟡 Warning | 建议遵守，影响一致性 | 尽量修复 |
| 🟢 Info | 优化建议，影响质量 | 视情况处理 |

## 与 vue-tsc 的分工

| 工具 | 检查范围 |
|------|---------|
| `pnpm type-check`（vue-tsc） | TypeScript 类型错误 |
| convention-audit | 项目规范（命名/样式令牌/BEM/API 格式等） |

两者互补，都需要通过。

## 执行方式

convention-audit 是 Skills 工作流的**自动终结步骤**，不需要手动触发。

### 自动执行（主要方式）

在 `copilot-instructions.md` 第 10 条中定义为强制后置步骤：
- AI 每次生成/修改 `.vue` / `.scss` / `data.ts` / `api/*.ts` 后自动运行
- P0 规则静默修复，P1 修复后简报，P2 仅报告
- 最后 `pnpm type-check` 确认零错误后才交付

### 手动触发（补充方式）

在 Copilot Chat 中输入 `审计规范 src/views/xxx/` 可对指定模块做全量审计。
规则详见 `.github/prompts/convention-audit.prompt.md`。

## 与其他工具的分工

| 工具 | 检查范围 | 阻断提交 |
|------|---------|----------|
| `commitlint` | Git commit message 格式 | ✅ 是 |
| `ESLint` (lint-staged) | JS/TS 代码质量 | ✅ 是 |
| `vue-tsc` (type-check) | TypeScript 类型 | ✅ CI 门禁 |
| **convention-audit** | 设计令牌 / BEM / 间距 / 安全区 | ❌ 不阻断，AI 按需扫描修复 |

## 已知局限（Gaps）

- 原型字段完整性对比依赖 AI 判断，无法 100% 自动化
- 暗色模式视觉验证仍需人工检查（AI 无法渲染页面）
- 跨组件的令牌一致性（如同一颜色在不同模块用了不同令牌）需全量扫描才能发现

## 维护指引

- 新增规范时，同步更新 `skills.md` 和 `.github/prompts/convention-audit.prompt.md`
- 当某个 P1 规则频繁触发且团队达成共识后，升级为 P0
- Prompt 文件中的「可用设计令牌速查」需与 `src/styles/variables.scss` 保持同步
