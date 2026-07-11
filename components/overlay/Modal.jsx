import React from "react";

// 접근성: role="dialog" + aria-modal, 열릴 때 다이얼로그에 포커스, Esc로 닫기,
// Tab 포커스 트랩(다이얼로그 안에서 순환), 닫힐 때 이전 포커스 복원.
export function Modal({ open = true, onClose, title, children, footer, width = 440 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const prev = document.activeElement;
    if (el) el.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { onClose && onClose(); return; }
      if (e.key === "Tab" && el) {
        const f = el.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (prev && prev.focus) prev.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, fontFamily: "var(--font-sans)", padding: 16 }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", width, maxWidth: "100%", overflow: "hidden", outline: "none" }}
      >
        {title && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--gray-200)", fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>{title}</div>
        )}
        <div style={{ padding: 20, fontSize: 14, color: "var(--gray-700)", lineHeight: 1.5 }}>{children}</div>
        {footer && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--gray-200)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
