# dsh-plan-switch

[English](README.md) | [简体中文](README.zh-CN.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

输入框**一键进/出 Plan 模式**的 DSH web 小插件（`/plan` 的快捷点击）。

## 截图

![dsh-plan-switch 输入框 Plan 按钮](assets/plan-button.png)

## 安装

```bash
dsh plugin --profile web add "github:a903067276-rgb/dsh-plan-switch#main"
```

## 用法

在对话输入框旁出现 Plan 快捷按钮，点击即进入/退出 plan 模式。

## 开发

- 源码：`lib/index.js`（server 端）、`lib/client.js`（web 端注入）
- 开发流程：本地改 → push main → `pnpm update` 验证安装

## 平台支持

| 平台 | 状态 |
|---|---|
| macOS | ✅ 全功能实测（开发环境） |
| Linux / Windows | ⚠️ 架构上预期可用（纯前端按钮，无平台依赖），未实测 |
