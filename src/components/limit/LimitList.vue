<script>
import { formatDate } from "@/utils.js";
import Loader from "@/components/utils/Loader.vue";

export default {
  components: { Loader },
  methods: { formatDate },
  props: {
    limits: Array, // Проп, содержащий переданные данные
    isLoading: Boolean, // Состояние загрузки
  },
  computed: {
    // Вычисляем список данных для таблицы
    processedLimits() {
      return this.limits.map((item) => {
        // Найдем лимиты по типу "comment" и "subscribe"
        const commentLimit = item.limits.find((limit) => limit.type === "comment");
        const subscribeLimit = item.limits.find((limit) => limit.type === "subscribe");

        return {
          account: item.account, // Данные аккаунта
          commentValue: commentLimit ? commentLimit.value : 0, // Подставляем 0, если "comment" отсутствует
          subscribeValue: subscribeLimit ? subscribeLimit.value : 0, // Подставляем 0, если "subscribe" отсутствует
          limitDate: commentLimit?.created_at || subscribeLimit?.created_at || null, // Дата создания
        };
      });
    },
  },
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold dark:text-gray-300 mb-4">Лимиты аккаунтов</h2>

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

      <!-- Таблица -->
      <div v-else class="max-h-[calc(100vh-20rem)] overflow-x-auto overflow-y-scroll">
        <table class="table-auto w-full divide-y divide-gray-200 bg-white dark:bg-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Account</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comments</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subscribes</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Дата</th>
          </tr>
          </thead>
          <tbody v-if="processedLimits.length > 0" class="bg-white dark:bg-gray-700 divide-y divide-gray-200">
          <tr v-for="(limit, index) in processedLimits" :key="index">
            <!-- Тип -->
            <td class="px-6 py-4 w-2 text-sm text-gray-800 dark:text-gray-300">
              {{ limit.account.type }}
            </td>

            <!-- Имя аккаунта -->
            <td class="px-6 py-4 w-auto text-sm text-gray-800 dark:text-gray-300">
              {{ limit.account.name }}<br>
              <span class="text-xs text-gray-500 dark:text-gray-200" v-if="limit.account.email">({{ limit.account.email }})</span>
            </td>

            <!-- Лимит Comments -->
            <td
                class="px-6 py-4 w-3 text-center text-sm text-green-600 dark:text-green-400"
                :class="limit.commentValue >= 150 ? 'text-red-500 dark:text-red-400' : ''"
            >
              {{ limit.commentValue }}
            </td>

            <!-- Лимит Subscribes -->
            <td
                class="px-6 py-4 w-3 text-center text-sm text-green-600 dark:text-green-400"
                :class="limit.subscribeValue >= 50 ? 'text-red-500 dark:text-red-400' : ''"
            >
              {{ limit.subscribeValue }}
            </td>

            <!-- Дата -->
            <td class="px-6 py-4 w-auto text-sm text-gray-600 dark:text-gray-300">
              {{ limit.limitDate ? formatDate(limit.limitDate) : '-' }}
            </td>
          </tr>
          </tbody>

          <!-- Если данных нет -->
          <tbody v-else>
          <tr>
            <td colspan="4" class="text-center py-4 text-gray-400 text-sm">Нет доступных лимитов</td>
          </tr>
          </tbody>
        </table>
      </div>

    </transition>
  </div>
</template>