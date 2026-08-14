window.__ModuleLoader__.load({
  id: "dsh-plan-switch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    const inject = ["slots", "remote", "remote.commands"];

    function apply(ctx) {
      ctx.slots.inject("conversation.input.left", () => ctx.slots.register(
        { name: "conversation.input.left", id: "plan-switch" },
        (props) => {
          // plan 状态走官方投影，实时同步（/plan 命令、官方 Plan 圆片等任何入口的变化都反映）
          const plan = typeof props.useProjection === "function" ? props.useProjection("plan") : undefined;
          const [busy, setBusy] = react.useState(false);
          const [notice, setNotice] = react.useState(null);
          const sessionId = props.sessionId;

          // 有效目标：pending 时以目标为准（照抄官方 PlanChip 的算法）
          const active = plan !== undefined && (plan.pending ? !plan.active : plan.active);

          const toggle = () => {
            if (busy) return;
            setBusy(true);
            setNotice(null);
            ctx.remote.commands.execute(sessionId, active ? "/plan off" : "/plan").then((result) => {
              if (!result || !result.ok) {
                const message = result && result.error ? (result.error.message || result.error.code || "命令失败") : "命令失败";
                setNotice("⚠ " + message);
                return;
              }
              if (result.value === undefined) setNotice("⚠ 未知命令");
            }).catch((error) => {
              setNotice("⚠ " + (error instanceof Error ? error.message : String(error)));
            }).finally(() => setBusy(false));
          };

          let label = active ? "Plan 开" : "进 Plan";
          if (busy) label = "Plan 切换中…";
          if (notice) label = notice;

          return react.createElement("button", {
            type: "button",
            onClick: toggle,
            disabled: busy,
            title: active ? "退出 plan 模式（等同 /plan off）" : "进入 plan 模式（等同 /plan）",
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              padding: "2px 10px",
              fontSize: "13px",
              lineHeight: "20px",
              fontWeight: 500,
              background: active ? "var(--dsw-alias-state-warn-tertiary, rgba(255,180,0,0.15))" : "transparent",
              color: notice ? "var(--dsw-alias-state-error-primary, #d03050)" : (active ? "var(--dsw-alias-state-warn-label, #b8860b)" : "var(--dsw-alias-text-secondary, #666)"),
              opacity: busy ? 0.6 : 1,
            },
          }, label);
        }
      ));
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
