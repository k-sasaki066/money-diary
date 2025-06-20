import { getApps, initializeApp } from 'firebase/app';
//すでに初期化済みのアプリがあるか確認
import { getAuth } from 'firebase/auth';
//Firebase 認証機能を使う
import { getAnalytics } from 'firebase/analytics';
//Firebase アナリティクス（ブラウザ限定）
import { useRuntimeConfig } from '#app';

// Nuxt のプラグインシステムで、アプリ起動時に実行される関数を定義。
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.public.FIREBASE_API_KEY,
        authDomain: config.public.FIREBASE_AUTH_DOMAIN,
        projectId: config.public.FIREBASE_PROJECT_ID,
        storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
        appId: config.public.FIREBASE_APP_ID,
    };

    //// すでに初期化されたアプリが存在すればそれを再利用,なければ initializeApp() で初期化
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

    // useNuxtApp().$auth でどこからでも Firebase Auth を使えるようにする。
    return {
        provide: {
        auth,
        },
    };
});