// ============================================================
// src/lib/firebase.ts
// Client SDK (Auth/실시간) + Admin-less 서버 fetch 전략
// Server Component에서는 REST API로 직접 fetch → Admin SDK 없이도 동작
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  type Firestore,
} from 'firebase/firestore';
import type { Post, PostCategory, FirebaseTimestamp } from '@/types/post';
import { COLLECTIONS } from '@/types/post';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ── 싱글턴: Next.js Hot Reload 시 중복 초기화 방지
let app: FirebaseApp;
let db: Firestore;

function getFirebaseInstances() {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  }
  return { app, db };
}

// ── 헬퍼: Firestore Timestamp → ISO string
export function toISOString(ts: FirebaseTimestamp): string {
  return new Date(ts.seconds * 1000).toISOString();
}

// ── Featured 포스트 fetch (메인 2x2 카드용)
// Server Component에서 await로 호출
export async function getFeaturedPosts(count = 2): Promise<Post[]> {
  const { db } = getFirebaseInstances();

  const q = query(
    collection(db, COLLECTIONS.POSTS),
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

// ── 카테고리별 최신 포스트 fetch (Bento 하단 카드용)
export async function getPostsByCategory(
  category: PostCategory,
  count = 3
): Promise<Post[]> {
  const { db } = getFirebaseInstances();

  const q = query(
    collection(db, COLLECTIONS.POSTS),
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
}

// ── slug로 단일 포스트 fetch (Post Detail Page용)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { db } = getFirebaseInstances();

  const q = query(
    collection(db, COLLECTIONS.POSTS),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Post;
}

// ── 모든 카테고리 병렬 fetch (메인 페이지 최적화)
export async function getAllCategoryPosts() {
  const categories: PostCategory[] = ['dev', 'physics', 'math', 'life'];
  const [featured, ...categoryResults] = await Promise.all([
    getFeaturedPosts(2),
    ...categories.map(cat => getPostsByCategory(cat, 3)),
  ]);

  return {
    featured,
    dev:     categoryResults[0],
    physics: categoryResults[1],
    math:    categoryResults[2],
    life:    categoryResults[3],
  };
}