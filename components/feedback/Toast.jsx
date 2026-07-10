import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext({ addToast: () => {} });

const TONE_BG = { error: "var(--red-500)", success: "var(--green-600)", info: "var(--gray-700)" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const addToast = useCallback((message, type = "error") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 50, display: "flex", flexDirection: "column", gap: 8, maxWidth: 384, width: "100%", pointerEvents: "none" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              fontFamily: "var(--font-sans)",
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              fontSize: 14,
              color: "var(--white)",
              pointerEvents: "auto",
              background: TONE_BG[t.type] ?? TONE_BG.error,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
