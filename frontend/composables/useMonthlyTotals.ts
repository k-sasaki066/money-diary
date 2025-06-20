import { ref, computed } from 'vue';

interface Category {
    name: string;
    icon: string;
    type: 'income' | 'expense';
}

interface TransactionItem {
    amount: number;
    category: Category;
}

export const useMonthlyTotals = (
    listItems: Ref<TransactionItem[]>,
    allCategories: Ref<Category[]>
    ) => {
    const expenseCategoryMaster = computed(() =>
        allCategories.value.filter((cat) => cat.type === 'expense')
    )
    //type === 'expense' のカテゴリだけを取り出した配列

    const categoryTotals = computed(() => {
        const totals: Record<string, number> = {}

        // ① 全カテゴリを0で初期化
        expenseCategoryMaster.value.forEach((cat) => {
        totals[cat.name] = 0
        })

        // ② 金額を加算
        listItems.value.forEach((item) => {
        const name = item.category.name
        if (item.category.type === 'expense' && totals[name] !== undefined) {
            totals[name] += item.amount
        }
        })

        return totals
    })

    const formatYen = (v: number) =>
        new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        currencyDisplay: 'narrowSymbol',
        }).format(v)

    return {
        expenseCategoryMaster,
        categoryTotals,
        formatYen,
    }
}