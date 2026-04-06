// ============================================================
// Firestore Schema — "잡식성" 포스트 타입 설계
// 모든 카테고리가 BasePost를 상속받고, 카테고리별 메타가 payload에 분기
// ============================================================

export type PostCategory = 'dev' | 'physics' | 'math' | 'life';
export type PostStatus = 'published' | 'draft' | 'archived';

// ── 공통 베이스 (모든 문서에 존재)
export interface BasePost {
  id: string;
  title: string;
  slug: string;                      // URL-friendly key
  excerpt: string;                   // 120자 이내 요약
  category: PostCategory;
  status: PostStatus;
  tags: string[];
  coverImage?: string;               // Storage URL or null
  readingTimeMin: number;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  featured: boolean;                 // 메인 Featured 카드 노출 여부
  viewCount: number;
}

// ── Firestore Timestamp 타입 (서버/클라이언트 공용)
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// ── 카테고리별 확장 메타 (payload 필드에 저장)
export interface DevPayload {
  techStack: string[];               // ['Next.js', 'Rust', ...]
  githubUrl?: string;
  demoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface PhysicsPayload {
  field: string;                     // 'quantum', 'thermodynamics', ...
  equations: string[];               // LaTeX strings
  references: string[];
}

export interface MathPayload {
  field: string;                     // 'linear-algebra', 'calculus', ...
  theorems: string[];
  proofType: 'formal' | 'intuitive' | 'visual';
}

export interface LifePayload {
  mood?: 'great' | 'good' | 'neutral' | 'rough';
  location?: string;
  isPrivate: boolean;
}

// ── 최종 유니온 — Firestore 문서 전체 구조
export type Post =
  | (BasePost & { category: 'dev';     payload: DevPayload })
  | (BasePost & { category: 'physics'; payload: PhysicsPayload })
  | (BasePost & { category: 'math';    payload: MathPayload })
  | (BasePost & { category: 'life';    payload: LifePayload });

// ── Firestore 컬렉션 경로 상수
export const COLLECTIONS = {
  POSTS: 'posts',
  VIEWS: 'post_views',    // 별도 카운터 컬렉션 (write 분리)
} as const;