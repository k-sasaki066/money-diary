<script setup lang="ts">
    import '~/assets/css/reset.css';
    import '~/assets/css/common.css';
    import '~/assets/css/index.css';
    import '~/assets/css/auth.css';
    import '~/assets/css/list_form.css';
    import { useFirebaseAuth } from '~/composables/useFirebaseAuth';
    import { useSingleClick } from '~/composables/useSingleClick';

    const { run, isRunning } = useSingleClick();
    const { logout } = useAuth();
    const { initAuth, waitForAuthReady, currentUser, token } = useFirebaseAuth();

    initAuth(); //Firebase のログイン状態を監視開始
    await waitForAuthReady();

    if (!currentUser.value) {
      // 未ログインならログインページにリダイレクト
      console.log('未ログイン');
      useRouter().push('/login');
    } else {
      console.log('ログイン済み:', currentUser.value.uid);
      console.log('トークン:', token.value);
    }

    const handleLogout = async () => {
        if (!confirm('ログアウトしますか？')) return

        try {
            await logout()
        } catch (e) {
            console.error('ログアウトエラー:', e)
        }
    };
</script>

<template>
    <header class="auth-header">
        <h1 class="main-title">MyMoney</h1>
        <div class="navi">
            <NuxtLink class="auth-header-nav__link" to ="/register" v-if="!currentUser">
                Sign Up
            </NuxtLink>
            <NuxtLink class="auth-header-nav__link" to="/login" v-if="!currentUser">
                Sign In
            </NuxtLink>
            <NuxtLink class="auth-header-nav__link" to="/" v-if="currentUser">
                Home
            </NuxtLink>
            <NuxtLink class="auth-header-nav__link" to="/list" v-if="currentUser">
                Edit
            </NuxtLink>
            <form class="header-nav__logout-form" @submit.prevent="handleLogout" v-if="currentUser">
                <button class="header-nav__logout-button" type="submit">
                    ログアウト
                </button>
            </form>
        </div>
    </header>
    <div class="layout">
        <NuxtRouteAnnouncer />

        <main class="content">
          <NuxtPage />
        </main>

        <footer>
            &copy;MyMoney
        </footer>
    </div>
</template>
