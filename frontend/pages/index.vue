<template>
    <article class="list-items__wrap">
        <div class="month-navigation">
            <button class="month-navigation__button" @click="changeMonth(-1)">←</button>
            <h2 class="summary-header">
                {{ format(currentMonth, 'yyyy年M月') }}
            </h2>
            <button class="month-navigation__button" @click="changeMonth(1)">→</button>
        </div>
        <section class="list-table__wrap">
            <table class="list-table">
                <thead>
                    <tr class="list-table__row">
                    <th class="list-table__header">日付</th>
                    <th class="list-table__header">収支</th>
                    <th class="list-table__header">カテゴリ</th>
                    <th class="list-table__header">金額</th>
                    <th class="list-table__header">メモ</th>
                    <th class="list-table__header">削除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="listItems.length === 0" class="list-table__row">
                        <td class="list-table__text" colspan="6">登録がありません</td>
                    </tr>
                    <tr
                    v-for="item in listItems"
                    :key="item.id"
                    class="list-table__row"
                    v-else
                    >
                        <td class="list-table__text">{{ item.date }}</td>
                        <td class="list-table__text">{{ item.category.type === 'income' ? '収入' : '支出' }}</td>
                        <td class="list-table__text">{{ item.category.name }}</td>
                        <td class="list-table__text">{{ item.amount }}</td>
                        <td class="list-table__text memo">{{ item.memo || '-' }}</td>
                        <td class="list-table__text">
                            <form class="list-table__delete-form" @submit.prevent="deleteData(item)">
                            <button class="list-table__delete-btn" type="submit">×</button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <h2 class="graph-date__title">今月のお金の動き</h2>
        <section class="graph-date">
            <div class="totalling-wrap">
                <div class="totalling-amount__date">
                    <p class="totalling-income__text">収入
                        <span class="totalling-income__span">¥{{ formatCurrency(incomeTotal) }}</span>
                    </p>

                    <p class="totalling-expense__text">支出
                        <span class="totalling-expense__span">¥{{ formatCurrency(expenseTotal) }}</span>
                    </p>

                    <p class="totalling-balance__text">収支
                        <span class="totalling-balance__span">¥{{ formatCurrency(balance) }}</span>
                    </p>
                </div>

                <div class="totalling-amount__date">
                    <img class="icon-img" src="/icons/外食.png">
                    <p class="totalling-expense__text">外食の回数
                        <span class="totalling-expense__span">{{ eatingOutCount }}回</span>
                    </p>
                </div>
            </div>
            <div class="graph-wrap">
                <GraphPie :data="listItems" />
            </div>

            <div class="by-category-wrap">
                <div class="by-category__item" v-for="cat in expenseCategoryMaster" :key="cat.name">
                    <img :src="cat.icon" alt="" class="icon-img" />
                    {{ cat.name }}
                    <span class="by-category__item-span">{{ formatYen(categoryTotals[cat.name] || 0) }}</span>
                </div>
            </div>
        </section>

    </article>
</template>

<script setup lang="ts">
    import axios from 'axios';
    import type { NuxtApp } from '#app';
    import { format, addMonths } from 'date-fns';
    import { ref, toRef, computed } from 'vue';
    import { useSingleClick } from '~/composables/useSingleClick';
    import GraphPie from '~/components/GraphPie.vue';
    import { useMonthlyTotals } from '~/composables/useMonthlyTotals';

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
    }

    type Category = {
        id: number;
        name: string;
        icon: string;
        type: 'income' | 'expense';
    }

    interface ListResponse {
        listItems: ListItem[];
        incomeTotal: number;
        expenseTotal: number;
        categories: Category[];
    }

    const { $axios } = useNuxtApp();
    const currentMonth = ref(new Date());
    const listItems = ref<ListItem[]>([]);
    //listItems.value は ListItem の配列として認識されます
    const categories = ref<Category[]>([]);

    const incomeTotal = ref<number>(0);
    const expenseTotal = ref<number>(0);

    const { run, isRunning } = useSingleClick();

    const { categoryTotals, formatYen, expenseCategoryMaster } = useMonthlyTotals(
        toRef(listItems),
        categories
    );

    onMounted(async () => {
        try {
            await waitForAuthReady();
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
            const res = await $axios.get<ListResponse>(`/lists?month=${formattedMonth.value}`);
            listItems.value = res.data.listItems;
            incomeTotal.value = res.data.incomeTotal;
            expenseTotal.value = res.data.expenseTotal;
            categories.value = res.data.categories;
            console.log(res.data);
        } catch (err) {
            console.error('データ取得に失敗しました', err)
        }
    }

    function deleteData(item: ListItem) {
        run(async (): Promise<void> => {
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

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('ja-JP');
    };

    const eatingOutCount = computed(() => {
        return listItems.value.filter(item => item.category.name === '外食').length;
    });
</script>