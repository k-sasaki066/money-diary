<script setup lang="ts">
    import { useSingleClick } from '~/composables/useSingleClick';

    const { run, isRunning } = useSingleClick();
    const { logout } = useAuth();

    const smoothScrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

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
<header>
    <div class="index-title">
        <h1 id="home" class="main-title">MyMoney</h1>
        <form class="side-nav__logout-form flex" @submit.prevent="handleLogout">
            <button class="side-nav__logout-button white" type="submit">
                ログアウト
            </button>
        </form>
    </div>
    <div class="navi">
        <button @click="smoothScrollTo('home')">ホーム</button>
        <button @click="smoothScrollTo('input')">入力</button>
        <button @click="smoothScrollTo('inOutList')">入出金一覧</button>
        <button @click="smoothScrollTo('graph')">グラフ</button>
    </div>
</header>
</template>