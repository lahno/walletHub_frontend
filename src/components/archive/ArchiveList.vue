<script>
import Loader from "@/components/utils/Loader.vue";
import {useToastStore} from "@/stores/useToastStore.js";

const toastStore = useToastStore();

export default {
  components: { Loader },
  props: {
    archives: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openIndex: null, // Индекс текущего открытого аккордеона
    };
  },
  computed: {
    // Преобразуем архивы в формат для обработки (если требуется)
    processedArchives() {
      // Если архивы пусты, возвращаем пустой массив
      if (!this.archives || this.archives.length === 0) return [];
      // Данные уже в нужной структуре, можно использовать их напрямую
      return this.archives.slice().reverse();
    },
  },
  methods: {
    toggleAccordion(index) {
      this.openIndex = this.openIndex === index ? null : index;
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        toastStore.showToast("ID скопирован", true);
      } catch (err) {
        toastStore.showToast(`Ошибка копирования ID: ${err}`, false);
      }
    },
  },
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold dark:text-gray-300 mb-4">Список выполненных задач</h2>

    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >

      <!-- Лоадер -->
      <div v-if="isLoading" class="flex justify-center my-5">
        <Loader :size="10" :mr="0" />
      </div>

      <!-- Контент аккордеона -->
      <div v-else>
        <template v-if="this.archives.length > 0">
          <!-- Рендеринг задач -->
          <div v-for="(task, index) in processedArchives" :key="task.task_id" class="rounded-md">
            <!-- Заголовок задачи -->
            <div class="rounded-md mb-1 bg-gray-100 dark:bg-gray-600">
              <h2 :id="`accordion-heading-${index}`">
                <button
                    type="button"
                    class="flex justify-between items-center w-full p-4 text-left font-medium text-gray-500 dark:text-gray-300"
                    @click="toggleAccordion(index)"
                >
                  <!-- Заголовок -->
                  <span class="w-3/4 truncate">
                    {{ task.task_name }}<br>
                    ID: <span @click="copyToClipboard(task.task_id)" class="cursor-pointer hover:underline">
                          {{task.task_id}}
                  </span>
                  <span class="inline-block ml-1">
                    <svg v-if="task.task_status === 'SUCCESS'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-green-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <svg v-else-if="task.task_status === 'REVOKED'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-yellow-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </span>
                  <br>
                  <template v-if="task.task_status === 'SUCCESS'">
                    <span class="text-xs mr-1">Всего: {{ task.task_result.iteration }};</span>
                    <span class="text-xs mr-1">Успешных: {{ task.task_result.success_iteration }};</span>
                    <span class="text-xs mr-1">Ошибок: {{ task.task_result.error_iteration }};</span>
                    <br>
                  </template>
                  <span class="text-xs">({{ new Date(task.task_date).toLocaleString() }})</span>
                </span>
                  <!-- Иконка раскрытия -->
                  <svg
                      class="w-4 h-4 transform transition-transform"
                      :class="{ 'rotate-180': openIndex === index }"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h2>
            </div>

            <!-- Содержимое задачи (логи) -->
            <div
                v-show="openIndex === index"
                class="p-4 bg-white dark:bg-gray-800"
            >
              <!-- Если логи пусты -->
              <p v-if="!task.logs || task.logs.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                Нет доступных логов.
              </p>

              <!-- Перебираем логи -->
              <ul v-else class="space-y-2">
                <li v-for="log in task.logs" :key="log.id" class="text-gray-600 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1 text-gray-300 inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
                  </svg>
                  <!-- Сообщение лога -->
                  <span class="font-medium text-sm mb-0 mr-1">{{ log.message }}</span>
                  <!-- Форматированная дата -->
                  <span class="text-xs mb-0">
                  ({{ new Date(log.created_at).toLocaleString() }})
                </span>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <div v-else class="text-center">
          <p class="text-gray-400 text-sm py-4">Нет доступных логов</p>
        </div>
      </div>

    </transition>

  </div>
</template>