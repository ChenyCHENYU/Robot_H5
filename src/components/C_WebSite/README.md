# C_WebSite — WebView 容器组件

> iframe 嵌入外部页面，支持 NavBar 返回 + 刷新 + 加载状态。

## 基本用法

通过路由参数传递 URL 和标题：

```ts
router.push({
  path: '/webSite',
  query: { url: 'https://example.com', title: '外部页面' },
});
```

## 特性

- 自动从路由 query 读取 `url` 和 `title`
- 加载中显示 Toast Loading
- 右侧刷新按钮
- iframe sandbox 安全策略：`allow-same-origin allow-scripts allow-forms allow-popups`
