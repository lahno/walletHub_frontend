<script>
import axios from 'axios';
import Button from "@/components/forms/Button.vue";
import Input from "@/components/forms/Input.vue";
import HeaderMain from "@/components/HeaderMain.vue";
import { useToastStore } from '@/stores/useToastStore'

const toastStore = useToastStore()

export default {
  name: 'RegisterView',
  components: {HeaderMain, Input, Button},
  data() {
    return {
      username: '',
      email: '',
      password: '',
      isLoading: false,
      showBtn: true,
      errors: {}, // Список ошибок
    };
  },
  methods: {
    async register() {
      this.isLoading = true;
      this.errors = {}; // Очищаем ошибки перед новой отправкой
      try {
        const response = await axios.post('/register/', {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        // console.log(response);
        if (response.status === 201) {
          this.showBtn = false;
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          this.$router.push('/auth/dashboard');
          toastStore.showToast('Регистрация успешно выполнена')
        }else{
          toastStore.showToast('Registration failed!', false);
        }
      } catch (error) {
        // Обрабатываем ошибки ответа
        if (error.response && (error.response.status === 400 || error.response.status === 401)) {
          this.errors = error.response.data;
        } else {
          console.error('Unexpected error:', error);
        }
        toastStore.showToast('Registration error!', false);
      } finally {
        this.isLoading = false; // Завершить загрузку
      }
    },
    clearFieldErrors(fieldName) {
      if (this.errors[fieldName]) { // Удаляем ошибки для указанного поля
        this.errors[fieldName] = []; // Очистка массива ошибок
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-5">
      <h1 class="text-xl font-medium mb-4 text-center">Register</h1>
      <div v-if="errors['detail']" class="p-3 mb-4 text-xs text-red-700 rounded-lg bg-red-50 dark:bg-gray-100 dark:text-red-400" role="alert">
        {{errors['detail']}}
      </div>
      <form @submit.prevent="register">
        <Input
            v-model="username"
            placeholder="Login"
            :required="true"
            :disabled="isLoading"
            :errors="errors['username']"
            @clear-errors="clearFieldErrors('username')"
        />
        <Input
            v-model="email"
            placeholder="Email"
            :required="true"
            :disabled="isLoading"
            :errors="errors['email']"
            @clear-errors="clearFieldErrors('email')"
        />
        <Input
            v-model="password"
            placeholder="Password"
            type="password"
            :required="true"
            :disabled="isLoading"
            :errors="errors['password']"
            @clear-errors="clearFieldErrors('password')"
        />
<!--        <Input-->
<!--            v-model="confirm_password"-->
<!--            placeholder="Confirm Password"-->
<!--            type="password"-->
<!--            :required="true"-->
<!--            :disabled="isLoading"-->
<!--            :errors="errors['password']"-->
<!--            @clear-errors="clearFieldErrors('password')"-->
<!--        />-->
        <Button
            v-if="showBtn"
            :isLoading="isLoading"
            :onClick="register"
            text="Register"
            position="end"
        />
      </form>
    </div>
  </div>
</template>