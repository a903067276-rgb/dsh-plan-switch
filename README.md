# dsh-plan-switch

[English](README.md) | [简体中文](README.zh-CN.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

One-click **enter/exit Plan mode** for the DSH web input bar (a quick-click shortcut for `/plan`).

## Screenshot

![dsh-plan-switch plan button in the input bar](assets/plan-button.png)

## Install

```bash
dsh plugin --profile web add "github:a903067276-rgb/dsh-plan-switch#main"
```

## Usage

A capsule button appears next to the conversation input bar. Click it to enter or exit plan mode — same as typing `/plan` or `/plan off`.

## Development

- Source: `lib/index.js` (server side), `lib/client.js` (web injection)
- Workflow: edit locally → push to `main` → `pnpm update` to verify the install

## Platform support

| Platform | Status |
|---|---|
| macOS | ✅ fully tested (development environment) |
| Linux / Windows | ⚠️ expected to work (pure frontend button, no platform dependency), untested |
