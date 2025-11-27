<script>
import { ref, toRefs, reactive } from "vue";
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
    target: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Создаем локальную копию объекта target
    const localTarget = reactive({ ...props.target });

    // Для хранения ошибок валидации
    const errors = reactive({
      username: [],
    });

    const isOpen = ref(true);

    function clearFieldErrors(field) {
      errors[field] = [];
    }

    function editTarget() {
      // Логика сохранения
      if (localTarget.username) {
        emit("update-account", localTarget); // Отправляем изменения в родительский компонент
        // closeModal(); // Закрываем модальное окно
      } else {
        // Добавление ошибок валидации
        if (!localTarget.username) {
          errors.username.push("Имя обязательно");
        }
      }
    }

    function openModal() {
      isOpen.value = true;
    }

    function closeModal() {
      isOpen.value = false;
      emit("close"); // Уведомляем родителя о закрытии модального окна
    }

    return {
      isOpen,
      openModal,
      closeModal,
      localTarget: localTarget,
      errors,
      clearFieldErrors,
      editTarget: editTarget,
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
                Edit target ID: {{ localTarget.id }}
              </DialogTitle>
              <div class="mt-2">
                <form @submit.prevent="editTarget" class="max-w-md mx-auto">
                  <!-- UserName -->
                  <Input
                      v-model="localTarget.username"
                      placeholder="Username"
                      :required="true"
                      :errors="errors['username']"
                      @clear-errors="clearFieldErrors('username')"
                  />

                  <div class="flex space-x-2 mt-8 justify-center">
                    <!-- Кнопка отправки -->
                    <div class="mb-4">
                      <Button text="Сохранить изменения" color="emerald"/>
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