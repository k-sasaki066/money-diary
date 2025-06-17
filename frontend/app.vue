<script setup lang="ts">
    import '~/assets/css/index.css';
    import '~/assets/css/auth.css';
    import { useFirebaseAuth } from '~/composables/useFirebaseAuth';

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
</script>

<template>
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
