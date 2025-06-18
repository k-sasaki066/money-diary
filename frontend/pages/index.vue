<template>
    <article>
        <div class="month-navigation">
            <button class="month-navigation__button" @click="changeMonth(-1)">←</button>
            <div class="summary-header">
                <h2 class="summary-header__text">2025年6月の支出 <span class="expense">    ¥180000</span></h2>
                <p class="balance">収入 ¥200000</p>
            </div>
            <button class="month-navigation__button" @click="changeMonth(1)">→</button>
        </div>
        <section id="list">
        </section>

        <h2 class="section-title" id="graph">グラフ</h2>
        <section>
            <canvas id="pieChart"></canvas>
        </section>

    </article>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import type { NuxtApp } from '#app';

    const { $axios } = useNuxtApp();

    onMounted(async () => {
        try {
            await createList();
            const res = await $axios.get('/lists');
            console.log(res);
            return res.data;
        } catch (error) {
            console.error('初期化中にエラーが発生しました:', error);
        }
    });
</script>