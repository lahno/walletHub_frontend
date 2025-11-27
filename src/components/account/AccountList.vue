<script>
import {formatDate, notAuthDialog} from "@/utils.js";
import Loader from "@/components/utils/Loader.vue";
import AddAccountForm from "@/components/account/AddAccountForm.vue";
import axios from "axios";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import DeleteDialog from "@/components/account/DeleteDialog.vue";

export default {
  components: {DeleteDialog, InfoDialog, AddAccountForm, Loader},
  data() {
    return {
      isInitUrlDialogOpen: false,
      initUrlDialogData: { title: "", text: "", copy_text: "", url: "" },

      isLoadingInitBtn: false,
    }
  },
  methods: {
    formatDate,

    closeDialogInitUrl() {
      // Закрываем модальное окно
      this.isInitUrlDialogOpen = false;
    },
    async initAuthUrl() {
      this.isLoadingInitBtn = true;
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/of/init-url/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data) {
          const init_url = response.data.init_url;
          // Устанавливаем данные для InfoDialog
          this.initUrlDialogData = {
            title: "Ссылка для авторизации",
            text: "Скопируйте ссылку или перейдите по кнопке ниже",
            copy_text: init_url,
            url: init_url,
            text_btn: "Перейти"
          };
          this.isInitUrlDialogOpen = true; // Открываем диалоговое окно

          return response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        } else if (response.status === 404) {
          toastStore.showToast("Аккаунт не найден в системе", false);
        }
      } catch (error) {
        toastStore.showToast("Ошибка при получении данных аккаунта", false);
      } finally {
        this.isLoadingInitBtn = false;
      }
    }
  },
  props: {
    accounts: Array,
    isLoading: Boolean
  },
  emits: ["edit-account", "delete-account"]
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold dark:text-gray-300 mb-4">
      Список аккаунтов ({{accounts.length}})
      <div class="float-right">
        <AddAccountForm
            ref="addAccountForm"
            :is-loading-init-btn="isLoadingInitBtn"
            @init-auth-url="initAuthUrl"
        />
      </div>
    </h2>



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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">OF_ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Имя</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status/Username</th>
<!--            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>-->
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Тип</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Дата добавления</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
          </tr>
          </thead>
          <tbody v-if="accounts.length > 0" class="bg-white dark:bg-gray-700 divide-y divide-gray-200">
          <!-- Цикл по списку аккаунтов -->
          <tr v-for="account in accounts" :key="account.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ account.of_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
              <a :href="`https://onlyfans.com/${account.username}`" target="_blank" class="inline-flex items-center">
                <img
                    v-if="account.avatar"
                    :src="account.avatar"
                    alt="avatar"
                    class="mr-1 w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />{{ account.name }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span v-if="account.status" class="text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </span>
              <span v-else class="text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              {{ account.username }}
            </td>
<!--            <td-->
<!--                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"-->
<!--                :class="account.status ? 'text-gray-800' : 'text-red-500'"-->
<!--            >-->
<!--              {{ account.email }}-->
<!--            </td>-->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ account.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ formatDate(account.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <!-- Кнопка редактировать -->
              <button
                  @click="$emit('edit-account', account)"
                  class="relative p-1 dark:text-gray-300 hover:text-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <span class="sr-only">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <!-- Кнопка удалить -->
              <button
                  @click="$emit('delete-account', account)"
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
            <td colspan="6" class="text-center text-gray-500 py-4">Нет доступных аккаунтов</td>
          </tr>
          </tbody>
        </table>
      </div>
    </transition>

    <!-- Диалоговое окно инициализации ссылки на авторизацию -->
    <InfoDialog
        v-if="isInitUrlDialogOpen"
        :data_msg="initUrlDialogData"
        @close="closeDialogInitUrl"
    />
  </div>
</template>