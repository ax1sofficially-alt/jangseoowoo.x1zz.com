// ============================================================
// src/app/page.tsx — Server Component (기본값)
// Firestore 데이터를 서버에서 fetch → BentoGrid(Client)에 props 전달
// ISR: revalidate 60초 (빌드 시 캐싱 + 점진적 갱신)
// ============================================================

import type { Metadata } from 'next';
import { getAllCategoryPosts } from '@/lib/firebase';
import { BentoGrid } from '@/components/BentoGrid';

export const revalidate = 60; // ISR — 60초마다 재생성

export const metadata: Metadata = {
  title: 'Seowoo Jang — 장서우',
  description: '개발, 물리, 수학, 그리고 일상의 기록들.',
  openGraph: {
    title: 'Seowoo Jang',
    description: '개발, 물리, 수학, 그리고 일상의 기록들.',
    url: 'https://jangseowoo.x1zz.com',
    siteName: 'jangseowoo.x1zz.com',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default async function HomePage() {
  // 병렬 fetch — Promise.all 래핑됨 (firebase.ts 참고)
  const { featured, dev, physics, math, life } = await getAllCategoryPosts();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* ── 헤더 ────────────────────────────────────────── */}
      <header className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono mb-1 text-xs tracking-widest text-[var(--color-accent)] uppercase">
              jangseowoo.x1zz.com
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              장서우
              <span className="ml-3 text-[var(--color-text-muted)]">/</span>
              <span className="ml-3 text-[var(--color-accent)]">Seowoo</span>
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              개발 · 물리 · 수학 · 일상 — 생각이 코드가 되고, 코드가 기록이 된다.
            </p>
          </div>

          {/* 통계 뱃지 */}
          <div className="hidden sm:flex items-center gap-4">
            {[
              { label: 'Posts', value: featured.length + dev.length + physics.length + math.length + life.length },
              { label: 'Categories', value: 4 },
            ].map(({ label, value }) => (
              <div key={label} className="glass px-4 py-2 text-center">
                <div className="font-display text-xl font-bold text-[var(--color-accent)]">{value}</div>
                <div className="font-mono text-xs text-[var(--color-text-muted)]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="mt-8 h-px bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-border)] to-transparent opacity-30" />
      </header>

      {/* ── Bento Grid ──────────────────────────────────── */}
      <BentoGrid
        featured={featured}
        dev={dev}
        physics={physics}
        math={math}
        life={life}
      />

      {/* ── 푸터 ────────────────────────────────────────── */}
      <footer className="mt-12 flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Seowoo Jang · jangseowoo.x1zz.com
        </p>
        <div className="flex items-center gap-4">
          {[
            { label: 'GitHub', href: 'https://github.com/yourusername' },
            { label: 'x1zz.com', href: 'https://x1zz.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}