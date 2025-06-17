// Firebase を Nuxt 3 に統合するプラグインの定義
// クライアントサイドで Firebase を初期化し、Nuxt アプリ内で $auth として使用できるようにしています。
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// initializeApp()：Firebase アプリを初期化。
// getApps()：すでに初期化済みのアプリがあるか確認。
// getAuth()：Firebase 認証機能を使う。
// getAnalytics()：Firebase アナリティクス（ブラウザ限定）。

export default defineNuxtPlugin(() => {
    // Nuxt のプラグインシステムで、アプリ起動時に実行される関数を定義。
    const config = useRuntimeConfig();
    // 環境変数から Firebase 設定を取得
    const firebaseConfig = {
        apiKey: config.public.FIREBASE_API_KEY,
        authDomain: config.public.FIREBASE_AUTH_DOMAIN,
        projectId: config.public.FIREBASE_PROJECT_ID,
        storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
        appId: config.public.FIREBASE_APP_ID,
    };

    // すでに初期化されたアプリが存在すればそれを再利用。
    // なければ initializeApp() で初期化。
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    // getAuth(app)：初期化済みアプリから Auth 機能を取得。
    // アナリティクスは ブラウザでのみ有効なので typeof window チェック。
    const auth = getAuth(app);
    const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

    // useNuxtApp().$auth でどこからでも Firebase Auth を使えるようにする。
    return {
        provide: {
            auth,
        },
    };
});