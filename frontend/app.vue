<script setup lang="ts">
    import '~/assets/css/reset.css';
    import '~/assets/css/common.css';
    import '~/assets/css/index.css';
    import '~/assets/css/auth.css';
    import '~/assets/css/list_form.css';
    import { useFirebaseAuth } from '~/composables/useFirebaseAuth';
    import { useSingleClick } from '~/composables/useSingleClick';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';

    const router = useRouter();
    const { run, isRunning } = useSingleClick();
    const { logout } = useAuth();
    const { initAuth, waitForAuthReady, currentUser, token } = useFirebaseAuth();

    const route = useRoute();
    const isErrorPage = computed(() => route.path === '/error');

    onMounted(async () => {
        if (process.client) {
            initAuth();
            await waitForAuthReady();

            if (!currentUser.value) {
                console.log('未ログイン');
                router.push('/login');
            } else {
                console.log('ログイン済み:', currentUser.value.uid);
                console.log('トークン:', token.value);
            }
        }
    });

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
    <header class="header" v-if="!isErrorPage">
        <h1 class="main-title" v-if="!currentUser">MyMoney</h1>
        <h1 class="main-title">
            <NuxtLink to="/" v-if="currentUser">
                MyMoney
            </NuxtLink>
        </h1>
        <div class="navi">
            <NuxtLink class="header-nav__link" to ="/register" v-if="!currentUser">
                SignUp
            </NuxtLink>

            <NuxtLink class="header-nav__link" to="/login" v-if="!currentUser">
                SignIn
            </NuxtLink>

            <NuxtLink class="header-nav__link" to="/list" v-if="currentUser">
                Edit
            </NuxtLink>
            
            <form class="header-nav__logout-form" @submit.prevent="handleLogout" v-if="currentUser">
                <button class="header-nav__logout-button" type="submit">
                    SignOut
                </button>
            </form>
        </div>
    </header>
    <div class="layout">
        <NuxtRouteAnnouncer />

        <main class="content">
            <NuxtPage />
        </main>

        <footer class="footer">
            &copy;MyMoney
        </footer>
    </div>
</template>
