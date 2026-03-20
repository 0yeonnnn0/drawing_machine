# 프로젝트 개요

소소한 그림 공유 앱. 그림을 그려서 링크로 공유하면, 받은 사람이 같은 캔버스에서 같이 그릴 수 있는 협업 드로잉 PWA.

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트 | Next.js (App Router) + PWA |
| 백엔드 | Node.js + Fastify |
| 실시간 | Socket.io |
| DB | Supabase (PostgreSQL + Auth + Storage) |
| 캐시/버퍼 | Redis (Upstash) |

---

## 핵심 플로우

1. 로그인 유저가 캔버스 생성
2. 초대 링크 복사 → 공유
3. 링크 받은 사람(비로그인 가능)이 닉네임 설정 후 캔버스 참여
4. 실시간으로 같이 그림 그리기
5. 완성 후 PNG 다운로드

---

## 데이터 모델 (ERD 요약)

### USER
- id (uuid PK)
- email, username, avatar_url
- created_at

### CANVAS
- id (uuid PK)
- owner_id (FK → USER)
- title
- share_token (초대 링크용 UUID)
- snapshot (jsonb — 현재 캔버스 상태)
- is_public (boolean)
- created_at, updated_at

### CANVAS_PARTICIPANT
- id (uuid PK)
- canvas_id (FK), user_id (FK, nullable — 비로그인은 null)
- role: `owner` | `guest`
- nickname (비로그인 게스트용 한국어 자동생성 닉네임)
- joined_at

### STROKE
- id (uuid PK)
- canvas_id (FK), user_id (FK)
- path_data (jsonb), color, width, tool
- created_at
- ※ MVP에서 영구저장 비활성 — Redis 버퍼 → snapshot 머지 방식 사용

### CANVAS_ASSET
- id (uuid PK)
- canvas_id (FK), user_id (FK)
- type (image | text)
- storage_url
- transform (jsonb: { x, y, scale, rotation })
- created_at

### DM_ROOM / DM_ROOM_MEMBER / MESSAGE / MESSAGE_ATTACHMENT
- Post-MVP — 스키마만 준비, 구현 보류

---

## 실시간 아키텍처 (Hybrid 방식)

```
스트로크 발생
  → Socket.io 브로드캐스트 (실시간 반응성)
  → Redis lpush 버퍼링

30초마다 flush job
  → Redis pop → snapshot 머지 → Supabase upsert

신규 참여자 접속
  → Supabase snapshot fetch → 캔버스 복원
```

- Redis가 죽어도 실시간 브로드캐스트 영향 없음
- Stroke 영구저장(타임랩스 등)은 Post-MVP에 활성화

---

## MVP 기능 명세

### 인증 / 유저
- Google OAuth 로그인 (Supabase Auth)
- 비로그인 게스트: 한국어 닉네임 자동생성 (형용사+명사 랜덤 조합)
- 프로필 커스터마이징은 Post-MVP

### 캔버스
- 생성: 로그인 유저만 가능
- 참여: 누구나 (초대 링크 via share_token)
- 제목 설정 / 공개·비공개 설정 / 삭제: owner만
- 내 캔버스 목록 대시보드
- 만료 정책 없음 (삭제 전까지 무기한 유지)

### 그림 도구
- 펜 / 지우개 / 색상 / 굵기
- undo (내 스트로크만)
- 이미지 삽입 (Supabase Storage, presigned URL 방식)
- 텍스트 삽입 (기본 폰트 단일)
- 레이어: Post-MVP

### 협업 / 소셜
- 초대 링크 복사 (owner만 생성)
- 참여자 목록 + 온라인 여부 표시
- 참여자 커서 실시간 표시 (Socket.io)
- PNG 다운로드 (canvas.toBlob())
- DM 공유: Post-MVP
- PWA 푸시 알림: Post-MVP

### 권한 정책
| 액션 | owner | guest |
|---|---|---|
| 그림 그리기 | O | O |
| 이미지 / 텍스트 삽입 | O | O |
| undo (내 스트로크) | O | O |
| 제목 / 공개 설정 변경 | O | X |
| 초대 링크 생성 | O | X |
| 캔버스 삭제 | O | X |

