<script>
import axios from 'axios';
import Input from '../components/forms/Input.vue';
import Button from '../components/forms/Button.vue';
import HeaderMain from "@/components/HeaderMain.vue";
import { useToastStore } from '@/stores/useToastStore'

const toastStore = useToastStore();
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      showBtn: true,
      errors: {}, // Список ошибок
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errors = {}; // Очищаем ошибки перед новой отправкой
      try {
        const response = await axios.post('/token/', {
          username: this.username,
          password: this.password,
        });
        if (response.status === 200) {
          this.showBtn = false;
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          this.$router.push('/auth/dashboard');
        } else {
          toastStore.showToast("Error authentication", false);
        }
      } catch (error) {
        // Обрабатываем ошибки ответа
        if (error.response && (error.response.status === 400 || error.response.status === 401)) {
          this.errors = error.response.data;
        } else {
          console.error('Unexpected error:', error);
        }
        toastStore.showToast("Error authentication", false);
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
  components: {
    HeaderMain,
    Input,
    Button,
  },
};
</script>

<template>
  <div>
    <div class="max-w-md mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg p-5">
      <h1 class="text-xl font-medium mb-4 text-center">Login</h1>
      <div v-if="errors['detail']" class="p-3 mb-4 text-xs text-red-700 rounded-lg bg-red-50 dark:bg-gray-100 dark:text-red-400" role="alert">
        {{errors['detail']}}
      </div>
      <form @submit.prevent="login">
        <Input
            v-model="username"
            placeholder="Username"
            :required="true"
            :disabled="isLoading"
            :errors="errors['username']"
            @clear-errors="clearFieldErrors('username')"
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
        <Button
            v-if="showBtn"
            :isLoading="isLoading"
            :onClick="login"
            text="Login"
            position="center"
        />
      </form>
    </div>
  </div>
</template>