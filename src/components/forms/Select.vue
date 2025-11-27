<script>
import Input from "@/components/forms/Input.vue";

export default {
  name: "Select",
  components: { Input },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, null],
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  computed: {
    selectedLabel() {
      const selectedItem = this.items.find(
          (item) => item.key === this.modelValue
      );
      return selectedItem ? selectedItem.value : "Выберите...";
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    selectItem(item) {
      this.$emit("update:modelValue", item.key);
      this.isDropdownOpen = false;
      document.removeEventListener("click", this.handleClickOutside);
    },
    handleClickOutside(event) {
      // Если клик произошёл вне текущего компонента
      if (!this.$el.contains(event.target)) {
        this.isDropdownOpen = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
  },
  beforeUnmount() {
    // Удаляем обработчик при размонтировании компонента
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<template>
  <div class="mb-4">
    <div class="block max-w-full text-sm font-light text-gray-700 dark:text-gray-200 mb-1">
      <span
          :class="{
          'after:ml-0.5 after:text-red-500 after:content-[\'*\']': required,
        }"
      >
        {{ placeholder }}
      </span>
    </div>
    <div class="relative block max-w-60">
      <button
          type="button"
          @click="toggleDropdown"
          class="w-full sm:text-sm border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <span
            class="font-medium"
            :class="selectedLabel === 'Выберите...' ? 'text-gray-400 dark:text-gray-400' : 'text-gray-600 dark:text-gray-400'"
        >
          {{ selectedLabel }}
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
          >
            <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <div
          v-if="isDropdownOpen"
          class="absolute z-10 sm:text-sm mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-gray-300 ring-opacity-5 overflow-auto focus:outline-none"
      >
        <ul class="divide-y divide-gray-200">
          <li
              v-for="item in items"
              :key="item.key"
              @click="selectItem(item)"
              class="cursor-pointer px-4 py-2 hover:bg-gray-50/50"
          >
            {{ item.value }}
          </li>
        </ul>
      </div>
    </div>
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
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>