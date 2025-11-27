<script>
import { ref, reactive } from "vue";
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
import Select from "@/components/forms/Select.vue";
import Input from "@/components/forms/Input.vue";
import Button from "@/components/forms/Button.vue";

export default {
  components: {
    Switch,
    SwitchLabel,
    SwitchGroup,
    Button,
    Input,
    Select,
    TransitionChild,
    TransitionRoot,
    Dialog,
    DialogPanel,
    DialogTitle,
  },
  props: {
    account: {
      type: Object,
      required: true, // Ожидаем объект account из родителя
    },
    types: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Создаем локальную копию объекта account
    const localAccount = reactive({ ...props.account });

    // Для хранения ошибок валидации
    const errors = reactive({
      email: [],
      name: [],
      username: [],
      type: [],
    });

    const isOpen = ref(true);
    const isLoadingSaveBtn = ref(false);

    function clearFieldErrors(field) {
      errors[field] = [];
    }

    function editAccount() {
      // Логика сохранения
      if (localAccount.name && localAccount.username && localAccount.type) {
        isLoadingSaveBtn.value = true;
        emit("update-account", localAccount); // Отправляем изменения в родительский компонент
        // closeModal(); // Закрываем модальное окно
      } else {
        isLoadingSaveBtn.value = false;
        // Добавление ошибок валидации
        if (!localAccount.email) {
          errors.email.push("Email обязателен");
        }
        if (!localAccount.name) {
          errors.name.push("Имя обязательно");
        }
        if (!localAccount.username) {
          errors.name.push("Username обязательно");
        }
        if (!localAccount.type) {
          errors.type.push("Тип обязателен");
        }
      }
    }

    function openModal() {
      isOpen.value = true;
    }

    function closeModal() {
      isOpen.value = false;
      emit("close"); // Уведомляем родителя о закрытии модального окна
      isLoadingSaveBtn.value = false;
    }

    return {
      isOpen,
      isLoadingSaveBtn,
      openModal,
      closeModal,
      localAccount,
      errors,
      clearFieldErrors,
      editAccount,
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
                Edit account ID: {{localAccount.id}}
              </DialogTitle>
              <div class="mt-2">
                <form @submit.prevent="editAccount" class="max-w-md mx-auto">
                  <!-- Email -->
                  <Input
                      v-if="localAccount.email"
                      v-model="localAccount.email"
                      placeholder="Email"
                      :disabled="true"
                      :errors="errors['email']"
                      @clear-errors="clearFieldErrors('email')"
                  />

                  <!-- Name -->
                  <Input
                      v-model="localAccount.name"
                      placeholder="Имя"
                      :disabled="true"
                      :errors="errors['name']"
                      @clear-errors="clearFieldErrors('name')"
                  />

                  <!-- UserName -->
                  <Input
                      v-model="localAccount.username"
                      placeholder="Username"
                      :disabled="true"
                      :errors="errors['username']"
                      @clear-errors="clearFieldErrors('username')"
                  />

                  <!-- Type -->
                  <Select
                      v-model="localAccount.type"
                      :items="types"
                      placeholder="Тип"
                      :required="true"
                      :errors="errors['type']"
                      @clear-errors="clearFieldErrors('type')"
                  />

                  <!-- Status -->
                  <SwitchGroup>
                    <div class="flex items-center">
                      <SwitchLabel class="mr-4 text-sm font-light text-gray-700">Статус:</SwitchLabel>
                      <Switch
                          v-model="localAccount.status"
                          :class="localAccount.status ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            :class="localAccount.status ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                    </div>
                  </SwitchGroup>

                  <div class="flex space-x-2 mt-8 justify-center">
                    <!-- Кнопка отправки -->
                    <div class="mb-4">
                      <Button text="Сохранить изменения" type="button" color="emerald" :isLoading="isLoadingSaveBtn" :onClick="editAccount"/>
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