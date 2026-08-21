# dsh-plan-switch 📋

[English](README.md) | [简体中文](README.zh-CN.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

A one-click **enter/exit Plan mode** button for the DSH web input bar (a quick-click shortcut for `/plan`) — a plugin for DeepSeek Harness (`dsh`) web.

*Unofficial project: independently developed and maintained by a community member, not an official DeepSeek product.*

## Screenshot

![dsh-plan-switch plan button in the input bar](assets/plan-button.png)

The checklist icon button at the left end of the input tool row (official DSH design tokens, follows dark/light theme).

## Features

- **One-click enter/exit Plan mode**: a checklist icon button at the left end of the input tool row; clicking it runs the official `/plan` toggle command.
- **Hides while Plan mode is active**: the button hides itself and the official plan card takes over the status display — there is never a duplicated indicator.
- **Pending-switch guard**: while a `/plan` toggle is queued, the button is disabled (the same "switching" semantics as the official plan chip), so a stray click can't reverse the switch.
- **Live state**: the button follows the plan state through the official projection, so changes from any entry point (`/plan` command, official chip, agent switching mid-run) are reflected in real time.

## Install

Official bundle install (one line):

```sh
dsh plugin --profile web add "github:a903067276-rgb/dsh-plan-switch#main"
```

Restart `dsh web` after installing (bundle layers are composed at startup). Requires pnpm on PATH (`dsh plugin` forwards to pnpm).

Manual mount (fallback): see [docs/install.md](docs/install.md) — symlink into `~/.dsh/profiles/web/node_modules/` plus a single entry in `~/.dsh/cordis.patch.yml`, then restart.

## Usage

A checklist icon button appears at the left end of the input tool row (official DSH design tokens, follows dark/light theme). Click it to enter plan mode — the same as typing `/plan`. While plan mode is active the button hides itself: the official plan card takes over the status display, so there is never a duplicated indicator; while a `/plan` toggle is pending the button is disabled, so a second click can't reverse the switch.

## Platform support

| Platform | Status |
|---|---|
| macOS | ✅ fully tested (development environment) |
| Linux | ⚠️ expected to work (pure frontend button, no platform dependency), untested |
| Windows | ⚠️ expected to work (pure frontend button, no platform dependency), untested |

## Requirements

- DSH web >= 0.1.0-rc.8 (run with `dsh web`) — the current code calls the official `commands.execute` with its 3-argument contract (added in rc.8; rc.6/rc.7 use 2 arguments and reject the call)
- **Version compatibility**:

| Your DSH version | Install this | Note |
|---|---|---|
| 0.1.0-rc.8 and newer (incl. 0.1.1-rc.1) | `main` (v0.3.1+) | Full features |
| 0.1.0-rc.6 – 0.1.0-rc.7 | `v0.3.0` — `dsh plugin add github:a903067276-rgb/dsh-plan-switch#v0.3.0` | Uses the 2-argument `commands.execute` contract |

- No host-side setup: the host half is a no-op — the whole plugin is a client-side button that runs the official `/plan` command, so nothing extra is required on any platform.

## How it works

- **Host** (`lib/index.js`): no behavior — this is a pure UI plugin; the client half is discovered through the `dsh.client` declaration in `package.json` (`exports["./client"]`).
- **Client** (`lib/client.js`): registers the checklist icon button in the `conversation.input.left` seat using official DSW design tokens (follows dark/light theme); reads plan state live through `useProjection("plan")`; clicking executes the official `/plan` command via `ctx.remote.commands.execute(sessionId, "/plan", [])` — the whole flow stays on the official command chain.
- **State handling**: the effective plan state mirrors the official PlanChip algorithm (`pending ? !active : active`). While plan mode is active the button returns `null` (hidden — the official plan card owns the indicator, no duplicate); while a toggle is pending the button is disabled so a second click can't reverse the switch; command failures turn the button error-colored with the message in its tooltip.

## Notes

- Pure client-side: no host routes, no file writes, no stored data.
- Restart `dsh web` after installing or updating (bundle layers are composed at startup); client-side edits apply on a page refresh.

## Development

- Source: `lib/index.js` (host side, no-op), `lib/client.js` (web injection)
- Workflow: edit locally → push to `main` → `pnpm update` to verify the install

## License

[MIT](LICENSE)
