import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

/**
 * Config này là CÔNG KHAI (nằm trong JS của trình duyệt). Nó chỉ nói "app này thuộc project nào".
 * Bảo mật nằm ở phía API: verifyIdToken với Google, không phải ở việc giấu apiKey.
 *
 * Khởi tạo LƯỜI (lazy): chỉ khi có người gọi, và chỉ trong trình duyệt. Nhờ vậy
 * `next build` (chạy trên server, prerender trang) không cần Firebase.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export const googleProvider = new GoogleAuthProvider();
