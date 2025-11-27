<script>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription, TransitionRoot, TransitionChild,
} from "@headlessui/vue";

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

    return { isOpen, openModal, closeModal };
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

      <div class="fixed inset-0 w-screen overflow-y-auto">
        <div
            class="flex min-h-full items-center justify-center p-4"
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

                <div v-html="data_msg['text']" class="text-sm text-gray-700 grid gap-y-2"></div>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>