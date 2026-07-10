import React from "react";

export function Table({ columns, rows, rowKey }) {
  return (
    <div style={{ border: "1px solid var(--gray-200)", borderRadius: "var(--radius-xl)", overflow: "hidden", fontFamily: "var(--font-sans)" }}>
      <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--gray-50)", fontSize: 12, color: "var(--gray-500)", borderBottom: "1px solid var(--gray-200)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align ?? "left",
                  padding: "10px 16px",
                  fontWeight: 400,
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey ? row[rowKey] : i}
              style={{
                borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--gray-200)",
                transition: "var(--transition-default)",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "10px 16px",
                    textAlign: col.align ?? "left",
                    fontFamily: col.mono ? "var(--font-mono)" : "var(--font-sans)",
                    color: "var(--gray-900)",
                  }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
