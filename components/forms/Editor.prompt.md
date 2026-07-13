새글 본문 에디터. 앱의 새글작성이 지원하는 **3가지 외부 에디터 모듈**의 편집 표면·툴바를 DS 토큰으로 표현한 스펙 컴포넌트입니다.

```jsx
<Editor variant="basic" />    {/* 기본: Textarea */}
<Editor variant="tiptap" />   {/* TipTap: 리치 텍스트 툴바(B/I/U, 제목, 목록, 인용, 코드, 링크) */}
<Editor variant="novel" />    {/* Novel: Notion 스타일 슬래시 커맨드 + AI 자동완성 + 버블 메뉴 */}
```

**중요:** 실제 TipTap/Novel 라이브러리는 앱에서 연동하며, 이 컴포넌트는 각 에디터의 **UI 스펙(툴바 구성·편집 표면·상호작용 힌트)**을 DS 스타일로 보여줍니다. `variant="basic"`만 실제 입력이 동작하고(Textarea), tiptap/novel은 대표 서식이 담긴 표현입니다. `PostEditor`의 `editor` prop으로 새글작성 폼에서 바로 전환할 수 있습니다.
