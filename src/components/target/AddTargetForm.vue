<script>
import Input from "@/components/forms/Input.vue";
import Button from "@/components/forms/Button.vue";

export default {
  components: { Input, Button },
  props: {
    onSubmit: { type: Function, required: true },
    errors: { type: Object, default: () => ({}) }, // Ошибки передаются через основной компонент
    isLoadingAddBtn: { type: Boolean, default: false }
  },
  data() {
    return {
      form: {
        username: "",
      }
    };
  },
  methods: {
    async submitForm() {
      this.$emit("submit", { ...this.form }); // Отправляем данные формы вверх
    },
    clearFieldErrors(fieldName) {
      this.$emit("clear-errors", fieldName); // Очистка ошибок для конкретного поля
    },
    resetForm() {
      this.form = {
        username: "",
      }; // Сброс формы в начальное состояние
    }
  }
};
</script>

<template>
  <div class="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-300">Добавить таргет</h2>
    <form @submit.prevent="submitForm">
      <!-- UserName -->
      <Input
          v-model="form.username"
          placeholder="Username"
          :required="true"
          :errors="errors['username']"
          @clear-errors="clearFieldErrors('username')"
      />

      <div class="flex space-x-2 mt-5">
        <!-- Кнопка отправки -->
        <div class="">
          <Button text="Добавить" :isLoading="isLoadingAddBtn" color="emerald"/>
        </div>
      </div>
    </form>
  </div>
</template>