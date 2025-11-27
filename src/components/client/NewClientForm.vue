<script>
import Input from "@/components/forms/Input.vue";
import Select from "@/components/forms/Select.vue";
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
import Button from "@/components/forms/Button.vue";
import Loader from "@/components/utils/Loader.vue";
import TextArea from "@/components/forms/TextArea.vue";
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Loader, Input, TextArea, Select, Multiselect, TransitionChild,
    TransitionRoot,
    Dialog,
    DialogPanel,
    DialogTitle, Switch, SwitchGroup, SwitchLabel, Button },
  props: {
    onSubmit: { type: Function, required: true },
    errors: { type: Object, default: () => ({}) }, // Ошибки передаются через основной компонент
    isLoadingAddBtn: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
  },

  data() {
    return {
      form: {
        name: "",
        status: true,
        type: "",
      },
      client_type: [
        {
          value: "MODEL",
          key: "model",
        },
        {
          value: "MANAGER",
          key: "manager",
        },
        {
          value: "CUSTOM",
          key: "custom",
        }
      ],

      isOpen: false,
      isLoadingSaveBtn: false,
    };
  },
  methods: {
    async submitForm() {
      this.$emit("submit", { ...this.form}); // Отправляем данные формы вверх
    },
    clearFieldErrors(fieldName) {
      this.$emit("clear-errors", fieldName); // Очистка ошибок для конкретного поля
    },
    resetForm() {
      this.form = {
        name: "",
        status: true,
        type: "",
      }; // Сброс формы в начальное состояние
    },
    closeModal() {
      this.isOpen = false;
    }
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
                Добавить нового клиента
              </DialogTitle>
              <div class="mt-2">
                <!-- Лоадер -->
                <div v-if="isLoading" class="flex justify-center my-5">
                  <Loader :size="10" :mr="0" />
                </div>

                <form v-else @submit.prevent="submitForm" class="max-w-md mx-auto">
                  <!-- Text -->
                  <Input
                      v-model="form.name"
                      placeholder="Name"
                      :required="true"
                      :errors="errors['name']"
                      @clear-errors="clearFieldErrors('name')"
                  />

                  <!-- Select для типов -->
                  <Select
                      v-model="form.type"
                      :items="client_type"
                      placeholder="Тип"
                      :required="true"
                      :errors="errors['type']"
                      @clear-errors="clearFieldErrors('type')"
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
                        <span class="sr-only">Статус</span>
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
                      <Button text="Добавить" :isLoading="isLoadingAddBtn" color="emerald"/>
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