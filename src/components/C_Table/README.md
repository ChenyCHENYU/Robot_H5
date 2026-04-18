# C_Table — 移动端卡片列表组件

> 配置驱动的上拉加载 + 下拉刷新卡片列表，替代传统表格在移动端的展示形态。

## 基本用法

```vue
<template>
  <C_Table
    :columns="columns"
    :data="list"
    :total="total"
    :loading="loading"
    :operations="operations"
    @load="handleLoad"
    @refresh="handleRefresh"
  />
</template>

<script setup lang="ts">
import type { TableColumn, TableOperation } from '#/Table/type';

const columns: TableColumn[] = [
  { key: 'name', label: '客户名称', primary: true },
  { key: 'code', label: '编号', secondary: true },
  { key: 'status', label: '状态', alignRight: true, tagMap: {
    active: { text: '活跃', type: 'success' },
    inactive: { text: '停用', type: 'danger' },
  }},
  { key: 'contactName', label: '联系人', meta: true },
  { key: 'salesPerson', label: '业务员', meta: true },
];

const operations: TableOperation[] = [
  { label: '查看', onClick: (row) => router.push(`/detail/${row.id}`) },
  { label: '删除', type: 'danger', onClick: (row) => handleDelete(row) },
];
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn<T>[]` | — | **必填**，列配置数组 |
| `data` | `T[]` | `[]` | 表格数据 |
| `total` | `number` | `0` | 总条数（用于判断加载完毕） |
| `loading` | `boolean` | `false` | 加载状态 |
| `error` | `boolean` | `false` | 错误状态 |
| `finished` | `boolean` | `false` | 是否已加载全部 |
| `disablePullRefresh` | `boolean` | `false` | 禁用下拉刷新 |
| `pageSize` | `number` | `10` | 每页大小 |
| `operations` | `TableOperation<T>[]` | `[]` | 行内操作按钮 |
| `emptyText` | `string` | `'暂无数据'` | 空状态描述 |
| `rowKey` | `string` | `'id'` | 行唯一标识字段 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `load` | `(pageNo: number, pageSize: number)` | 上拉加载更多 |
| `refresh` | — | 下拉刷新 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `empty` | 自定义空状态 |
| `cell-{key}` | 自定义某列单元格渲染（作用域：`{ row, col }`） |

## Expose

| 方法 | 说明 |
|------|------|
| `refresh()` | 手动触发刷新 |

## TableColumn 配置

```ts
interface TableColumn<Row> {
  key: string;          // 字段名
  label: string;        // 列标题
  primary?: boolean;    // 主标题（卡片第一行大字）
  secondary?: boolean;  // 副标题（卡片第二行）
  tagMap?: TableTagMap; // Tag 颜色映射（自动渲染 VanTag）
  slot?: boolean;       // 启用自定义插槽 cell-{key}
  alignRight?: boolean; // 右侧对齐（显示在卡片头部右侧）
  format?: (val, row) => string; // 格式化函数
  meta?: boolean;       // 底部 meta 信息行
  hidden?: boolean;     // 隐藏列
}
```

## TableOperation 配置

```ts
interface TableOperation<Row> {
  label: string;                    // 按钮文案
  type?: TagType;                   // 按钮类型（primary/danger/warning...）
  icon?: string;                    // 图标 UnoCSS 类名
  show?: (row: Row) => boolean;     // 条件显示
  disabled?: (row: Row) => boolean; // 条件禁用
  onClick: (row: Row) => void;      // 点击回调
}
```

## 卡片布局说明

```
┌──────────────────────────────────┐
│ [primary 主标题]     [Tag] [Tag] │  ← head-left + head-right
│ [secondary 副标题]               │
├──────────────────────────────────┤
│ 联系人: 张三    业务员: 李四     │  ← meta 区域（2列网格）
│ 创建人: 王五    创建时间: ...    │
├──────────────────────────────────┤
│              [查看] [删除]       │  ← operations 操作按钮
└──────────────────────────────────┘
```
