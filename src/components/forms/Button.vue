<script>
export default {
  name: "Button",
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "slate", // Цвет по умолчанию
    },
    type: {
      type: String,
      required: false,
      default: "submit",
    },
    position: {
      type: String, // Например: 'start', 'center', 'end'
      required: false,
      default: "center",
    },
    isLoading: {
      type: Boolean, // Управляет отображением лоадера
      required: false,
      default: false,
    },
    onClick: {
      type: Function, // Событие клика передается из родителя
      required: false,
    },
    icon: {
      type: [Object, Function], // Иконка передается, как объект (Vue-компонент)
      required: false,
      default: null,
    },
    size: {
      type: String, // Размер кнопки, например: 'sm', 'md', 'lg'
      required: false,
      default: "md", // Размер по умолчанию: Medium
    },
  },
  computed: {
    buttonClasses() {
      const colorMap = {
        slate: {
          bg: "bg-slate-600",
          hover: "hover:bg-slate-500",
          focus: "focus-visible:outline-slate-600",
          text: "text-sm text-white",
        },
        indigo: {
          bg: "bg-indigo-600",
          hover: "hover:bg-indigo-500",
          focus: "focus-visible:outline-indigo-600",
          text: "text-sm text-white",
        },
        emerald: {
          bg: "bg-emerald-600",
          hover: "hover:bg-emerald-500",
          focus: "focus-visible:outline-emerald-600",
          text: "text-sm text-white",
        },
        red: {
          bg: "bg-red-600",
          hover: "hover:bg-red-500",
          focus: "focus-visible:outline-red-600",
          text: "text-sm text-white",
        },
        sky: {
          bg: "bg-sky-600",
          hover: "hover:bg-sky-500",
          focus: "focus-visible:outline-sky-600",
          text: "text-sm text-white",
        },
        blue: {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-500",
          focus: "focus-visible:outline-blue-600",
          text: "text-sm text-white",
        },
        orange: {
          bg: "bg-orange-400",
          hover: "hover:bg-orange-300",
          focus: "focus-visible:outline-orange-400",
          text: "text-sm text-white",
        },
        lime: {
          bg: "bg-lime-600",
          hover: "hover:bg-lime-500",
          focus: "focus-visible:outline-lime-600",
          text: "text-sm text-white",
        },
        rose: {
          bg: "bg-rose-500",
          hover: "hover:bg-rose-400",
          focus: "focus-visible:outline-rose-500",
          text: "text-sm text-white",
        },
        // Добавьте другие цвета при необходимости
      };

      const sizeMap = {
        sm: "text-xs px-2.5 py-1.5",
        md: "text-sm px-3.5 py-2.5", // Размер по умолчанию
        lg: "text-base px-4 py-3",
        xl: "text-lg px-5 py-4",
      };

      // Дефолт: используем цвет "indigo" (если цвет не указан или неверный)
      const selectedColor = colorMap[this.color] || colorMap.indigo;
      // Используем указанный size или default
      const selectedSize = sizeMap[this.size] || sizeMap.md;

      return [
        "rounded-md shadow-xs",
        "hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:text-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center",
        selectedColor.bg,
        selectedColor.hover,
        selectedColor.focus,
        selectedColor.text,
        selectedSize,
      ];
    },
  },
  methods: {
    handleClick() {
      if (this.onClick) {
        this.onClick(); // Вызываем пользовательскую функцию
      }
    },
  },
};
</script>

<template>
  <div :class="[`flex justify-${position}`]">
    <button
        :disabled="isLoading"
        :type="type"
        @click="handleClick"
        :class="buttonClasses"
    >
      <!-- Если isLoading = true, показываем лоадер -->
      <svg
          v-if="isLoading"
          aria-hidden="true"
          role="status"
          class="inline w-4 h-4 animate-spin text-white mr-2"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
        />
        <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
        />
      </svg>
      <!-- Если не загрузка, показываем текст -->
      <span v-if="!isLoading" class="inline-flex items-center">
        <!-- Если иконка передана, отображаем её перед текстом -->
        <component
            v-if="icon"
            :is="icon"
            :class="text.length ? 'w-5 h-5 mr-2' : 'w-4 h-4 mr-0 ml-0'"
        />
        {{ text }}
      </span>
      <span v-else>Loading...</span>
    </button>
  </div>
</template>