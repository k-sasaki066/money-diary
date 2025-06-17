<template>
    <AuthHeader></AuthHeader>
    <article>
        <h2 id="input">入力</h2>
        <section id="inputSection">
            <div>
                <label>収支</label>
                <input name="balance" type="radio" value="支出" onclick="disableSelectBox(false);" checked>支出
                <input name="balance" type="radio" value="収入" onclick="disableSelectBox(true);">収入
                <label>日付</label>
                <input type="date" id="date">
                <label>カテゴリ</label>

                <select id="category">
                    <option>-選択してください-</option>
                    <option>食費</option>
                    <option>趣味</option>
                    <option>交際費</option>
                    <option>生活雑貨</option>
                    <option>交通費</option>
                    <option>ファッション</option>
                    <option>家賃</option>
                    <option>保険</option>
                    <option>公共料金</option>
                    <option>通信料</option>
                    <option>税金</option>
                    <option>その他</option>
                </select>
            </div>
            <div>
                <label>金額</label>
                <input type="number" id="amount" placeholder="金額を記入">円
                <label>メモ</label>
                <input type="text" id="memo" placeholder="買ったものを記入">
            </div>
        </section>
        <div class="submit">
            <button onclick="regist();">登録する</button>
        </div>

        <h2 id="inOutList">入出金一覧</h2>
        <section id="list">
        </section>

        <h2 id="graph">グラフ</h2>
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
            //await createList();
            const res = await $axios.get('/lists');
            console.log(res);
            return res.data;
        } catch (error) {
            console.error('初期化中にエラーが発生しました:', error);
        }
    });
</script>