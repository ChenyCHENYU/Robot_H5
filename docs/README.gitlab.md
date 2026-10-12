# GitLab README 图片访问排查

[返回完整 README](../README.md)

## 当前结论

2026-10-12，企业 GitLab 的 README 图片及原始文件链接反馈 404，API 替代入口也无法显示图片。**目前未修复，也未验证到可用的替代图片入口。**

已通过认证后的 Git 拉取确认：`main` 分支存在以下四张有效 PNG，内容与本地一致。

| 文件 | 大小（字节） |
| --- | ---: |
| `docs/assets/robot-h5-banner.png` | 713151 |
| `docs/assets/login.png` | 85897 |
| `docs/assets/dashboard.png` | 134626 |
| `docs/assets/customer.png` | 70267 |

README 的相对路径指向上述文件，图片来源为同一内网 GitLab。更换 SVG/PNG 或外网图床不能解释原始文本文件也返回 404 的现象。

## 实际请求结果

下表的 HTTP 请求**没有携带网页登录会话**，不能代表已登录浏览器中的访问结果。Git 拉取使用仓库已有认证；两者不是同一种认证上下文。

| 请求 | 返回 |
| --- | --- |
| 仓库首页 | 302，跳转 GitLab 登录页 |
| `/-/blob/main/docs/assets/login.png` 文件页 | 302，跳转 GitLab 登录页 |
| `/-/raw/main/docs/assets/login.png` 原始图片 | 404，HTML 错误页 |
| `/-/raw/main/README.md` 原始文本 | 404，HTML 错误页 |
| Repository Files API 原始图片 | 404，`{"message":"404 Project Not Found"}` |
| 使用已有 Git 认证拉取 `main` | 成功，图片文件存在 |

GitLab 官方说明：404 也可能表示请求者无权访问资源；API 路径中的编码字符若被反向代理提前解码，也可能产生 404。因此仅凭这些结果不能确定具体是哪项服务器配置或权限导致问题。参考：[API 状态码与代理排查](https://docs.gitlab.com/api/rest/troubleshooting/)。

## 下一步确认

在当前已登录的同一浏览器中打开 [登录截图文件页](https://ytiop-gitlab.walsin.com.cn/walsin-digitalization/wl-common/wl-h5-template/-/blob/main/docs/assets/login.png)，再点击 GitLab 页面自身的原始文件入口。

| 已登录浏览器中的结果 | 排查方向 |
| --- | --- |
| 文件页本身要求登录或返回 404 | 先确认网页登录账号、仓库权限和当前分支；Git 认证成功不能证明网页账号有访问权限 |
| 文件页可打开，但图片和原始文件仍然 404 | 请 GitLab 维护人员对照该请求检查下载链路、反向代理规则，以及 GitLab/Workhorse 的日志 |
| 文件页与原始图片都能显示，README 仍然破图 | 对照 README 图片的实际请求地址与响应，检查渲染重写、图片代理和缓存 |

## 维护人员检查项

先用有该仓库读取权限的网页账号复现，并记录失败请求的时间、路径、状态码和 `X-Request-Id`（若返回）。对照反向代理、GitLab 和 Workhorse 的日志定位失败位置，再修改相应配置。

Repository Files API 支持项目数字 ID 或 URL 编码的项目路径；若日志确认编码路径被代理改写，可用数字项目 ID 进行对照测试。参考：[文件原始内容接口](https://docs.gitlab.com/api/repository_files/#retrieve-a-raw-file-from-a-repository)。

GitLab 官方支持 API 使用浏览器登录会话，但仍须验证本实例的实际返回。参考：[会话认证](https://docs.gitlab.com/api/rest/authentication/#session-cookie)。
