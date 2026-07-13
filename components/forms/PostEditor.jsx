import React from "react";
import { Input } from "./Input.jsx";
import { Select } from "./Select.jsx";
import { Editor } from "./Editor.jsx";
import { Button } from "./Button.jsx";
import { Tag } from "../display/Tag.jsx";

// 게시판 글쓰기 폼. 카테고리 선택 + 제목 + 본문 + 태그 + 등록/취소.
// DS 컴포넌트(Select/Input/Textarea/Tag/Button)를 조합한 복합 컴포넌트.
export function PostEditor({
  categories = [],
  editor = "basic",
  onSubmit,
  onCancel,
  defaultCategory = "",
  defaultTitle = "",
  defaultBody = "",
  defaultTags = [],
}) {
  const [category, setCategory] = React.useState(defaultCategory);
  const [title, setTitle] = React.useState(defaultTitle);
  const [body, setBody] = React.useState(defaultBody);
  const [tags, setTags] = React.useState(defaultTags);
  const [tagInput, setTagInput] = React.useState("");

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#/, "");
      setTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
      setTagInput("");
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-xl)", background: "var(--white)", padding: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 12 }}>
          <Select placeholder="게시판 선택" options={categories} value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <Editor variant={editor} placeholder="내용을 입력하세요" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />

        <div>
          {/* Input에는 onKeyDown prop이 없으므로 래퍼 div에서 keydown을 받아 태그 추가 */}
          <div onKeyDown={addTag}>
            <Input placeholder="태그 입력 후 Enter (예: 주식)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} compact />
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {tags.map((t) => (
                <Tag key={t} tone="blue" onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>#{t}</Tag>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--gray-200)", paddingTop: 16 }}>
          <span style={{ fontSize: 12, color: "var(--gray-400)", fontFamily: "var(--font-mono)" }}>{body.length}자</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={onCancel}>취소</Button>
            <Button variant="primary" size="sm" onClick={() => onSubmit && onSubmit({ category, title, body, tags })}>등록</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
