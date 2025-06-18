<template>
    <div class="form-container">
        <h2 class="form-header">Sign Up</h2>
        <form class="form-group" @submit.prevent="handleRegister">
            <div class="form-group__item">
                <input class="form-group__item-input" type="text" v-model="name" placeholder="ユーザーネーム">
                <div class="error-message">
                    <ErrorMessage name="name" />
                </div>

            </div>

            <div class="form-group__item">
                <input class="form-group__item-input" type="text" v-model="email" placeholder="メールアドレス">
                <div class="error-message">
                    <ErrorMessage name="email" />
                </div>
            </div>

            <div class="form-group__item">
                <input class="form-group__item-input" type="password" v-model="password" placeholder="パスワード">
                <div class="error-message">
                    <ErrorMessage name="password" />
                </div>
            </div>

            <button class="form-btn" type="submit" :disabled="isRunning">
                {{ isRunning ? '登録中...' : '新規登録' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useField, useForm, Field, ErrorMessage, } from 'vee-validate';
import * as yup from 'yup';
import { useAuth } from '~/composables/useAuth';
import { useSingleClick } from '~/composables/useSingleClick';

const validationSchema = yup.object({
    name: yup
    .string()
    .required('ユーザーネームは必須です').max(20, 'ユーザーネームは20文字以内で入力してください'),

    email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),

    password: yup
    .string()
    .min(6, 'パスワードは6文字以上で入力してください')
    .required('パスワードは必須です')
});

const { handleSubmit, validate, resetForm } = useForm({
    validationSchema,
    validateOnMount: false
});

const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: password } = useField('password');

const { register } = useAuth();
const { run, isRunning } = useSingleClick();

const handleRegister = () => {
    run(async () => {
        try {
            const result = await validate()
                if (!result.valid) {
                    return; // バリデーションエラーがある場合は送信中止
            };
            await register(name.value, email.value, password.value);
            alert('登録成功');
        } catch (e) {
            console.error(e)
        }
    });
};
</script>