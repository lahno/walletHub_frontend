<script>
import {formatDate} from "@/utils.js";
import Loader from "@/components/utils/Loader.vue";

export default {
  components: {Loader},
  methods: {formatDate},
  props: {
    targets: Array,
    isLoading: Boolean
  },
  emits: ["edit-target", "delete-target"]
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold dark:text-gray-300 mb-4">Список таргетов ({{targets.length}})</h2>

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

      <!-- Основное содержимое -->
      <div v-else class="max-h-[calc(100vh-20rem)] overflow-x-auto overflow-y-scroll">
        <table class="table-auto w-full max-w-full divide-y divide-gray-200 bg-white">
          <thead class="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">OFID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Дата добавления</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
          </tr>
          </thead>
          <tbody v-if="targets.length > 0" class="bg-white dark:bg-gray-700 divide-y divide-gray-200">
          <!-- Цикл по списку аккаунтов -->
          <tr v-for="target in targets" :key="target.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
              {{ target.of_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
              {{ target.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ formatDate(target.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <!-- Кнопка удалить -->
              <button
                  @click="$emit('delete-target', target)"
                  class="relative p-1 text-red-600 hover:text-red-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <span class="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="5" class="text-center text-gray-500 py-4">Нет доступных таргетов</td>
          </tr>
          </tbody>
        </table>
      </div>
    </transition>
  </div>
</template>