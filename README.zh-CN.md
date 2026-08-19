# dsh-plan-switch 📋

[English](README.md) | [简体中文](README.zh-CN.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

输入框**一键进/出 Plan 模式**按钮 —— DeepSeek Harness（dsh）web 插件（`/plan` 的快捷点击）。

*非官方项目：社区成员独立开发维护，非 DeepSeek 官方产品。*

## 截图

![dsh-plan-switch 输入框 Plan 按钮](assets/plan-button.png)

输入框工具行左侧的**清单图标按钮**（官方 dsw 设计风格，跟随深浅色主题）。

## 功能

- **一键进/出 Plan 模式**：输入框工具行左侧的清单图标按钮，点击执行官方 `/plan` 切换命令（快捷点击）。
- **Plan 模式中自动隐藏**：plan 进行中按钮隐藏自身，状态由官方 Plan 卡片接管显示——不会出现重复指示。
- **切换 pending 防反**：`/plan` 切换排队期间按钮禁用（语义等同官方 Plan 圆片的"切换中"），防止误点反向切换。
- **状态实时同步**：按钮通过官方投影实时读取 plan 状态，任何入口（`/plan` 命令、官方圆片、agent 运行中切换）的变化都即时反映。

## 安装

官方 bundle 一行安装：

```sh
dsh plugin --profile web add "github:a903067276-rgb/dsh-plan-switch#main"
```

装完重启 `dsh web`（bundle 层在启动时合成）。需要 pnpm（`dsh plugin` 是 pnpm 转发器）。

手动兜底：详见 [docs/install.md](docs/install.md) —— 软链到
`~/.dsh/profiles/web/node_modules/` + `~/.dsh/cordis.patch.yml` 单 entry，重启生效。

## 用法

输入框工具行左侧的**清单图标按钮**（官方 dsw 设计风格，跟随深浅色主题），点击进入 plan 模式（等同 `/plan`）。plan 模式进行中按钮自动隐藏——状态由官方 Plan 卡片接管，不会出现重复指示；`/plan` 切换 pending 期间按钮禁用，防止再点反向切换。

## 平台支持

| 平台 | 状态 |
|---|---|
| macOS | ✅ 全功能实测（开发环境） |
| Linux | ⚠️ 预期可用（纯前端按钮，无平台依赖），未实测 |
| Windows | ⚠️ 预期可用（纯前端按钮，无平台依赖），未实测 |

## 环境要求

- DSH web（`dsh web` 运行）
- 无需任何 host 侧配置：host 半为空实现——整个插件就是浏览器侧一个按钮，调用官方 `/plan` 命令，全平台无额外依赖

## 工作原理

- **Host**（`lib/index.js`）：无行为——纯 UI 插件；client 半通过 `package.json` 的 `dsh.client` 声明被发现（`exports["./client"]`）。
- **Client**（`lib/client.js`）：`conversation.input.left` 插槽注册清单图标按钮（官方 dsw 设计 token，跟随明暗主题）；通过 `useProjection("plan")` 实时读取 plan 状态；点击经 `ctx.remote.commands.execute(sessionId, "/plan")` 执行官方 `/plan` 命令——全流程走官方命令链。
- **状态处理**：有效 plan 状态照抄官方 PlanChip 算法（`pending ? !active : active`）。plan 模式进行中按钮返回 `null`（隐藏——指示归官方 Plan 卡片，不重复）；切换 pending 期间按钮禁用，防第二次点击反向；命令失败按钮变错误色，错误信息显示在 tooltip。

## 注意事项

- 纯 client 侧：无 host 路由、不写文件、不存数据。
- 安装/更新后重启 `dsh web`（bundle 层在启动时合成）；client 改动刷新页面即可生效。

## 开发

- 源码：`lib/index.js`（host 侧，空实现）、`lib/client.js`（web 端注入）
- 开发流程：本地改 → push main → `pnpm update` 验证安装

## 许可证

[MIT](LICENSE)
