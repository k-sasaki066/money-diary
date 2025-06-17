import {
    createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';

export const useAuth = () => {
    const { $auth } = useNuxtApp();
    // plugins/firebase.client.ts で provide された $auth を取得
    const router = useRouter();
    const user = useState<User | null>('user', () => null);
    // Nuxt の useState を使用して、現在ログイン中のユーザーを取得

    const register = async (name: string, email: string, password: string) => {
        const cred = await createUserWithEmailAndPassword($auth, email, password)
        await updateProfile(cred.user, { displayName: name });
        user.value = cred.user;
        router.push('/');
        // createUserWithEmailAndPassword: Firebaseでユーザーを新規作成。updateProfile: 作成直後のユーザーに displayName を設定。user.value に作成したユーザー情報を保存。ログイン後、トップページへリダイレクト。
    };

    const login = async (email: string, password: string) => {
        try {
            const cred = await signInWithEmailAndPassword($auth, email, password)
            user.value = cred.user;
            router.push('/');
        } catch (error) {
            console.error('ログインエラー:', error);
        };
        // Firebaseにメールアドレスとパスワードでログイン。成功すれば user をセットし、トップページへ遷移。
    };

    const logout = async () => {
        await $auth.signOut()
        user.value = null;
        router.push('/login');
        // Firebaseからログアウト。user 状態をリセット。
    };

    return { user, register, login, logout }
    // このcomposableを使用する他のコンポーネントから、user, register, login, logout が使えるようになります。
};

// Firebase Authentication を使って Nuxt アプリケーションでユーザー認証を行う。userは現在のユーザー情報（状態管理）