'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal, Atom, Sigma, Coffee,
  ArrowUpRight, Clock, BookOpen, TrendingUp, Zap,
} from 'lucide-react';
import type { Post, PostCategory } from '@/types/post';
import { toISOString } from '@/lib/firebase';

// ─────────────────────────────────────────────────────────────
// 카테고리 메타 — 카테고리마다 독립 색상이지만 채도는 낮게 유지
// ─────────────────────────────────────────────────────────────
const CAT = {
  dev:     { label: 'Development', short: 'DEV', Icon: Terminal,  accent: '#34d399', glow: 'rgba(52,211,153,0.06)'  },
  physics: { label: 'Physics',     short: 'PHY', Icon: Atom,      accent: '#60a5fa', glow: 'rgba(96,165,250,0.06)'  },
  math:    { label: 'Mathematics', short: 'MTH', Icon: Sigma,     accent: '#a78bfa', glow: 'rgba(167,139,250,0.06)' },
  life:    { label: 'Daily Log',   short: 'LOG', Icon: Coffee,    accent: '#fb923c', glow: 'rgba(251,146,60,0.06)'  },
} satisfies Record<PostCategory, {
  label: string; short: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  accent: string; glow: string;
}>;

// ─────────────────────────────────────────────────────────────
// Framer Motion — grid stagger + tile reveal
// ─────────────────────────────────────────────────────────────
const gridV = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const tileV = {
  hidden: { opacity: 0, y: 14, filter: 'blur(5px)' },
  show:   {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  },
};

// ─────────────────────────────────────────────────────────────
// 공용 카드 클래스 — Jet Black 위 극도로 얇은 glass layer
// ─────────────────────────────────────────────────────────────
const CARD =
  'group relative flex flex-col overflow-hidden rounded-2xl ' +
  'border border-white/[0.07] bg-white/[0.025] backdrop-blur-md ' +
  'transition-all duration-300 ease-out ' +
  'hover:border-white/[0.13] hover:bg-white/[0.04] hover:-translate-y-[2px] ' +
  'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]';

// 날짜 포맷 헬퍼
function fmtDate(ts: Post['createdAt'], opts: Intl.DateTimeFormatOptions) {
  return new Date(toISOString(ts)).toLocaleDateString('ko-KR', opts);
}

// ─────────────────────────────────────────────────────────────
// 카테고리 뱃지
// ─────────────────────────────────────────────────────────────
function Badge({ cat }: { cat: PostCategory }) {
  const { Icon, short, accent } = CAT[cat];
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.14em]"
      style={{ color: accent, background: `${accent}16`, border: `1px solid ${accent}26` }}
    >
      <Icon size={8} strokeWidth={2.5} />
      {short}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO CARD — col-span-2 row-span-2
