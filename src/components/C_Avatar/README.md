# C_Avatar

使用本地 Robot 插画作为默认头像。自定义图片加载期间或加载失败时继续显示默认头像，切换图片地址后重新加载。

```vue
<C_Avatar :src="userStore.getUserInfo.avatar" class="profile__avatar" />
```

`src` 可选，空值显示默认头像；`alt` 默认为“用户头像”。通过外部类调整头像宽高，组件自动保持圆形裁切。
