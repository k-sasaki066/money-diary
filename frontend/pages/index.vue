<template>
    <article class="list-items__wrap">
        <div class="month-navigation">
            <button class="month-navigation__button" @click="changeMonth(-1)">←</button>
            <h2 class="summary-header">
                {{ format(currentMonth, 'yyyy年M月') }}
            </h2>
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
                        <td class="memo">{{ item.memo ? item.memo : '-' }}</td>
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

        <h2 class="section-title" id="graph">今月のお金の動き</h2>
        <section class="graph-date">
            <div class="totalling-wrap">
                <div class="amount-date">
                    <p class="expense-text">収入 <span class="expense-text__span">¥{{ formatCurrency(incomeTotal) }}</span></p>

                    <p class="expense-text">支出 <span class="expense-text__span">¥{{ formatCurrency(expenseTotal) }}</span></p>

                    <p class="expense-text__balance">収支 <span class="expense-text__span">¥{{ formatCurrency(balance) }}</span></p>
                </div>

                <div class="amount-date">
                    <img class="icon-img" src="/icons/食費.png">
                    <p class="expense-text">食費<span class="expense-text__span">¥{{ formatCurrency(foodExpenseTotal) }}</span></p>
                </div>

                <div class="amount-date">
                    <img class="icon-img" src="/icons/外食.png">
                    <p class="expense-text">外食の回数<span class="expense-text__span">{{ eatingOutCount }}回</span></p>
                </div>
            </div>
            <div class="graph-wrap">
                <GraphPie :data="listItems" />
            </div>
        </section>

    </article>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import type { NuxtApp } from '#app';
    import { format, addMonths } from 'date-fns';
    import { ref, computed } from 'vue';
    import { useSingleClick } from '~/composables/useSingleClick';
    import GraphPie from '~/components/GraphPie.vue';

    type ListItem = {
        id: number;
        date: string;//APIの文字列（日付）
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
    const listItems = ref<ListItem[]>([]);
    //listItems.value は ListItem の配列として認識されます

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

    const balance = computed(() => {
        const income = Number(incomeTotal.value ?? 0);
        const expense = Number(expenseTotal.value ?? 0);
        return income - expense;
    });

    const formatCurrency = (value: number) => {
        return value.toLocaleString('ja-JP');
    };

    const eatingOutCount = computed(() => {
        return listItems.value.filter(item => item.category.name === '外食').length;
    });

    const foodExpenseTotal = computed(() => {
        return listItems.value
        .filter(item => item.category.name === '食費')
        .reduce((sum, item) => sum + item.amount, 0);
    });
</script>