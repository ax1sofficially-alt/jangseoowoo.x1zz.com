// src/app/page.tsx — Server Component
// ISR 60s | Firestore 병렬 fetch | props → BentoGrid(Client)

import type { Metadata } from 'next';
import { getAllCategoryPosts } from '@/lib/firebase';
import { BentoGrid } from '@/components/BentoGrid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Seowoo Jang',
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
  const { featured, dev, physics, math, life } = await getAllCategoryPosts();

  return (
    // Jet Black 배경 — body보다 한 단계 더 어두운 느낌 유지
    <div className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">

        {/* ── 헤더 — 텍스트만, 최대 미니멀 ──────────────────── */}
        <header className="mb-11">
          <div className="flex items-end justify-between">

            {/* 좌: 이름 + 설명 */}
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase">
                jangseowoo.x1zz.com
              </p>
              <h1 className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-white/90 sm:text-[38px]">
                장서우
                <span className="ml-2.5 text-zinc-600">/</span>
                <span className="ml-2.5 text-zinc-400"> Seowoo Jang</span>
              </h1>
              <p className="text-[13px] text-zinc-600">
                개발 · 물리 · 수학 · 일상 — 생각이 코드가 되고, 코드가 기록이 된다.
              </p>
            </div>

            {/* 우: 상태 도트 (live 표시) */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] text-zinc-600">active</span>
            </div>
          </div>

          {/* 구분선 — accent는 왼쪽 아주 짧게만 */}
          <div className="mt-8 flex h-px w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-24 bg-gradient-to-r from-blue-500/40 to-transparent" />
          </div>
        </header>

        {/* ── Bento Grid ───────────────────────────────────── */}
        <BentoGrid
          featured={featured}
          dev={dev}
          physics={physics}
          math={math}
          life={life}
        />

        {/* ── 푸터 — 텍스트만, 최대 미니멀 ──────────────────── */}
        <footer className="mt-12 flex items-center justify-between">
          <p className="font-mono text-[10px] text-zinc-700">
            © {new Date().getFullYear()} Seowoo Jang
          </p>
          <nav className="flex items-center gap-5">
            {[
              { label: 'GitHub',   href: 'https://github.com/seowoo-jang' },
              { label: 'x1zz.com', href: 'https://x1zz.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-zinc-700 transition-colors hover:text-zinc-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </footer>

      </div>
    </div>
  );
}