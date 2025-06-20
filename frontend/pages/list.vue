<template>
    <div class="center-wrapper">
        <div class="income-expense-toggle">
            <button :class="{ active: type === 'income' }" @click="type = 'income'">収入</button>
            <button :class="{ active: type === 'expense' }" @click="type = 'expense'">支出</button>
        </div>
    </div>

    <div class="slide-wrapper">
        <transition name="slide">
            <div v-if="step === 1" key="step1" class="step step1">
                <h2 class="slide-title">カテゴリを選択</h2>
                <div class="categories">
                    <button v-for="cat in filteredCategories" :key="cat.name" @click="selectCategory(cat)" class="category-button">
                        <div class="icon-circle">
                        <img :src="cat.icon" alt="icon" class="icon-img" />
                        </div>
                        <span class="category-name">{{ cat.name }}</span>
                    </button>
                </div>
            </div>

            <div v-else key="step2" class="step step2">
                <div v-if="selectedCategory" class="selected-category">
                    <div class="selected-icon-circle">
                        <img :src="selectedCategory.icon" alt="icon" class="icon-img" />
                    </div>
                    <h2>{{ selectedCategory.name }}</h2>
                </div>
                <form class="list-form" @submit.prevent="submitData">
                    <div class="list-input__group">
                        <input class="list-input__item wide-click-area" type="date" v-model="date">
                        <div class="error-message">
                            <ErrorMessage name="date" />
                        </div>

                        <input class="list-input__item" type="number" placeholder="金額を入力(例:1000円→1000)" v-model="amount">
                        <div class="error-message">
                            <ErrorMessage name="amount" />
                        </div>

                        <input class="list-input__item" type="text" placeholder="メモ（任意）" v-model="memo"/>
                        <button class="form-btn" type="submit" :disabled="isRunning">
                        {{ isRunning ? '送信中...' : '保存する' }}
                        </button>
                    </div>
                    <input type="hidden" :value="currentUserId" name="user_id" />
                    <input type="hidden" :value="selectedCategory.id" name="category_id" />
                </form>
                <button class="back-button" @click="step = 1">戻る</button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import type { NuxtApp } from '#app';
import { useField, useForm, Field, ErrorMessage, } from 'vee-validate';
import * as yup from 'yup';
import { useSingleClick } from '~/composables/useSingleClick';

const { $axios } = useNuxtApp();

const type = ref('expense');
const step = ref(1);
const selectedCategory = ref(null);
const currentUserId = ref('');
const memo = ref('');

//categories を ref([]) として初期化する
const categories = ref([]);

const { run, isRunning } = useSingleClick();

onMounted(async () => {
    try {
        const res = await $axios.get('/categories');
        categories.value = res.data.categories;
        currentUserId.value = res.data.user.id;
    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
    }
});

const filteredCategories = computed(() => {
    return categories.value.filter(cat => cat.type === type.value)
});
//type が 'income' なら、categories の中から type: 'income' のものだけを取り出して返す。
//type が 'expense' なら、type: 'expense' のものだけ返す。
//computed にしておけばtype が変わったら自動的に filteredCategories も更新される

function selectCategory(category) {
    console.log('選択されたカテゴリ:', category);
    selectedCategory.value = category;
    step.value = 2;
}

watch(type, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        step.value = 1;
        selectedCategory.value = null;
    }
});

const validationSchema = yup.object({
    date: yup
    .date()
    .typeError('正しい日付を選択してください')
    .required('日付を選択してください'),

    amount: yup
    .number()//数値型で検証
    .required('金額を入力してください')
    .typeError('金額は半角数字で入力してください')
});

const { handleSubmit, validate, resetForm } = useForm({
    validationSchema,
    validateOnMount: false
});

const { value: date } = useField('date');
const { value: amount } = useField('amount');
//useField('date') はすでに date という状態を持つ ref を返します

const submitData = () => {
    run(async () => {
        try {
            const result = await validate()
            if (!result.valid) {
                return; // バリデーションエラーがある場合は送信中止
            };

            const res = await $axios.post('/lists', {
            user_id: currentUserId.value,
            category_id: selectedCategory.value?.id,
            date: date.value,
            amount: Number(amount.value),
            memo: memo.value,
            });
            console.log(res);
            alert('保存しました');
            resetForm();
            memo.value = '';
            step.value = 1;
        } catch (err) {
            console.error('保存に失敗:', err);
        }
    });
};
</script>