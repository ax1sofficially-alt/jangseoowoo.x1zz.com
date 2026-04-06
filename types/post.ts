import { Timestamp } from 'firebase/firestore';

export type PostCategory = 'dev' | 'physics' | 'math' | 'life';
export type PostStatus = 'published' | 'draft' | 'archived';

/**
 * ── 날짜 타입 정의
 * Firestore에서 가져온 직후는 Timestamp 객체이지만, 
 * serializeDoc을 거치면 클라이언트 전달을 위해 number(ms)로 변환됩니다.
 */
export type DateType = number; 

// ── 공통 베이스 (모든 문서의 기본 구조)
export interface BasePost {
  id: string;
  title: string;
  slug: string;           // URL friendly key (예: 'how-to-build-bento-grid')
  excerpt: string;         // 120자 내외 요약
  category: PostCategory;
  status: PostStatus;
  tags: string[];
  coverImage?: string;     // Firebase Storage URL
  readingTimeMin: number;
  createdAt: DateType;     // 직렬화된 밀리초(number)
  updatedAt: DateType;     // 직렬화된 밀리초(number)
  featured: boolean;       // 메인 2x2 히어로 카드 노출 여부
  viewCount: number;
  content: string;         // 마크다운 본문
}

// ── 카테고리별 확장 페이로드 (Payload)
export interface DevPayload {
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface PhysicsPayload {
  field: string;           // 'quantum', 'mechanics', etc.
  equations: string[];     // LaTeX 포맷 문자열
  references: string[];
}

export interface MathPayload {
  field: string;           // 'calculus', 'topology', etc.
  theorems: string[];
  proofType: 'formal' | 'intuitive' | 'visual';
}

export interface LifePayload {
  mood?: 'great' | 'good' | 'neutral' | 'rough';
  location?: string;
  isPrivate: boolean;
}

/**
 * ── 최종 포스트 유니온 타입 (Discriminated Union)
 * category 값에 따라 payload의 타입을 자동으로 추론(Inference)합니다.
 */
export type Post =
  | (BasePost & { category: 'dev';     payload: DevPayload })
  | (BasePost & { category: 'physics'; payload: PhysicsPayload })
  | (BasePost & { category: 'math';    payload: MathPayload })
  | (BasePost & { category: 'life';    payload: LifePayload });

// ── 컬렉션 상수
export const COLLECTIONS = {
  POSTS: 'posts',
  VIEWS: 'post_views',
} as const;