<script>
import { ref } from "vue";
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";

export default {
  components: {Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot},
  props: {
    target: {
      type: Object,
      required: true,
    },
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
                Удаление таргета ID: {{target.of_id}}
              </DialogTitle>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Вы действительно хотите удалить таргет <span class="font-bold">{{ target.username }}</span>?
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-center space-x-4">
                <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="confirmDelete"
                >
                  Удалить
                </button>
                <button
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    @click="closeModal"
                >
                  Отменить
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>