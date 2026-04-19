# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://git.yourcompany.com/robot/robot-h5/compare/v1.2.0...v1.3.0) (2026-04-19)


### ✨ 新功能

* **auth:** 集成双网关服务隔离与权限体系 ([934ca28](https://git.yourcompany.com/robot/robot-h5/commit/934ca28a2938f43ad38b529e5a203466014bd939))

## [1.2.0](https://git.yourcompany.com/robot/robot-h5/compare/v1.1.1...v1.2.0) (2026-04-19)


### ♻️ 重构

* **api:** 扁平化 API 目录结构，补充接口规范文档 ([d94dd74](https://git.yourcompany.com/robot/robot-h5/commit/d94dd74cbbf3ae9f5bd6d5bf2739e5d486669eb0))


### ✨ 新功能

* **convention-audit:** 改为工作流自动终结步骤，代码变更后自动审计修复 ([e812f7c](https://git.yourcompany.com/robot/robot-h5/commit/e812f7cb1ebe570494cc4f08996294240d212ff2))
* **convention-audit:** 新增 AI 可执行审计 prompt，补充 radius-full 令牌 ([206aaa2](https://git.yourcompany.com/robot/robot-h5/commit/206aaa27794594bb7f3e09920018ebada397f157))
* **convention-audit:** 补充运行时安全+原型精细度审计，同步多 AI 编辑器规则 ([c8010a8](https://git.yourcompany.com/robot/robot-h5/commit/c8010a862492d9ec508a1479350d0d536aec693b))
* **skills:** 新增 api-spec 技能，增强 mock-gen 端点模板，更新工作流 ([021f522](https://git.yourcompany.com/robot/robot-h5/commit/021f522424fd5f833e19650323a970c1cb273b33))
* **skills:** 新增 Kiro/Trae/Claude/AGENTS 编辑器支持，同步 Skills 调度注册表 ([c967d47](https://git.yourcompany.com/robot/robot-h5/commit/c967d47e62a0d6719315d2f6ee7171193aff9997))

### [1.1.1](https://git.yourcompany.com/robot/robot-h5/compare/v1.1.0...v1.1.1) (2026-04-16)


### ♻️ 重构

* **core:** 全面清理工程配置与类型安全 ([66221c4](https://git.yourcompany.com/robot/robot-h5/commit/66221c4e085531a90eec997a9ad8e78e45430a3e))

## 1.1.0 (2026-04-16)


### ♻️ 重构

* **login:** 组件文件夹3文件结构 + 修复注册页可滚动 + UnoCSS important双重保障 ([e876245](https://git.yourcompany.com/robot/robot-h5/commit/e8762454f102fa2a5ecd09fefe5fa9b291ea466b))
* 重构项目结构、组件体系与性能优化 ([b37a97a](https://git.yourcompany.com/robot/robot-h5/commit/b37a97ac0568e1939f697636d3f932dba977dde5))


### ⚡ 性能优化

* **ui:** 页面过渡动画接入+滚动修复+体验增强 ([21fdcb9](https://git.yourcompany.com/robot/robot-h5/commit/21fdcb93bacb20a33f60939c09e865bce37851e4))


### 🐛 Bug 修复

* **components:** 统一组件模板引用格式为 C_ 前缀 ([f3a95ed](https://git.yourcompany.com/robot/robot-h5/commit/f3a95edf29d7a075a521e38bee296da0a41a28ee))
* **css:** 根治 [@layer](https://git.yourcompany.com/layer) 优先级体系 + 清理冗余代码 ([0cc4856](https://git.yourcompany.com/robot/robot-h5/commit/0cc4856a6d63bd2279470f7cdd34997275706f3d))
* **login:** 修复 SCSS 括号不匹配语法错误 ([f9324ac](https://git.yourcompany.com/robot/robot-h5/commit/f9324acc4bb720d7f85615b34df071b77527712c))
* **login:** 修复内容靠右偏移 - 恢复 row flex 居中 ([9126988](https://git.yourcompany.com/robot/robot-h5/commit/9126988ec279b3cbd5357050ba9a9eb9d2e0bc13))
* **login:** 修复登录页内容水平偏移 ([d5594ec](https://git.yourcompany.com/robot/robot-h5/commit/d5594ec842c60d2fecd3a6ec633a0b8564c0b5dd))
* **login:** 回退到已验证可用的居中布局参数 ([b6bbc46](https://git.yourcompany.com/robot/robot-h5/commit/b6bbc463bd3f80e3630b4b9d22b1903a35a7a6ca))
* **login:** 根治登录页右偏与右侧裁切 ([68f4bb7](https://git.yourcompany.com/robot/robot-h5/commit/68f4bb78835f8ce38476e7cee951a3b771c80570))
* **login:** 间距优化 + 记住我/忘记密码精简 ([044d947](https://git.yourcompany.com/robot/robot-h5/commit/044d947453957a330f49e1332b71d77340370dda))
* **perf+ui:** 修复页面导航刷新bug、精简图标集、重设计表单表格组件 ([6927c70](https://git.yourcompany.com/robot/robot-h5/commit/6927c70033a8aaa5668c53d811d2af15ab31849b))
* **ui:** 修复样式穿透与 TypeScript 类型错误 ([47a53a7](https://git.yourcompany.com/robot/robot-h5/commit/47a53a747045eb24fc44bf77d4cc9c805436bef8))
* **ui:** 修复虚拟状态栏在桌面预览时不显示的问题 ([8060693](https://git.yourcompany.com/robot/robot-h5/commit/80606930eb277589c9ac7ab16a475b703b330f24))
* **ui:** 完善外壳状态栏组件名称及文档迁移 ([648f368](https://git.yourcompany.com/robot/robot-h5/commit/648f3684dcc3d70e33238890469a0d616beeaf50))
* **ui:** 彻底修复虚拟状态栏不显示 ([634d67c](https://git.yourcompany.com/robot/robot-h5/commit/634d67c186713244fcc0738f7857cfe74487144f))
* **unocss:** 启用 outputToCssLayers 修复工具类被组件SCSS覆盖问题 ([8be88bd](https://git.yourcompany.com/robot/robot-h5/commit/8be88bd33620c52dedc941057c6af99c768d464e))
* **unocss:** 用 [@layer](https://git.yourcompany.com/layer) 彻底解决工具类被组件SCSS覆盖 ([9009852](https://git.yourcompany.com/robot/robot-h5/commit/90098528f0aa436aaf7ce7b18af9adbf71381688))
* 修复代理配置断裂 + API快捷方法封装 ([aaca9bb](https://git.yourcompany.com/robot/robot-h5/commit/aaca9bba09da242c75c028f0c938cac50e1ef03c))
* 修复多项 UI 交互问题及优化体验 ([70e6591](https://git.yourcompany.com/robot/robot-h5/commit/70e6591ef2a55e912d49d1974b22dc36658b31b2))
* 修复桌面预览状态栏不显示及导入路径错误 ([509f3af](https://git.yourcompany.com/robot/robot-h5/commit/509f3af8607cf722905e8c89f61edfdb5cfb12f1))
* 修复注册/找回密码页截断无法滚动 & 提取表单到data.ts ([f7de023](https://git.yourcompany.com/robot/robot-h5/commit/f7de023380c52eaeebf1e3a8c7685cc54a90fd32))
* 修复登录/注册页无法滚动的根本原因 ([2aa13f3](https://git.yourcompany.com/robot/robot-h5/commit/2aa13f39ff540405c2bfcbd5895da7a9f69fc90d))
* 修复虚拟状态栏不显示及首次加载刷新问题 ([3c799e6](https://git.yourcompany.com/robot/robot-h5/commit/3c799e688f006483b085711ac61d08ad93630477))
* 彻底还原虚拟状态栏原始实现方案 ([9b02abe](https://git.yourcompany.com/robot/robot-h5/commit/9b02abe3cb115cb33fa837ea9edbc446753cf194))


### ✨ 新功能

* **demo+docs:** 重写设备报修表单布局 + 移动端Skills方案文档 ([0f644b8](https://git.yourcompany.com/robot/robot-h5/commit/0f644b8000063d6aa6de48efd246bfb089251fc7))
* **demo:** 修复表单校验重复 + 新增客户档案列表/详情/表单demo ([eb1edb0](https://git.yourcompany.com/robot/robot-h5/commit/eb1edb082e8ad75ecb7de46cef06f36e21e5dc4f))
* **demo:** 新增弹出层/手势/骨架屏/表单/缓存 5 个示例页 ([cc4d6e1](https://git.yourcompany.com/robot/robot-h5/commit/cc4d6e10b33a6f277e9de2e4f0faf4a94a6eeb7d))
* **demo:** 设备报修表单 Liquid Glass 质感重设计 ([60c803a](https://git.yourcompany.com/robot/robot-h5/commit/60c803af48c308105257f8fd0d0e752020f806c1))
* **login:** iOS液态玻璃登录页 + 圆形品牌Logo设计 ([560e252](https://git.yourcompany.com/robot/robot-h5/commit/560e252c7cf6c72ad4e676b6e45128d179d4fb87))
* **logo:** 圆角方块高质感品牌Logo设计 ([7ae9fb5](https://git.yourcompany.com/robot/robot-h5/commit/7ae9fb50258e261fdea3f3b761a0c05ac285a198))
* **perf+ui:** 优化首屏性能、重设导航栏返回按钮、新增 C_Form/C_Table 组件 ([d79bda6](https://git.yourcompany.com/robot/robot-h5/commit/d79bda6a9444339df5a42b93b0f9f9279d326de0))
* **skills:** 类型迁移 + Skills 指令集 + 自动发版 ([89d9f52](https://git.yourcompany.com/robot/robot-h5/commit/89d9f52f036ebbf2f9fae080bb5a93c634eb11fb))
* 新增 C_Icon 通用图标组件 ([37e3769](https://git.yourcompany.com/robot/robot-h5/commit/37e376913bb21bc9c1b3dee68296b9062bf2f262))

## 1.0.0 (2026-04-16)


### ♻️ 重构

* 重构项目结构、组件体系与性能优化 ([b37a97a](https://git.yourcompany.com/robot/robot-h5/commit/b37a97ac0568e1939f697636d3f932dba977dde5))
* **login:** 组件文件夹3文件结构 + 修复注册页可滚动 + UnoCSS important双重保障 ([e876245](https://git.yourcompany.com/robot/robot-h5/commit/e8762454f102fa2a5ecd09fefe5fa9b291ea466b))


### ⚡ 性能优化

* **ui:** 页面过渡动画接入+滚动修复+体验增强 ([21fdcb9](https://git.yourcompany.com/robot/robot-h5/commit/21fdcb93bacb20a33f60939c09e865bce37851e4))


### 🐛 Bug 修复

* 彻底还原虚拟状态栏原始实现方案 ([9b02abe](https://git.yourcompany.com/robot/robot-h5/commit/9b02abe3cb115cb33fa837ea9edbc446753cf194))
* 修复代理配置断裂 + API快捷方法封装 ([aaca9bb](https://git.yourcompany.com/robot/robot-h5/commit/aaca9bba09da242c75c028f0c938cac50e1ef03c))
* 修复登录/注册页无法滚动的根本原因 ([2aa13f3](https://git.yourcompany.com/robot/robot-h5/commit/2aa13f39ff540405c2bfcbd5895da7a9f69fc90d))
* 修复多项 UI 交互问题及优化体验 ([70e6591](https://git.yourcompany.com/robot/robot-h5/commit/70e6591ef2a55e912d49d1974b22dc36658b31b2))
* 修复虚拟状态栏不显示及首次加载刷新问题 ([3c799e6](https://git.yourcompany.com/robot/robot-h5/commit/3c799e688f006483b085711ac61d08ad93630477))
* 修复注册/找回密码页截断无法滚动 & 提取表单到data.ts ([f7de023](https://git.yourcompany.com/robot/robot-h5/commit/f7de023380c52eaeebf1e3a8c7685cc54a90fd32))
* 修复桌面预览状态栏不显示及导入路径错误 ([509f3af](https://git.yourcompany.com/robot/robot-h5/commit/509f3af8607cf722905e8c89f61edfdb5cfb12f1))
* **components:** 统一组件模板引用格式为 C_ 前缀 ([f3a95ed](https://git.yourcompany.com/robot/robot-h5/commit/f3a95edf29d7a075a521e38bee296da0a41a28ee))
* **css:** 根治 [@layer](https://git.yourcompany.com/layer) 优先级体系 + 清理冗余代码 ([0cc4856](https://git.yourcompany.com/robot/robot-h5/commit/0cc4856a6d63bd2279470f7cdd34997275706f3d))
* **login:** 根治登录页右偏与右侧裁切 ([68f4bb7](https://git.yourcompany.com/robot/robot-h5/commit/68f4bb78835f8ce38476e7cee951a3b771c80570))
* **login:** 回退到已验证可用的居中布局参数 ([b6bbc46](https://git.yourcompany.com/robot/robot-h5/commit/b6bbc463bd3f80e3630b4b9d22b1903a35a7a6ca))
* **login:** 间距优化 + 记住我/忘记密码精简 ([044d947](https://git.yourcompany.com/robot/robot-h5/commit/044d947453957a330f49e1332b71d77340370dda))
* **login:** 修复 SCSS 括号不匹配语法错误 ([f9324ac](https://git.yourcompany.com/robot/robot-h5/commit/f9324acc4bb720d7f85615b34df071b77527712c))
* **login:** 修复登录页内容水平偏移 ([d5594ec](https://git.yourcompany.com/robot/robot-h5/commit/d5594ec842c60d2fecd3a6ec633a0b8564c0b5dd))
* **login:** 修复内容靠右偏移 - 恢复 row flex 居中 ([9126988](https://git.yourcompany.com/robot/robot-h5/commit/9126988ec279b3cbd5357050ba9a9eb9d2e0bc13))
* **perf+ui:** 修复页面导航刷新bug、精简图标集、重设计表单表格组件 ([6927c70](https://git.yourcompany.com/robot/robot-h5/commit/6927c70033a8aaa5668c53d811d2af15ab31849b))
* **ui:** 彻底修复虚拟状态栏不显示 ([634d67c](https://git.yourcompany.com/robot/robot-h5/commit/634d67c186713244fcc0738f7857cfe74487144f))
* **ui:** 完善外壳状态栏组件名称及文档迁移 ([648f368](https://git.yourcompany.com/robot/robot-h5/commit/648f3684dcc3d70e33238890469a0d616beeaf50))
* **ui:** 修复虚拟状态栏在桌面预览时不显示的问题 ([8060693](https://git.yourcompany.com/robot/robot-h5/commit/80606930eb277589c9ac7ab16a475b703b330f24))
* **ui:** 修复样式穿透与 TypeScript 类型错误 ([47a53a7](https://git.yourcompany.com/robot/robot-h5/commit/47a53a747045eb24fc44bf77d4cc9c805436bef8))
* **unocss:** 启用 outputToCssLayers 修复工具类被组件SCSS覆盖问题 ([8be88bd](https://git.yourcompany.com/robot/robot-h5/commit/8be88bd33620c52dedc941057c6af99c768d464e))
* **unocss:** 用 [@layer](https://git.yourcompany.com/layer) 彻底解决工具类被组件SCSS覆盖 ([9009852](https://git.yourcompany.com/robot/robot-h5/commit/90098528f0aa436aaf7ce7b18af9adbf71381688))


### ✨ 新功能

* 新增 C_Icon 通用图标组件 ([37e3769](https://git.yourcompany.com/robot/robot-h5/commit/37e376913bb21bc9c1b3dee68296b9062bf2f262))
* **demo+docs:** 重写设备报修表单布局 + 移动端Skills方案文档 ([0f644b8](https://git.yourcompany.com/robot/robot-h5/commit/0f644b8000063d6aa6de48efd246bfb089251fc7))
* **demo:** 设备报修表单 Liquid Glass 质感重设计 ([60c803a](https://git.yourcompany.com/robot/robot-h5/commit/60c803af48c308105257f8fd0d0e752020f806c1))
* **demo:** 新增弹出层/手势/骨架屏/表单/缓存 5 个示例页 ([cc4d6e1](https://git.yourcompany.com/robot/robot-h5/commit/cc4d6e10b33a6f277e9de2e4f0faf4a94a6eeb7d))
* **demo:** 修复表单校验重复 + 新增客户档案列表/详情/表单demo ([eb1edb0](https://git.yourcompany.com/robot/robot-h5/commit/eb1edb082e8ad75ecb7de46cef06f36e21e5dc4f))
* **login:** iOS液态玻璃登录页 + 圆形品牌Logo设计 ([560e252](https://git.yourcompany.com/robot/robot-h5/commit/560e252c7cf6c72ad4e676b6e45128d179d4fb87))
* **logo:** 圆角方块高质感品牌Logo设计 ([7ae9fb5](https://git.yourcompany.com/robot/robot-h5/commit/7ae9fb50258e261fdea3f3b761a0c05ac285a198))
* **perf+ui:** 优化首屏性能、重设导航栏返回按钮、新增 C_Form/C_Table 组件 ([d79bda6](https://git.yourcompany.com/robot/robot-h5/commit/d79bda6a9444339df5a42b93b0f9f9279d326de0))
