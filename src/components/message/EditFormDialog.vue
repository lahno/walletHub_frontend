<script>
import { ref, reactive, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
  SwitchGroup,
  SwitchLabel,
  Switch,
} from "@headlessui/vue";
import Multiselect from "vue-multiselect";
import TextArea from "@/components/forms/TextArea.vue";
import Button from "@/components/forms/Button.vue";

export default {
  components: {
    TextArea,
    Multiselect,
    Button,
    TransitionChild,
    TransitionRoot,
    Dialog,
    DialogPanel,
    DialogTitle,
    Switch,
    SwitchGroup,
    SwitchLabel,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    accounts: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // Создаём локальный объект для редактирования
    const localMessage = reactive({
      id: props.message.id,
      text: props.message?.text || "",
      status: props.message?.status ?? true,
      accounts: props.message?.accounts_details
          ? props.message.accounts_details.filter(account => account.type === 'main').map(account => ({
            value: account.id,
            label: account.name,
          }))
          : [], // Инициализация для мультиселекта
    });

    const errors = reactive({
      text: [],
      accounts: [],
    });

    const isOpen = ref(true);
    const isLoadingSaveBtn = ref(false);

    // Опции аккаунтов для Multiselect
    const accountOptions = computed(() => {
      return props.accounts.filter(account => account.type === 'main').map(account => ({
        label: account.name, // Для отображения
        value: account.id,   // Уникальный ID
      }));
    });

    // Метод: Удалить ошибки из поля
    function clearFieldErrors(field) {
      errors[field] = [];
    }

    // Метод: Редактирование сообщения
    function editMessage() {
      if (!localMessage.text) {
        errors.text.push("Текст обязателен");
        return;
      }

      isLoadingSaveBtn.value = true;

      // Отправляем данные на родительский компонент
      emit("update-message", {
        ...localMessage,
        accounts: localMessage.accounts
            .filter(account => account && account.value) // Исключаем пустые элементы
            .map(account => account.value), // Данные преобразуются в массив ID
      });

      closeModal();
    }

    // Метод: Закрыть модальное окно
    function closeModal() {
      isOpen.value = false;
      emit("close");
      isLoadingSaveBtn.value = false;
    }

    return {
      isOpen,
      isLoadingSaveBtn,
      localMessage,
      errors,
      accountOptions,
      clearFieldErrors,
      editMessage,
      closeModal,
    };
  },
};
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
            class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
          >
            <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
              >
                Edit Message ID: {{ localMessage.id }}
              </DialogTitle>
              <div class="mt-2">
                <form class="max-w-md mx-auto">
                  <!-- Accounts (Multiselect) -->
                  <label class="block mb-4 text-sm font-light text-gray-700">
                    <span class="block text-gray-700">
                    Привязанные аккаунты
                    </span>
                    <Multiselect
                        v-model="localMessage.accounts"
                        :options="accountOptions"
                        :multiple="true"
                        :clear-on-select="false"
                        :close-on-select="true"
                        label="label"
                        track-by="value"
                        placeholder="Выберите аккаунты"
                        class="block mt-1"
                    />
                    <p v-if="errors['accounts'].length" class="text-red-500 text-xs mt-1">
                      {{ errors['accounts'][0] }}
                    </p>
                  </label>

                  <!-- Text -->
                  <TextArea
                      v-model="localMessage.text"
                      placeholder="Text"
                      :errors="errors['text']"
                      @clear-errors="clearFieldErrors('text')"
                  />

                  <!-- Status -->
                  <SwitchGroup>
                    <div class="flex items-center">
                      <SwitchLabel class="mr-4 text-sm font-light text-gray-700">Статус:</SwitchLabel>
                      <Switch
                          v-model="localMessage.status"
                          :class="localMessage.status ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            :class="localMessage.status ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                    </div>
                  </SwitchGroup>

                  <div class="flex space-x-2 mt-8 justify-center">
                    <!-- Кнопка отправки -->
                    <div class="mb-4">
                      <Button type="button" text="Сохранить изменения" :isLoading="isLoadingSaveBtn" :onClick="editMessage" color="emerald"/>
                    </div>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>