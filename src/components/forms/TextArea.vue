<script>
export default {
  name: "TextArea",
  props: {
    modelValue: {
      type: String,
      default: "",
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
    rows: {
      type: Number, // Количество строк для textarea
      default: 3,
    },
    errors: {
      type: Array, // Массив строк с ошибками
      required: false,
      default: () => [], // По умолчанию пустой массив
    },
    helpBtnFunc: {
      type: Function,
      required: false,
    }
  },
  methods: {
    handleInput(event) {
      this.$emit("update:modelValue", event.target.value); // Передача нового значения через v-model
      this.$emit("clear-errors"); // Уведомляем родителя об очищении ошибок
    },
  },
  emits: ["update:modelValue", "clear-errors"], // Для работы с v-model
};
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-light text-gray-700">
      <span
          class="inline mr-1 text-gray-700 dark:text-gray-300"
          :class="{'after:ml-0.5 after:text-red-500 after:content-[\'*\']': required}"
      >
      {{ placeholder }}
      </span>
      <svg v-if="helpBtnFunc" @click.stop="helpBtnFunc" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 inline z-30 text-blue-500 cursor-pointer hover:text-blue-700">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
      <!-- Заменяем input на textarea -->
      <textarea
          :value="modelValue"
          @input="handleInput"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm disabled:text-gray-400"
          :class="{'border-red-400': errors && errors.length}"
      ></textarea>
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