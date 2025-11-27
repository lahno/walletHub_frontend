<script>
import Input from "@/components/forms/Input.vue";
import Select from "@/components/forms/Select.vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import Button from "@/components/forms/Button.vue";
import Loader from "@/components/utils/Loader.vue";
import axios from "axios";
import {notAuthDialog} from "@/utils.js";
import {useToastStore} from "@/stores/useToastStore.js";

const toastStore = useToastStore();

export default {
  components: {Loader, Input, Select, Switch, SwitchGroup, SwitchLabel, Button },
  data() {
    return {
      form: {
        type: "main",
      },
      result: {},
      isLoadingBtn: false,
      text_no_data: "Проверка не выполнена"
    };
  },
  methods: {
    async checkAccount() {
      this.result = {}
      this.isLoadingBtn = true;
      this.text_no_data = "Проверяем..."
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/account/check_status/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200 && response.data) {
          this.result = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        } else if (response.status === 404) {
          toastStore.showToast("Юзер не найден в системе", false);
        }
      } catch (error) {
        toastStore.showToast("Ошибка при получении данных", false);
      } finally {
        this.isLoadingBtn = false;
        this.text_no_data = "Проверка не выполнена"
      }
    },
  }
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-300">Статусы аккаунтов</h2>

    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="result.success" class="max-h-[calc(100vh-20rem)] overflow-x-auto overflow-y-scroll">
        <table class="table-auto w-full max-w-full divide-y divide-gray-200 bg-white">
          <thead class="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Error</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Account</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
          </tr>
          </thead>
          <tbody v-if="result.data.length > 0" class="bg-white dark:bg-gray-700 divide-y divide-gray-200">
          <!-- Цикл по списку ошибок -->
          <tr v-for="error in result.data" :key="error.account_email">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 inline mr-1 text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>

              {{ error.error }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ error.account_email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ error.account_type }}</td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="5" class="text-center text-gray-500 py-4">Нет ошибок аккаунтов</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="font-light text-center text-gray-500 py-5">{{ text_no_data }}</p>
      </div>
    </transition>

    <form @submit.prevent="checkAccount">
      <div class="mt-8">
        <!-- Кнопка запуска -->
        <div class="mb-4">
          <Button text="Проверить статусы" :isLoading="isLoadingBtn" color="emerald"/>
        </div>
      </div>
    </form>

  </div>
</template>