---

## 페이지 구조 (IA)

### `/` — 랜딩 페이지
- 서비스 소개 hero
- 핵심 기능 소개
- CTA: 비로그인 → /login, 로그인 → /dashboard

### `/login` — 로그인
- Google 로그인 버튼
- 로그인 성공 → 대시보드 or redirect 원래 페이지
- 이미 로그인 → /dashboard 자동 리다이렉트

### `/dashboard` — 대시보드 (로그인 필수)
- 새 캔버스 만들기 버튼
- 캔버스 카드 그리드 (썸네일 / 제목 / 수정일 / 공개여부)
- 카드 컨텍스트 메뉴: 열기 / 링크 복사 / 삭제
- 빈 상태(empty state) 처리

### `/join/[token]` — 초대 링크 진입
- 캔버스 제목 미리보기
- 닉네임 입력 (자동생성 + 수정 가능)
- 참여하기 버튼
- 로그인 유저 → 닉네임 스킵, 바로 에디터
- 유효하지 않은 토큰 → 에러 안내

### `/canvas/[id]` — 캔버스 에디터
**툴바**
- 펜 / 지우개 / 색상 / 굵기 / 이미지 삽입 / 텍스트 삽입 / undo

**캔버스 영역**
- 드로잉 캔버스
- 참여자 커서 + 닉네임 라벨 (실시간)

**헤더 / 사이드**
- 캔버스 제목 (owner 편집 가능)
- 참여자 목록 (온라인 표시)
- 링크 복사 (owner)
- PNG 다운로드
- 공개/비공개 토글 (owner)

**상태 케이스**
- 참여자 입장/퇴장 토스트
- 연결 끊김 → 재연결 인디케이터
- owner가 캔버스 삭제 → 참여자 전원 안내 후 퇴장

### `/404`, `/error` — 에러 페이지
- 없는 페이지 / 만료된 링크 / 권한 없음

---

## 파일 업로드 플로우

1. 클라이언트 → Fastify: presigned URL 요청
2. Fastify → Supabase Storage: presigned URL 발급
3. 클라이언트 → Supabase Storage: 이미지 직접 PUT
4. 클라이언트 → Fastify: canvas_asset 메타 저장 (url, transform)
5. Fastify → Socket.io: `asset_added` 브로드캐스트

---

## 디자인 방향

### 컨셉
Undertale UI 스타일 기반의 레트로 픽셀 디자인.
"투박하고 옛날 그림판 같은 느낌" — 앱 컨셉(낙서 공유)과 직결되는 비주얼.

### 확정 사항

**타이포그래피**
- 일반 폰트 사용 (픽셀 폰트 X)
- UI 요소만 픽셀 스타일로 처리

**컬러 팔레트**
- 옛날 16색 팔레트 느낌으로 한정
- 원색 중심, 색 수 최소화
- 참여자 커서는 팔레트 내 원색으로 구분

**UI 컴포넌트**
- 버튼 / 모달 / 카드 전부 픽셀 테두리 스타일 (Windows 95 오마주)
- 그림자 없음, 굵은 검정 테두리
- 선택 상태: 픽셀 커서 인디케이터 (하트 / 화살표)
- 호버: 부드러운 트랜지션 없이 즉각 변환

**아이콘**
- 기성 픽셀 아이콘셋 활용 (Game Icons / Kenney 등)
- 16x16 or 32x32 기반

**애니메이션**
- step() 기반으로 툭툭 끊기는 느낌
- 로딩: 도트 애니메이션

### 캔버스 에디터 특이사항
- 툴바는 MS Paint 레이아웃 오마주
- 커스텀 픽셀 커서
- 참여자 커서는 팔레트 색상으로 각각 구분

---

## 개발 시 참고사항

- 디자인은 외주 진행 예정 — IA 기준으로 와이어프레임 제작
- 캔버스 에디터는 모바일/데스크톱 반응형 레이아웃 둘 다 필요 (툴바 위치 달라짐)
- Stroke 영구저장 코드는 작성하되 feature flag로 비활성화 상태로 유지
- DM 관련 DB 스키마는 마이그레이션 파일에 포함, 구현만 보류