// ─────────────────────────────────────────────────────────────
function HeroCard({ post }: { post: Post }) {
  const { accent, glow } = CAT[post.category];
  const date = fmtDate(post.createdAt, { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <motion.div variants={tileV} className="col-span-2 row-span-2">
      <Link href={`/posts/${post.slug}`} className={`${CARD} h-full p-7`}>

        {/* 우상단 radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)` }}
        />

        {/* 배경 워터마크 숫자 */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 -right-1 select-none font-mono text-[100px] font-black leading-none tracking-tighter text-white/[0.022]"
        >
          01
        </span>

        {/* 상단 메타 */}
        <div className="flex items-center justify-between">
          <Badge cat={post.category} />
          <span className="flex items-center gap-1 font-mono text-[9px] text-zinc-700">
            <Zap size={8} strokeWidth={2.5} style={{ color: accent }} />
            FEATURED
          </span>
        </div>

        {/* 제목 + 본문 */}
        <div className="mt-auto space-y-3 pt-6">
          <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.025em] text-white/90 transition-colors duration-200 group-hover:text-white">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-[13px] leading-relaxed text-zinc-500">
            {post.excerpt}
          </p>

          {/* 하단 메타 바 */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <time className="flex items-center gap-1 font-mono text-[10px] text-zinc-600">
                <Clock size={9} strokeWidth={2} />
                {date}
              </time>
              <span className="font-mono text-[10px] text-zinc-600">
                {post.readingTimeMin} min read
              </span>
            </div>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
              style={{ background: `${accent}18`, color: accent }}
            >
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        {/* 하단 accent underline — 호버 시 좌→우 슬라이드 */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-500 ease-out group-hover:w-full"
          style={{ background: `linear-gradient(90deg, ${accent}80, transparent)` }}
        />
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD — col-span-1 (숫자 중심 미니 카드)
// ─────────────────────────────────────────────────────────────
function StatCard({
  value, label, Icon, accent,
}: {
  value: string | number;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  accent: string;
}) {
  return (
    <motion.div variants={tileV} className="col-span-1">
      <div className={`${CARD} h-full justify-between p-5`}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: `${accent}14`, color: accent }}
        >
          <Icon size={14} strokeWidth={2} />
        </div>
        <div>
          <p className="font-mono text-[28px] font-bold leading-none tracking-tight text-white/90">
            {value}
          </p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-zinc-600 uppercase">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORY CARD — col-span-1 기본 (wide=true 시 col-span-2)
// ─────────────────────────────────────────────────────────────
function CategoryCard({
  cat, posts, wide = false,
}: {
  cat: PostCategory; posts: Post[]; wide?: boolean;
}) {
  const { Icon, label, accent, glow } = CAT[cat];
  const items = posts.slice(0, wide ? 3 : 2);

  return (
    <motion.div variants={tileV} className={wide ? 'col-span-2' : 'col-span-1'}>
      <div
        className={`${CARD} h-full p-5`}
        style={{ boxShadow: `inset 0 0 80px ${glow}` }}
      >
        {/* 좌측 accent 세로줄 */}
        <div
          aria-hidden
          className="absolute left-0 top-5 h-6 w-[2px] rounded-r-full opacity-70"
          style={{ background: accent }}
        />

        {/* 헤더 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md"
              style={{ background: `${accent}14`, color: accent }}
            >
              <Icon size={11} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-tight text-zinc-400">{label}</span>
          </div>
          <Link
            href={`/category/${cat}`}
            className="flex items-center gap-px font-mono text-[9px] text-zinc-700 transition-colors hover:text-zinc-400"
            onClick={(e) => e.stopPropagation()}
          >
            all <ArrowUpRight size={8} />
          </Link>
        </div>

        {/* 구분선 */}
        <div className="mb-3 h-px bg-white/[0.05]" />

        {/* 포스트 목록 */}
        <ul className="space-y-2.5">
          {items.length > 0 ? items.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`} className="group/li flex flex-col gap-0.5">
                <span className="line-clamp-1 text-[12px] font-medium leading-snug text-zinc-400 transition-colors group-hover/li:text-white">
                  {post.title}
                </span>
                <div className="flex items-center gap-2">
                  <time className="font-mono text-[9px] text-zinc-700">
                    {fmtDate(post.createdAt, { month: 'short', day: 'numeric' })}
                  </time>
                  <span className="font-mono text-[9px] text-zinc-700">
                    {post.readingTimeMin}m
                  </span>
                </div>
              </Link>
            </li>
          )) : (
            <li>
              <p className="font-mono text-[10px] text-zinc-700">— 포스트가 없습니다</p>
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// RECENT FEED CARD — col-span-2 (가로 3-열 미니 카드 그리드)
// ─────────────────────────────────────────────────────────────
function RecentCard({ posts }: { posts: Post[] }) {
  const items = posts.slice(0, 3);

  return (
    <motion.div variants={tileV} className="col-span-2">
      <div className={`${CARD} h-full p-5`}>
        <div className="mb-3 flex items-center gap-1.5">
          <BookOpen size={11} strokeWidth={2} className="text-zinc-600" />
          <span className="font-mono text-[9px] tracking-[0.14em] text-zinc-600 uppercase">
            Recent Posts
          </span>
        </div>
        <div className="mb-3 h-px bg-white/[0.05]" />

        <div className="grid grid-cols-3 gap-2.5">
          {items.map((post) => {
            const { accent } = CAT[post.category];
            return (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group/r flex flex-col gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <Badge cat={post.category} />
                <p className="line-clamp-2 text-[11px] font-medium leading-snug text-zinc-400 transition-colors group-hover/r:text-white">
                  {post.title}
                </p>
                <time className="mt-auto font-mono text-[9px] text-zinc-700">
                  {fmtDate(post.createdAt, { month: 'short', day: 'numeric' })}
                </time>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// BentoGrid — 4-col 복합 레이아웃
//
//  Row 1-2 │ Hero (2×2) │ Stat (1×1) │ Stat (1×1) │
//           │            │ Dev  (1×1) │ Physics(1×1│
//  Row 3   │ Recent(2×1)│ Math (1×1) │ Life  (1×1)│
// ─────────────────────────────────────────────────────────────
export interface BentoGridProps {
  featured: Post[];
  dev:      Post[];
  physics:  Post[];
  math:     Post[];
  life:     Post[];
}

export function BentoGrid({ featured, dev, physics, math, life }: BentoGridProps) {
  const totalPosts =
    featured.length + dev.length + physics.length + math.length + life.length;

  // 전체 최신순 정렬 (Recent 카드용)
  const allPosts = [...dev, ...physics, ...math, ...life].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <motion.div
      className="grid grid-cols-4 gap-3"
      style={{ gridAutoRows: 'minmax(148px, auto)' }}
      variants={gridV}
      initial="hidden"
      animate="show"
    >
      {/* ── Hero 2×2 */}
      {featured[0] ? (
        <HeroCard post={featured[0]} />
      ) : (
        <motion.div variants={tileV} className="col-span-2 row-span-2">
          <div className={`${CARD} h-full items-center justify-center`}>
            <p className="font-mono text-[10px] text-zinc-700">Featured post를 추가하세요</p>
          </div>
        </motion.div>
      )}

      {/* ── Stats (우측 상단 Row 1) */}
      <StatCard value={totalPosts} label="Total Posts" Icon={BookOpen}   accent="#60a5fa" />
      <StatCard value={4}          label="Categories"  Icon={TrendingUp} accent="#a78bfa" />

      {/* ── Dev, Physics (우측 하단 Row 2) */}
      <CategoryCard cat="dev"     posts={dev}     />
      <CategoryCard cat="physics" posts={physics} />

      {/* ── Row 3: Recent (2×1), Math (1×1), Life (1×1) */}
      <RecentCard posts={allPosts} />
      <CategoryCard cat="math" posts={math} />
      <CategoryCard cat="life" posts={life} />
    </motion.div>
  );
}