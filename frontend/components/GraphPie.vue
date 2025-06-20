<template>
    <canvas ref="pieChart" class="graph-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';
//Chart.jsの全チャートタイプ・プラグインを一括で読み込み(yarn add chart.jsが必要だった)

/** ── 型定義（親と共通化したい場合は別ファイルに切り出して import） */
type ListItem = {
    id: number
    date: string
    amount: number
    memo: string
    category: {
        id: number
        name: string
        type: 'income' | 'expense'
    }
}

const props = defineProps<{
    data: ListItems[];
}>();

const pieChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
//Vue の ref を使って リアクティブな DOM 要素（ここでは <canvas>）の参照 を定義
//初期値が null なのは、Vue の onMounted() フックまでは DOM に要素が存在しないため

// 円グラフ作成関数
function createPieChart(rows: ListItems[]) {
    if (!pieChart.value) return;

  // カテゴリ別合計を集計
    const totals: Record<string, number> = {};
    rows.forEach(item => {
        if (item.category.type === 'income') return;

        const key = item.category.name;
        totals[key] = (totals[key] || 0) + item.amount;
    })

    const sortedEntries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

    const labels = sortedEntries.map(([key]) => key);
    const values = sortedEntries.map(([, value]) => value);

    // 既存のチャートがあれば破棄
    if (chartInstance) {
        chartInstance.destroy();
    }

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(pieChart.value, {
        type: 'doughnut',
        data: {
        labels,
        datasets: [{
            backgroundColor: [
            '#EB5757', '#6FCF97', '#56CCF2', '#F2994A',
            '#F2C94C', '#2F80ED', '#9B51E0', '#BB6BD9',
            ],
            data: values,
        }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                display: true,
                text: 'カテゴリ毎の支出割合',
                },
            },
        },
    });
}

/** 親から渡された listItems が変わるたびに描画し直す */
watch(
    () => props.data,
    newVal => createPieChart(newVal),
    { immediate: true }
);

onBeforeUnmount(() => chartInstance?.destroy());
</script>