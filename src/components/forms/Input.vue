<script>
export default {
  name: "Input",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array, // Массив строк с ошибками
      required: false,
      default: () => [], // По умолчанию пустой массив
    },
  },
  methods: {
    handleInput(event) {
      const value = this.type === "number" ? Number(event.target.value) : event.target.value;

      this.$emit("update:modelValue", value); // Передача нового значения через v-model
      this.$emit("clear-errors"); // Уведомляем родителя об очищении ошибок
    },
  },
  emits: ["update:modelValue", "clear-errors"], // Для работы с v-model
};
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-light text-gray-700 dark:text-gray-300">
      <span
          class="block text-gray-700 dark:text-gray-300"
          :class="{'after:ml-0.5 after:text-red-500 after:content-[\'*\']': required}"
      >
      {{ placeholder }}
      </span>
      <input
          :value="modelValue"
          @input="handleInput"
          :type="type"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm disabled:text-gray-400"
          :class="{'border-red-400':errors && errors.length}"
      />
    </label>
    <!-- Если ошибки есть, отображаем их -->
    <transition name="fade">
      <ul
          v-if="errors && errors.length"
          class="mt-1 text-xs text-red-400"
      >
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out; /* Явно прописываем свойства */
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px); /* Сдвиг элементов вверх */
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0); /* Возврат в начальное положение */
}
</style>

