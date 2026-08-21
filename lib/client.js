window.__ModuleLoader__.load({
  id: "dsh-plan-switch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    const inject = ["slots", "remote", "remote.commands"];

    // ── 官方 dsw 风格（2026-08-18 样板）：28px 图标按钮、hover 反馈、active/error 态 ──
    // token 全部来自官方 design-platform.css（--dsw-alias-*），跟随明暗主题。
    if (typeof document !== "undefined" && !document.getElementById("dsh-plan-switch-style")) {
      const style = document.createElement("style");
      style.id = "dsh-plan-switch-style";
      style.textContent = [
        ".dsh-plan-switch-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex:none;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#666);cursor:pointer;padding:0;}",
        ".dsh-plan-switch-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,0.06));}",
        ".dsh-plan-switch-btn:disabled{opacity:.5;cursor:default;}",
        // 命令失败：错误色
        ".dsh-plan-switch-btn.is-error{color:var(--dsw-alias-state-error-primary,#d03050);}",
      ].join("\n");
      document.head.appendChild(style);
    }

    // 计划清单图标（线性风格，对齐官方 Icon*Outline）：圆角卡片 + 三条项目线
    function PlanIcon() {
      return react.createElement("svg", {
        width: 14,
        height: 14,
        viewBox: "0 0 16 16",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { flex: "none", display: "block" },
      },
        react.createElement("rect", { x: 3, y: 3, width: 10, height: 11, rx: 2 }),
        react.createElement("path", { d: "M6 6.5h4" }),
        react.createElement("path", { d: "M6 9h4" }),
        react.createElement("path", { d: "M6 11.5h2" })
      );
    }

    function apply(ctx) {
      ctx.slots.inject("conversation.input.left", () => ctx.slots.register(
        { name: "conversation.input.left", id: "dsh-plan-switch" },
        (props) => {
          // plan 状态走官方投影，实时同步（/plan 命令、官方 Plan 圆片等任何入口的变化都反映）
          const plan = typeof props.useProjection === "function" ? props.useProjection("plan") : undefined;
          const [busy, setBusy] = react.useState(false);
          const [notice, setNotice] = react.useState(null);
          const sessionId = props.sessionId;

          // 有效目标：pending 时以目标为准（照抄官方 PlanChip 的算法）
          const active = plan !== undefined && (plan.pending ? !plan.active : plan.active);
          // 排队生效中（命令已发、plan 状态尚未落地）：禁用按钮，避免"退出排队中再点反而重新进入"
          const pending = plan !== undefined && plan.pending === true;

          const toggle = () => {
            if (busy) return;
            setBusy(true);
            setNotice(null);
            // 按钮只在非 plan 模式显示（plan 中由官方卡片接管），点击 = 进入 plan
            // rc.8 契约：commands.execute 需 3 参（sessionId, line, images），
            // 缺第三参会抛 "expected 3 business argument(s) ... got 2"（2026-08-21 修复）
            ctx.remote.commands.execute(sessionId, "/plan", []).then((result) => {
              if (!result || !result.ok) {
                const message = result && result.error ? (result.error.message || result.error.code || "命令失败") : "命令失败";
                setNotice(message);
                return;
              }
              if (result.value === undefined) setNotice("未知命令");
            }).catch((error) => {
              setNotice(error instanceof Error ? error.message : String(error));
            }).finally(() => setBusy(false));
          };

          const title = notice
            ? notice
            : "进入 plan 模式（等同 /plan）";

          // plan 模式进行中：官方 Plan 卡片负责显示状态，隐藏我们的按钮（避免双指示）；
          // 退出排队中（pending 且目标是 off）：active=false，按钮显示但禁用（防反向点击）。
          if (active) return null;

          return react.createElement("button", {
            type: "button",
            className: "dsh-plan-switch-btn"
              + (notice ? " is-error" : ""),
            onClick: toggle,
            disabled: busy || pending,
            title: title,
            "aria-label": title,
          }, PlanIcon());
        }
      ));
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
