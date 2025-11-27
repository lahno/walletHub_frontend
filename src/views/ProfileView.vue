<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useToastStore } from '@/stores/useToastStore';
import WorkerOne from "@/components/workers/WorkerOne.vue";
import { checkTaskStatus} from "@/utils.js";
import {ref} from "vue";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

const toastStore = useToastStore();
const task_name = ref("test_task");

export default {
  components: {HeaderBlock, Menu, MenuItem, MenuItems, MenuButton, useToastStore, WorkerOne },
  props: {
    profile: Object,
  },
  data() {
    return {
      message: "Ожидание обновлений...", // Отображаемое сообщение
      userNavigation: [
        { name: "Edit", href: "/auth/profile" },
        { name: "Delete", href: "/auth/settings", cls: "text-red-600" },
      ],
      workers: [], // Список задач (WorkerOne)
    };
  },
  watch: {
    profile: {
      immediate: false, // Не запускать при монтировании компонента
      async handler(newProfile) {
        if (newProfile?.id) {
          console.log("Проверка активных задач...");

          try {
            // Проверяем активные задачи конкретного пользователя
            const ongoingTasks = await checkTaskStatus(newProfile.id, task_name);

            if (ongoingTasks.length > 0) {
              // Добавляем задачи к списку workers
              this.workers = ongoingTasks.map(taskId => ({
                id: taskId, // Уникальный ID для Vue
                task: {
                  task_id: taskId,
                  user_id: newProfile.id,
                  name: task_name,
                },
              }));
              this.message = `Найдено ${ongoingTasks.length} активных задач.`;
            } else {
              this.message = "Все задачи завершены.";
            }
          } catch (error) {
            console.error("Ошибка при проверке активных задач:", error);
            toastStore.showToast("Ошибка при загрузке задач!", false);
          }
        }
      },
    },
  },
  methods: {

  },
};
</script>

<template>
  <div>
    <HeaderBlock title="Profile" />

    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-end px-4 pt-4 relative">
            <Menu>
              <div>
                <MenuButton class="inline-block outline-none text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm p-1.5">
                  <span class="sr-only">Open dropdown</span>
                  <svg
                      class="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                  >
                    <path
                        d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                    />
                  </svg>
                </MenuButton>
              </div>
              <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute top-1 right-3 z-10 mt-2 w-auto origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                  <MenuItem
                      v-for="item in userNavigation"
                      :key="item.name"
                      v-slot="{ active }"
                  >
                    <a
                        :href="item.href"
                        @click="item.click_fn"
                        :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700 '+item.cls]"
                    >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div class="flex flex-col items-center pb-10">
            <label
                for="dropzone-file"
                class="relative inline-block w-24 h-24 mb-3 group hover:cursor-pointer"
            >
              <img
                  class="inline-block rounded-full shadow-lg"
                  :src="profile.imageUrl"
                  :alt="profile.username"
              />
            </label>

            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {{ profile.username }}
            </h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ profile.email }}</span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>