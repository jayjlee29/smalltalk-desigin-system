import React from "react";
import { Input } from "./Input.jsx";
import { Textarea } from "./Textarea.jsx";
import { Button } from "./Button.jsx";
import { Avatar } from "../display/Avatar.jsx";

// 댓글 작성 폼. 계정 없이 닉네임 + 비밀번호(수정/삭제용)로 익명 댓글 작성 —
// 원본 앱의 비밀번호 보호 댓글 패턴. Avatar + Input + Textarea + Button 조합.
export function CommentForm({ onSubmit, anonymous = true, author = "스몰토커" }) {
  const [nickname, setNickname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [body, setBody] = React.useState("");
  return (
    <div style={{ fontFamily: "var(--font-sans)", display: "flex", gap: 12 }}>
      <Avatar name={anonymous ? nickname || "익명" : author} size={36} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {anonymous && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Input compact placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <Input compact type="password" placeholder="비밀번호 (수정/삭제용)" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        <Textarea rows={3} placeholder="댓글을 입력하세요" value={body} onChange={(e) => setBody(e.target.value)} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="primary" size="sm" onClick={() => onSubmit && onSubmit({ nickname, password, body })}>댓글 등록</Button>
        </div>
      </div>
    </div>
  );
}
