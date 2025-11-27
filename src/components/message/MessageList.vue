<script>
import {formatDate} from "@/utils.js";
import Loader from "@/components/utils/Loader.vue";

export default {
  components: {Loader},
  methods: {formatDate},
  props: {
    messages: Array,
    isLoading: Boolean
  },
  emits: ["edit-message", "delete-message"]
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold dark:text-gray-300 mb-4">Список messages ({{messages.length}})</h2>

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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status/Text</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Accounts</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Дата создания</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
          </tr>
          </thead>
          <tbody v-if="messages.length > 0" class="bg-white dark:bg-gray-700 divide-y divide-gray-200">
          <!-- Цикл по списку аккаунтов -->
          <tr v-for="message in messages" :key="message.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300"
                :class="message.status ? 'text-gray-800' : 'text-red-500'">
              <span v-if="message.status" class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </span>
              <span v-else class="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              {{ message.text }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
              <div class="flex flex-wrap gap-2">
                <span
                    v-for="account in message.accounts_details.slice(0, 3)"
                    :key="account.id"
                    class="px-2 py-1 text-xs text-white bg-blue-500 rounded-md"
                    >
                    {{ account.name }}
                </span>
                <span v-if="message.accounts_details.length > 3" class="text-xs py-1 text-gray-600 dark:text-gray-400">
                  + ещё {{ message.accounts_details.length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(message.created_at, {day: "numeric", month: "long", year: "numeric"}) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <!-- Кнопка редактировать -->
              <button
                  @click="$emit('edit-message', message)"
                  class="relative p-1 dark:text-gray-300 hover:text-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <span class="sr-only">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <!-- Кнопка удалить -->
              <button
                  @click="$emit('delete-message', message)"
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
            <td colspan="5" class="text-center text-gray-500 py-4">Нет доступных messages</td>
          </tr>
          </tbody>
        </table>
      </div>
    </transition>
  </div>
</template>