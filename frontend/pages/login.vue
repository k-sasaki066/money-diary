<template>
    <div class="form-container radius5 flex">
        <h2 class="form-header">Sign In</h2>
        <form class="auth-form" @submit.prevent="handleLogin">
            <div class="auth-form__item">
                <input class="auth-form__item-input" type="text" v-model="email" placeholder="メールアドレス">
                <div class="error-message">
                    <ErrorMessage name="email" />
                </div>
            </div>

            <div class="auth-form__item">
                <input class="auth-form__item-input" type="password" v-model="password" placeholder="パスワード">
                <div class="error-message">
                    <ErrorMessage name="password" />
                </div>
            </div>

            <button class="form-btn" type="submit" :disabled="isRunning">
                {{ isRunning ? '送信中...' : 'ログイン' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useField, useForm, ErrorMessage, Field } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useSingleClick } from '~/composables/useSingleClick';

const validationSchema = yup.object({
    email: yup
    .string()
    .required('メールアドレスは必須です'),

    password: yup
    .string()
    .required('パスワードは必須です')
});

const { handleSubmit, validate, resetForm } = useForm({
    validationSchema,
    validateOnMount: false
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const { login } = useAuth();
const { run, isRunning } = useSingleClick();

const handleLogin = () => {
    run(async () => {
        try {
            const result = await validate()
            if (!result.valid) {
                return; // バリデーションエラーがある場合は送信中止
            };
            await login(email.value, password.value);
            alert('ログイン成功');
        } catch (e) {
            console.error(e);
            alert('ログインに失敗しました。再度お試しください。');
        }
    });
};
</script>