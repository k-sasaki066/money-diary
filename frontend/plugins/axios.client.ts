// Axios をラップして「Firebase ID トークンを自動添付する HTTP クライアント」を Nuxt に注入
import axios from 'axios';
import { getAuth } from 'firebase/auth';
// getAuth() は クライアントで Firebase が初期化済みでなければ例外を投げる
// プラグインそのものを .client.ts にするか、process.client でガードする必要があります
// import { useErrorStore } from '~/stores/error'
import type { NuxtApp } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter();
    const instance = axios.create({
        baseURL: 'http://127.0.0.1/api/v1', // Laravel API のベースURL
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 認証トークンを自動で付ける（Firebase使用時）
    instance.interceptors.request.use(async (config) => {
        const user = getAuth().currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        // ログイン済みでなければ currentUser は null なので、Authorization ヘッダを付与せずゲストアクセス
        return config;
    });

    instance.interceptors.response.use(
        response => response,
        async (error) => {
            // const errorStore = useErrorStore();
            const status = error.response?.status || 500;

            // Firebaseトークンが無効だった場合に再ログイン試行
            if (status === 401) {
                try {
                    const auth = getAuth();
                    const user = auth.currentUser;
                    if (user) {
                        await user.getIdToken(true); // 第二引数 true でキャッシュを無視して新しいトークンを生成
                        const config = error.config;
                        const newToken = await user.getIdToken();
                        config.headers.Authorization = `Bearer ${newToken}`
                        return instance(config); // ← 再試行
                    }
                } catch (e) {
                    alert('認証が切れました。ログインし直してください。');
                    await router.push('/login');
                    return Promise.reject(error)
                }
            };

            // その他のエラー処理
            // const message = error.response?.data?.error || error.message || '不明なエラーが発生しました';
            // errorStore.setError(message, status)
            // await router.push('/error');
            // return Promise.reject(error)
        }
    );

    return {
        provide: {
            axios: instance
        },
    };
});