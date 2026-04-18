# C_PullRefreshList — 下拉刷新 + 上拉加载列表

> 基于 VanPullRefresh + VanList 封装，内置分页逻辑和状态管理，适合通用无限滚动列表。

## 基本用法

```vue
<template>
  <C_PullRefreshList ref="listRef" @onLoad="fetchData">
    <template #list="{ list }">
      <div v-for="item in list" :key="item.id" class="card">
        {{ item.name }}
      </div>
    </template>
  </C_PullRefreshList>
</template>

<script setup lang="ts">
import type { PullRefreshListInstance } from '@/components/C_PullRefreshList/index.vue';

const listRef = ref<PullRefreshListInstance<any>>();

const fetchData = async (page: number, pageSize: number) => {
  try {
    const { records, total } = await getList({ page, pageSize });
    listRef.value?.updateList(records, total);
  } catch {
    listRef.value?.setError();
  }
};
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `disabled` | `boolean` | `false` | 禁用下拉刷新 |
| `offset` | `number` | `100` | 触发加载的底部距离 |
| `immediateCheck` | `boolean` | `true` | 初始化时立即检查滚动位置 |
| `pageSize` | `number` | `10` | 每页数据条数 |
| `showFinishedTextNumber` | `number` | `6` | 超过此条数才显示"没有更多了" |
| `pullDownPullingText` | `string` | `'下拉即可刷新...'` | 下拉中文案 |
| `pullDownLoosingText` | `string` | `'释放立即刷新...'` | 释放时文案 |
| `pullDownLoadingText` | `string` | `'正在刷新...'` | 刷新中文案 |
| `pullDownSuccessText` | `string` | `'刷新成功'` | 刷新成功文案 |
| `pullUpLoadingText` | `string` | `'正在加载...'` | 加载中文案 |
| `pullUpFinishedText` | `string` | `'没有更多了'` | 加载完毕文案 |
| `pullUpErrorText` | `string` | `'加载失败，点击重试'` | 加载失败文案 |
| `emptyDataText` | `string` | `'暂无数据'` | 空数据文案 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `onLoad` | `(page: number, pageSize: number)` | 加载数据（首次 + 翻页 + 刷新） |
| `onLoadSuccess` | `(data: T[], total: number)` | 数据加载成功回调 |
| `onLoadError` | — | 数据加载失败回调 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `list` | 列表内容区（作用域：`{ list }`） |
| `empty` | 空状态自定义 |
| `pulling` | 下拉中自定义 |
| `loosing` | 释放时自定义 |
| `loading` | 刷新中自定义 |
| `load-loading` | 加载中自定义 |
| `load-finished` | 加载完毕自定义 |
| `load-error` | 加载失败自定义 |

## Expose

| 方法 | 说明 |
|------|------|
| `updateList(data, total?)` | 更新列表数据（内部自动判断追加/替换） |
| `setError()` | 设置加载失败状态 |
| `reset()` | 重置列表（清空数据 + 页码） |
| `refresh()` | 手动触发刷新 |
| `list` | 当前列表数据（只读） |

## 与 C_Table 的区别

| 维度 | C_PullRefreshList | C_Table |
|------|-------------------|---------|
| 定位 | 通用列表容器 | 配置驱动卡片列表 |
| 内容渲染 | 完全自定义（slot） | 配置驱动（columns） |
| 适用场景 | 自由布局列表 | 标准 CRUD 卡片列表 |
