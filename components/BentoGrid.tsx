'use client';

// ============================================================
// src/components/BentoGrid.tsx
// Framer Motion 기반 벤토 그리드 — Client Component
// 실제 데이터(Post[])를 props로 받아 렌더링
// ============================================================

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Post, PostCategory } from '@/types/post';
import { toISOString } from '@/lib/firebase';

// ── 카테고리 메타 맵 ─────────────────────────────────────
const CATEGORY_META: Record<PostCategory, {
  label: string;
  icon: string;
  color: string;
  glow: string;
  bgAccent: string;
}> = {
  dev: {
    label:    'Dev',
    icon:     '⌨',
    color:    'text-[#7ee787]',
    glow:     'glow-dev',
    bgAccent: 'rgba(126, 231, 135, 0.06)',
  },
  physics: {
    label:    'Physics',
    icon:     '⚛',
    color:    'text-[#79c0ff]',
    glow:     'glow-physics',
    bgAccent: 'rgba(121, 192, 255, 0.06)',
  },
  math: {
    label:    'Math',
    icon:     '∑',
    color:    'text-[#d2a8ff]',
    glow:     'glow-math',
    bgAccent: 'rgba(210, 168, 255, 0.06)',
  },
  life: {
    label:    'Life',
    icon:     '◎',
    color:    'text-[#ffa657]',
    glow:     'glow-life',
    bgAccent: 'rgba(255, 166, 87, 0.06)',
  },
};

// ── 애니메이션 variants ──────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

// ── Featured Card (2×2) ──────────────────────────────────
function FeaturedCard({ post, index }: { post: Post; index: number }) {
  const meta = CATEGORY_META[post.category];
  const date = new Date(toISOString(post.createdAt)).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <motion.div variants={cardVariants} className="col-span-2 row-span-2">
      <Link
        href={`/posts/${post.slug}`}
        className="glass glass-hover glow-dev group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden p-6"
        style={{ background: `linear-gradient(135deg, var(--glass-bg) 0%, ${meta.bgAccent} 100%)` }}
      >
        {/* 배경 번호 워터마크 */}
        <span
          className="font-display pointer-events-none absolute -right-4 -top-6 select-none text-[120px] font-bold leading-none opacity-[0.04]"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* 상단 메타 */}
        <div className="flex items-center justify-between">
          <span className={`font-mono text-xs font-semibold tracking-widest uppercase ${meta.color}`}>
            {meta.icon} &nbsp;{meta.label}
          </span>
          <span className="font-mono text-xs text-[var(--color-text-muted)]">Featured</span>
        </div>

        {/* 본문 */}
        <div className="mt-auto space-y-3">
          <h2 className="font-display text-2xl font-bold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm text-[var(--color-text-secondary)]">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <time className="font-mono text-xs text-[var(--color-text-muted)]">{date}</time>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">{post.readingTimeMin}min</span>
          </div>
        </div>

        {/* 화살표 */}
        <span className="absolute bottom-5 right-5 translate-x-1 text-[var(--color-text-muted)] transition-all group-hover:translate-x-0 group-hover:text-[var(--color-accent)]">
          →
        </span>
      </Link>
    </motion.div>
  );
}

// ── Category Card (1×1 or 1×2) ───────────────────────────
function CategoryCard({
  category,
  posts,
  span = 1,
}: {
  category: PostCategory;
  posts: Post[];
  span?: 1 | 2;
}) {
  const meta = CATEGORY_META[category];

  return (
    <motion.div variants={cardVariants} className={span === 2 ? 'col-span-2' : 'col-span-1'}>
      <div
        className={`glass glass-hover ${meta.glow} group flex h-full flex-col p-5`}
        style={{ background: `linear-gradient(145deg, var(--glass-bg) 0%, ${meta.bgAccent} 100%)` }}
      >
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xl ${meta.color}`}>{meta.icon}</span>
            <span className={`font-display text-sm font-bold uppercase tracking-wider ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          <Link
            href={`/category/${category}`}
            className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            all →
          </Link>
        </div>

        {/* 포스트 리스트 */}
        <ul className="space-y-3">
          {posts.slice(0, span === 2 ? 3 : 2).map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                className="group/item flex flex-col gap-0.5"
              >
                <span className="line-clamp-1 text-sm font-medium text-[var(--color-text-primary)] transition-colors group-hover/item:text-[var(--color-accent)]">
                  {post.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {new Date(toISOString(post.createdAt)).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {post.readingTimeMin}min
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* 빈 상태 */}
        {posts.length === 0 && (
          <p className="font-mono text-xs text-[var(--color-text-muted)]">아직 포스트가 없습니다.</p>
        )}
      </div>
    </motion.div>
  );
}

// ── 메인 BentoGrid ───────────────────────────────────────
interface BentoGridProps {
  featured:  Post[];
  dev:       Post[];
  physics:   Post[];
  math:      Post[];
  life:      Post[];
}

export function BentoGrid({ featured, dev, physics, math, life }: BentoGridProps) {
  return (
    <motion.div
      className="bento-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Row 1–2: Featured (2×2) × 2개 */}
      {featured.map((post, i) => (
        <FeaturedCard key={post.id} post={post} index={i} />
      ))}

      {/* Row 3: Dev (1×2), Physics (1×1), Math (1×1) */}
      <CategoryCard category="dev"     posts={dev}     span={2} />
      <CategoryCard category="physics" posts={physics} span={1} />
      <CategoryCard category="math"    posts={math}    span={1} />

      {/* Row 4: Life (1×1 × 4 — 또는 필요에 따라 조정) */}
      {/* Life 카드는 전체 너비 사용 — 일상 기록은 가볍게 */}
      <motion.div variants={cardVariants} className="col-span-4">
        <div
          className="glass glass-hover glow-life flex items-center gap-6 px-6 py-4"
          style={{ background: 'linear-gradient(90deg, var(--glass-bg), rgba(255, 166, 87, 0.05))' }}
        >
          <span className="text-2xl">◎</span>
          <div className="flex-1">
            <span className="font-display text-sm font-bold uppercase tracking-wider text-[#ffa657]">Life</span>
            {life[0] ? (
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                <Link href={`/posts/${life[0].slug}`} className="hover:text-[var(--color-accent)]">
                  {life[0].title}
                </Link>
              </p>
            ) : (
              <p className="font-mono mt-0.5 text-xs text-[var(--color-text-muted)]">일상 기록이 여기에 나타납니다.</p>
            )}
          </div>
          <Link
            href="/category/life"
            className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[#ffa657]"
          >
            all →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}