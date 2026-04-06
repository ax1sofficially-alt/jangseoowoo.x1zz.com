import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  type Firestore,
  Timestamp, // 추가
} from 'firebase/firestore';
import type { Post, PostCategory } from '@/types/post';
import { COLLECTIONS } from '@/types/post';

const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Singleton 인스턴스 관리
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/**
 * 🔥 직렬화 헬퍼 함수
 * Server -> Client 전달 시 Plain Object여야 하므로 
 * Timestamp 객체를 primitive type(number)으로 변환합니다.
 */


const serializeDoc = (d: any): Post => {
  const data = d.data();

  // 안전한 날짜 변환 헬퍼
  const toMs = (date: any): number => {
    if (!date) return Date.now();
    
    // 1. 이미 숫자(ms)인 경우
    if (typeof date === 'number') return date;
    
    // 2. Firebase Timestamp 객체인 경우 (seconds 속성 존재 확인)
    if (typeof date === 'object' && 'seconds' in date) {
      return date.seconds * 1000;
    }
    
    // 3. JS Date 객체인 경우
    if (date instanceof Date) return date.getTime();
    
    return Date.now();
  };

  return {
    ...data,
    id: d.id,
    createdAt: toMs(data.createdAt),
    updatedAt: toMs(data.updatedAt),
    // 만약 payload 내부에도 날짜가 있다면 여기서 처리하거나 
    // 혹은 payload는 그대로 두고 렌더링 시점에 처리합니다.
  } as Post;
};

/**
 * 타임스탬프(number)를 ISO string으로 변환
 * BentoGrid.tsx의 fmtDate 내부에서 사용됩니다.
 */
export function toISOString(timestamp: number | string | Date): string {
  if (typeof timestamp === 'number') return new Date(timestamp).toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return String(timestamp);
}

// ── 데이터 Fetch 로직 ──

export async function getFeaturedPosts(count = 2): Promise<Post[]> {
  const q = query(
    collection(db, COLLECTIONS.POSTS),
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(serializeDoc);
}

export async function getPostsByCategory(category: PostCategory, count = 3): Promise<Post[]> {
  const q = query(
    collection(db, COLLECTIONS.POSTS),
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(serializeDoc);
}

export async function getAllCategoryPosts() {
  const categories: PostCategory[] = ['dev', 'physics', 'math', 'life'];
  
  // 병렬 처리를 통해 로딩 속도 최적화
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

export { db };