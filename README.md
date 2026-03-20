# DoodleShare

그림을 그려서 링크로 공유하면, 받은 사람이 같은 캔버스에서 같이 그릴 수 있는 협업 드로잉 PWA.

> Undertale UI 스타일의 레트로 픽셀 디자인 — "투박하고 옛날 그림판 같은 느낌"

---

## 핵심 기능

- 실시간 협업 드로잉 (Socket.io)
- 초대 링크로 누구나 참여 (비로그인 게스트 지원)
- 펜 / 지우개 / 12색 팔레트 / 굵기 조절 / Undo
- 참여자 커서 실시간 표시
- PNG 다운로드
- 한국어 자동 닉네임 생성 (형용사 + 명사)

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | Next.js 15 (App Router) + Tailwind CSS v4 |
| 백엔드 | Fastify + Socket.io |
| 캔버스 | HTML5 Canvas API |
| 공유 패키지 | TypeScript (타입, 상수, 유틸) |
| 패키지 관리 | npm workspaces (모노레포) |

> DB는 현재 인메모리 목업. Supabase + Redis(Upstash) 연동 예정.

---

## 프로젝트 구조

```
drawing_machine/
├── packages/
│   └── shared/             # 공유 타입, 상수, 닉네임 생성기
├── apps/
│   ├── web/                # Next.js 프론트엔드 (:3001)
│   │   ├── src/app/        # 페이지 (/, /login, /dashboard, /join/[token], /canvas/[id])
│   │   ├── src/components/ # UI 컴포넌트 + 캔버스 컴포넌트
│   │   └── src/lib/        # 드로잉 엔진, Socket 클라이언트, API, Auth
│   └── server/             # Fastify 백엔드 (:4000)
│       └── src/
│           ├── routes/     # REST API (auth, canvas, participant)
│           ├── socket/     # Socket.io 이벤트 핸들러
│           ├── stores/     # 인메모리 데이터 스토어
│           └── plugins/    # Fastify 플러그인 (auth)
├── CLAUDE.md               # 상세 기획서
└── design-brief.md         # 디자인 브리핑
```

---

## 실행 방법

**필수**: Node.js 18+

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (프론트 + 백엔드 동시)
npm run dev
```

- 프론트엔드: http://localhost:3001
- 백엔드 API: http://localhost:4000

---

## 페이지 구조

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 |
| `/login` | Google 로그인 / 게스트 로그인 |
| `/dashboard` | 내 캔버스 목록 + 새 캔버스 생성 |
| `/join/[token]` | 초대 링크 진입 (닉네임 설정) |
| `/canvas/[id]` | 캔버스 에디터 (드로잉 + 실시간 협업) |

---

## 사용 플로우

1. `/login`에서 로그인 (또는 게스트 접속)
2. `/dashboard`에서 "CREATE NEW ROOM" 클릭
3. 캔버스에서 그림 그리기
4. Share 버튼으로 초대 링크 복사
5. 상대방이 링크로 접속 → 닉네임 입력 → 같은 캔버스에서 실시간 드로잉
6. 완성 후 PNG 다운로드

---

## API 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/auth/mock-login` | 목업 로그인 |
| POST | `/api/auth/guest` | 게스트 로그인 |
| GET | `/api/auth/me` | 현재 유저 |
| POST | `/api/canvas` | 캔버스 생성 |
| GET | `/api/canvas` | 내 캔버스 목록 |
| GET | `/api/canvas/:id` | 캔버스 상세 |
| PATCH | `/api/canvas/:id` | 캔버스 수정 (owner) |
| DELETE | `/api/canvas/:id` | 캔버스 삭제 (owner) |
| GET | `/api/canvas/join/:token` | 초대 토큰으로 캔버스 조회 |
| POST | `/api/canvas/:id/join` | 캔버스 참여 |

---

## 향후 계획

- [ ] Supabase 연동 (Auth + PostgreSQL + Storage)
- [ ] Redis (Upstash) 스트로크 버퍼링
- [ ] PWA Service Worker + 오프라인 지원
- [ ] 이미지 / 텍스트 삽입
- [ ] DM 기능
- [ ] 푸시 알림
