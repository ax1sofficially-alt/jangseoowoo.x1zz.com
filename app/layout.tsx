// ============================================================
// src/app/layout.tsx — Root Layout
// Google Fonts 로드 + 전역 스타일 적용
// ============================================================

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jangseowoo.x1zz.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <head>
        {/* Google Fonts — Syne(display) + DM Sans(body) + JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-obsidian)]">
        {children}
      </body>
    </html>
  );
}

/* ============================================================
   📁 디렉토리 구조 (src/)
   ============================================================

   src/
   ├── app/
   │   ├── globals.css              ← @theme, @utility, base styles
   │   ├── layout.tsx               ← Root layout (fonts, metadata)
   │   ├── page.tsx                 ← 메인 페이지 (Server Component)
   │   ├── posts/
   │   │   └── [slug]/
   │   │       └── page.tsx         ← 포스트 상세 (추후 구현)
   │   └── category/
   │       └── [category]/
   │           └── page.tsx         ← 카테고리 필터 뷰 (추후 구현)
   │
   ├── components/
   │   ├── BentoGrid.tsx            ← 메인 벤토 그리드 (Client)
   │   └── (추후 추가)
   │       ├── PostCard.tsx
   │       ├── CategoryBadge.tsx
   │       └── NavBar.tsx
   │
   ├── lib/
   │   └── firebase.ts              ← Firebase 초기화 + fetch 함수들
   │
   └── types/
       └── post.ts                  ← Firestore 스키마 (TypeScript)

   ============================================================
   📦 필수 패키지 설치
   ============================================================

   npm install firebase framer-motion
   npm install -D @types/node

   ============================================================
   🔑 .env.local
   ============================================================

   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=

   ============================================================
   🗂️ Firestore 인덱스 (Firebase Console에서 생성 필요)
   ============================================================

   Collection: posts
   Fields:
     - status (Ascending) + featured (Ascending) + createdAt (Descending)
     - status (Ascending) + category (Ascending) + createdAt (Descending)
     - slug (Ascending) + status (Ascending)

   ============================================================
*/