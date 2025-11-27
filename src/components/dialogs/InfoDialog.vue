<script>
import { ref, defineEmits } from "vue";
import { useToastStore } from "@/stores/useToastStore";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription, TransitionRoot, TransitionChild,
} from "@headlessui/vue";

const toastStore = useToastStore();

export default {
  components: {TransitionChild, TransitionRoot, Dialog, DialogPanel, DialogTitle, DialogDescription },
  props: {
    data_msg: Object,
  },
  setup(_, { emit }) {
    const isOpen = ref(true);

    function openModal() {
      isOpen.value = true
    }
    function closeModal() {
      isOpen.value = false
      emit("close"); // 🔥 Сообщаем, что диалог закрылся
    }

    function copyBtn(copy_text) {
      if (!copy_text) {
        console.error("copy_text отсутствует для копирования");
        return;
      }

      navigator.clipboard
          .writeText(copy_text)
          .then(() => {
            console.log("URL скопирован: ", copy_text);
            toastStore.showToast("Ссылка скопирована в буфер обмена!", true); // Уведомление при успешном копировании
          })
          .catch((error) => {
            console.error("Ошибка при копировании ссылки: ", error);
            toastStore.showToast("Не удалось скопировать ссылку.", false);
          });
    }

    return { isOpen, openModal, closeModal, copyBtn };
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
                {{data_msg['title']}}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm my-3 text-gray-500 dark:text-gray-300">
                  {{data_msg['text']}}
                </p>

                <!-- Поле для копируемого текста -->
                <div v-if="data_msg['copy_text']" class="flex items-center bg-gray-50 p-2 rounded-lg shadow-inner ring-1 ring-gray-300">
                  <span
                      class="flex-1 text-sm text-gray-800  dark:text-gray-300 truncate cursor-text select-all"
                      @click="$event.target.select();"
                  >
                    {{ data_msg['copy_text'] }}
                  </span>
                  <button
                      class="ml-2 px-4 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-400 text-sm font-medium focus:outline-none"
                      @click="copyBtn(data_msg['copy_text'])"
                  >
                    Скопировать
                  </button>
                </div>

              </div>

              <div class="mt-4 flex items-center justify-center">
                <a :href="data_msg['url']" v-if="data_msg['url']" target="_blank" class="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                  Перейти
                </a>
                <button
                    v-else
                    type="button"
                    class="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                >
                  {{data_msg['text_btn']}}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>