<script>
import Input from "@/components/forms/Input.vue";
import Select from "@/components/forms/Select.vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import Button from "@/components/forms/Button.vue";
import Loader from "@/components/utils/Loader.vue";
import TextArea from "@/components/forms/TextArea.vue";
import Multiselect from 'vue-multiselect'

export default {
  components: {Loader, Input, TextArea, Select, Multiselect, Switch, SwitchGroup, SwitchLabel, Button },
  props: {
    propAccounts: {
      type: Array,
      default: () => [],
    },
    onSubmit: { type: Function, required: true },
    errors: { type: Object, default: () => ({}) }, // Ошибки передаются через основной компонент
    isLoadingAddBtn: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        text: "",
        status: true,
        accounts: [],
      }
    };
  },
  computed: {
    accountOptions() {
      return this.propAccounts.filter(account => account.type === 'main').map(account => ({
        label: account.name,
        value: account.id,
      }));
    },
  },
  methods: {
    async submitForm() {
      this.$emit("submit", { ...this.form, accounts: this.form.accounts.filter(account => account.type === 'main').map(account => account.value),
      }); // Отправляем данные формы вверх
    },
    clearFieldErrors(fieldName) {
      this.$emit("clear-errors", fieldName); // Очистка ошибок для конкретного поля
    },
    resetForm() {
      this.form = {
        text: "",
        status: true,
        accounts: [],
      }; // Сброс формы в начальное состояние
    }
  },
};
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-300">Добавить message</h2>

    <!-- Лоадер -->
    <div v-if="isLoading" class="flex justify-center my-5">
      <Loader :size="10" :mr="0" />
    </div>

    <form v-else @submit.prevent="submitForm" class="max-w-md mx-auto">
      <!-- Text -->
      <TextArea
          v-model="form.text"
          placeholder="Text"
          :required="true"
          :errors="errors['text']"
          @clear-errors="clearFieldErrors('text')"
      />

      <!-- MultiSelect для аккаунтов -->
      <Multiselect
          v-model="form.accounts"
          :options="accountOptions"
          placeholder="Выберите аккаунты"
          label="label"
          track-by="value"
          class="mb-3"
          :multiple="true"
          :preserve-search="true"
          :close-on-select="true"
          :clear-on-select="false"
      />


      <!-- Status -->
      <SwitchGroup>
        <div class="flex items-center">
          <SwitchLabel class="mr-4 text-sm font-light  text-gray-700 dark:text-gray-300">Статус:</SwitchLabel>
          <Switch
              v-model="form.status"
              :class="form.status ? 'bg-green-500' : 'bg-slate-300'"
              class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            <span class="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                :class="form.status ? 'translate-x-6' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
            />
          </Switch>
        </div>
      </SwitchGroup>

      <div class="flex space-x-2 mt-8">
        <!-- Кнопка отправки -->
        <div class="mb-4">
          <Button text="Добавить message" :isLoading="isLoadingAddBtn" color="emerald"/>
        </div>
      </div>
    </form>
  </div>
</template>