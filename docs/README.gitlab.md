# GitLab 内网 API 图片预览

此页提供普通 `/-/raw/` 图片链路之外的兼容入口。所有图片均来自 `wl-h5-template` 的 `main` 分支，通过同一内网 GitLab 的 Repository Files API 读取。

GitLab 官方支持 API 使用现有浏览器登录会话认证，无需在图片地址中保存令牌。该企业实例是否能通过此入口返回 PNG，需要在已登录浏览器中确认。参考：[会话认证](https://docs.gitlab.com/api/rest/authentication/#session-cookie)、[文件原始内容接口](https://docs.gitlab.com/api/repository_files/#retrieve-a-raw-file-from-a-repository)。

[返回完整 README](../README.md)

## Robot H5

![Robot H5 — 企业移动应用，从浏览器到 App 与 PDA](https://ytiop-gitlab.walsin.com.cn/api/v4/projects/walsin-digitalization%2Fwl-common%2Fwl-h5-template/repository/files/docs%2Fassets%2Frobot-h5-banner.png/raw?ref=main)

## 页面预览

| 登录 | 首页 | 客户档案 |
| :---: | :---: | :---: |
| [![Robot H5 登录页面](https://ytiop-gitlab.walsin.com.cn/api/v4/projects/walsin-digitalization%2Fwl-common%2Fwl-h5-template/repository/files/docs%2Fassets%2Flogin.png/raw?ref=main)](https://ytiop-gitlab.walsin.com.cn/walsin-digitalization/wl-common/wl-h5-template/-/blob/main/docs/assets/login.png) | [![Robot H5 首页](https://ytiop-gitlab.walsin.com.cn/api/v4/projects/walsin-digitalization%2Fwl-common%2Fwl-h5-template/repository/files/docs%2Fassets%2Fdashboard.png/raw?ref=main)](https://ytiop-gitlab.walsin.com.cn/walsin-digitalization/wl-common/wl-h5-template/-/blob/main/docs/assets/dashboard.png) | [![客户档案页面](https://ytiop-gitlab.walsin.com.cn/api/v4/projects/walsin-digitalization%2Fwl-common%2Fwl-h5-template/repository/files/docs%2Fassets%2Fcustomer.png/raw?ref=main)](https://ytiop-gitlab.walsin.com.cn/walsin-digitalization/wl-common/wl-h5-template/-/blob/main/docs/assets/customer.png) |

## 如果仍然无法显示

点击页面预览图片可进入 GitLab 文件预览。若 API 返回 401、403 或 `Project Not Found`，请确认同一浏览器已登录且可读取该仓库。若文件预览可用而两条图片链路均不可用，需要 GitLab 维护人员检查文件返回和代理规则；更换图片格式不能解决这类访问问题。
