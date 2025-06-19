<template>
    <article>
        <div class="month-navigation">
            <button class="month-navigation__button" @click="changeMonth(-1)">←</button>
            <div class="summary-header">
                <h2 class="summary-header__text">{{ format(currentMonth, 'yyyy年M月') }}の支出<span class="expense">    ¥{{ expenseTotal }}</span></h2>
                <p class="balance">収入 ¥{{ incomeTotal }}</p>
            </div>
            <button class="month-navigation__button" @click="changeMonth(1)">→</button>
        </div>
        <section id="list">
            <table>
                <tr>
                    <th>日付</th>
                    <th>収支</th>
                    <th>カテゴリ</th>
                    <th>金額</th>
                    <th>メモ</th>
                    <th>削除</th>
                </tr>
                <template v-if="listItems.length > 0">
                    <tr v-for="item in listItems" :key="item.id">
                        <td>{{ item.date }}</td>
                        <td>{{ item.category.type === 'income' ? '収入' : '支出' }}</td>
                        <td>{{ item.category.name }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.memo}}</td>
                        <td>
                            <form @submit.prevent="deleteData(item)">
                                <button type="submit">×</button>
                            </form>
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="6">登録がありません</td>
                </tr>
            </table>
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
    import { format, addMonths } from 'date-fns';
    import { ref, computed } from 'vue';
    import { useSingleClick } from '~/composables/useSingleClick';

    type ListItem = {
        id: number;
        date: date;
        amount: number;
        memo: string;
        category: {
            id: number;
            name: string;
            type: string;
        };
    };

    const { $axios } = useNuxtApp();
    const currentMonth = ref(new Date());
    const listItems = ref([]);
    const incomeTotal = ref([]);
    const expenseTotal = ref([]);

    const { run, isRunning } = useSingleClick();

    onMounted(async () => {
        try {
            fetchListItems();
        } catch (error) {
            console.error('初期化中にエラーが発生しました:', error);
        }
    });

    const formattedMonth = computed(() => {
        return format(currentMonth.value, 'yyyy-MM') // Laravel に送る形式
    });

    async function changeMonth(amount: number) {
        currentMonth.value = addMonths(currentMonth.value, amount);
        await fetchListItems();
    }

    async function fetchListItems() {
        try {
            const res = await $axios.get(`/lists?month=${formattedMonth.value}`);
            listItems.value = res.data.listItems;
            incomeTotal.value = res.data.incomeTotal;
            expenseTotal.value = res.data.expenseTotal;
            console.log(res.data);
        } catch (err) {
            console.error('データ取得に失敗しました', err)
        }
    }

    function deleteData(item: ListItem) {
        run(async () => {
        console.log(item.category);
            const ok = window.confirm(
            `${item.category.name}：${item.amount}円\nこの内容を削除しますか？`
            );
            if (!ok) return;

            try {
            await $axios.delete(`/lists/${item.id}`);
            listItems.value = listItems.value.filter(i => i.id !== item.id);
            await fetchListItems();
            } catch (err) {
            alert('削除に失敗しました');
            console.error(err);
            }
        })
    }
</script>