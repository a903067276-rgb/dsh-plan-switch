# 安装指南（dsh-plan-switch）

## 安装（推荐：官方 bundle 一行安装）

```sh
dsh plugin --profile web add "github:a903067276-rgb/dsh-plan-switch#main"
```

装完**重启 `dsh web`**。更新时 `dsh plugin --profile web update dsh-plan-switch`，重启生效。

> **需要 pnpm**：`dsh plugin` 是 pnpm 转发器，PATH 里没有 pnpm 会直接失败。

## 安装（兜底：手动挂载，macOS 实测路径）

1. 把仓库放到本地，例如 `~/Documents/DSH/plugin-dev/plan-switch`。
2. 让 web profile 能按包名解析到它：

   ```bash
   ln -s ~/Documents/DSH/plugin-dev/plan-switch ~/.dsh/profiles/web/node_modules/dsh-plan-switch
   ```

3. 在 `~/.dsh/cordis.patch.yml` 追加单 entry（示例见
   [`examples/cordis.patch.example.yml`](../examples/cordis.patch.example.yml)）：

   ```yaml
   - insert:
       - id: plan-switch
         name: 'dsh-plan-switch'
   ```

4. 重启 `dsh web`。

## 验证是否装好

- 浏览器刷新后，输入框工具行出现「进 Plan」按钮（与「📎 上传」「📊 HUD」并列）；
- 点按钮 → 进入 plan 模式（输入框出现 plan 提示）；再点 → 退出。

## 卸载

- bundle 安装：`dsh plugin --profile web remove dsh-plan-switch`，重启 `dsh web`。
- 手动挂载：删除 `~/.dsh/cordis.patch.yml` 里的 entry、删除软链，重启 `dsh web`。

## 平台支持

| 平台 | 状态 |
|---|---|
| macOS | ✅ 开发环境，全功能实测 |
| Linux / Windows | ⚠️ 未实测；架构上预期可用（纯前端按钮，无平台依赖） |
