import React from "react";
import { Textarea } from "./Textarea.jsx";
import { Button } from "./Button.jsx";

// 답글 작성 폼. 댓글 아래 중첩되는 컴팩트한 답글 입력 — 좌측 라인으로 들여쓰기.
// Textarea + Button 조합.
export function ReplyForm({ onSubmit, onCancel, replyingTo }) {
  const [body, setBody] = React.useState("");
  return (
    <div style={{ fontFamily: "var(--font-sans)", borderLeft: "2px solid var(--gray-200)", paddingLeft: 16, marginLeft: 8 }}>
      {replyingTo && (
        <div style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 8 }}>
          <span style={{ color: "var(--blue-600)", fontWeight: 600 }}>@{replyingTo}</span> 님에게 답글
        </div>
      )}
      <Textarea rows={2} placeholder="답글을 입력하세요" value={body} onChange={(e) => setBody(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <Button variant="secondary" size="sm" onClick={onCancel}>취소</Button>
        <Button variant="primary" size="sm" onClick={() => onSubmit && onSubmit(body)}>답글 등록</Button>
      </div>
    </div>
  );
}
