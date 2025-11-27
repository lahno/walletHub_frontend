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
    client: Object,
    errors: { type: Object, default: () => ({}) }, // Ошибки передаются через основной компонент
    isLoadingAddBtn: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
  },
  emits: ["new-wallet"],

  data() {
    return {
      form: {
        client: this.client.id,
        type: ""
      },
      wallet_type: [
        {
          value: "ETH",
          key: "ethereum",
        },
        {
          value: "TRX",
          key: "tron",
        },
        {
          value: "BTC",
          key: "bitcoin",
        }
      ],

      isOpen: true,
      isLoadingSaveBtn: false,
    };
  },
  methods: {
    async submitForm() {
      this.$emit("new-wallet", { ...this.form}); // Отправляем данные формы вверх
    },
    clearFieldErrors(fieldName) {
      this.$emit("clear-errors", fieldName); // Очистка ошибок для конкретного поля
    },
    resetForm() {
      this.form = {
        client: this.client,
        type: ""
      }; // Сброс формы в начальное состояние
    },
    closeModal() {
      this.isOpen = false;
      this.resetForm();
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
                Новый кошелек {{client.name}}
              </DialogTitle>
              <div class="mt-2">
                <!-- Лоадер -->
                <div v-if="isLoading" class="flex justify-center my-5">
                  <Loader :size="10" :mr="0" />
                </div>

                <form v-else @submit.prevent="submitForm" class="max-w-md mx-auto">

                  <div class="w-full mb-10">
                    <!-- Select для типов -->
                    <Select
                        v-model="form.type"
                        :items="wallet_type"
                        placeholder="Тип"
                        :required="true"
                        :errors="errors['type']"
                        @clear-errors="clearFieldErrors('type')"
                    />
                    <p class="mt-1 text-xs/3 text-gray-500">Укажите необходимую сеть</p>
                  </div>

                  <div class="w-full mt-8">
                    <Button text="Создать" :isLoading="isLoadingAddBtn" color="emerald" position="center" />
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