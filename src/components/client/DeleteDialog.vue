<script>
import { ref } from "vue";
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
import Button from "@/components/forms/Button.vue";

export default {
  components: {Button, Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot},
  props: {
    client: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["close", "confirm-delete"], // События закрытия и подтверждения
  setup(_, { emit }) {
    const isOpen = ref(true); // Управление состоянием модального окна

    function closeModal() {
      emit("close"); // Сообщаем родителю об закрытии модального окна
    }

    function confirmDelete() {
      emit("confirm-delete"); // Сообщаем родителю о подтверждении удаления
    }

    return { isOpen, closeModal, confirmDelete };
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
                Удаление клиента ID: {{client.id}}
              </DialogTitle>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Вы действительно хотите удалить клиента <span class="font-bold">{{ client.name }}</span>?
                  </p>
                  <p v-if="client.wallets.length" class="text-sm text-gray-500">
                    Также будут удалены кошельки: <span class="font-bold">{{ client.wallets.length }}</span>!
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-center space-x-4">
                <Button
                    :isLoading="isLoading"
                    :onClick="confirmDelete"
                    text="Удалить"
                    color="red"
                    position="center"
                />
                <Button
                    :onClick="closeModal"
                    text="Отменить"
                    position="center"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>