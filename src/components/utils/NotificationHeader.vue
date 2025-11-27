<script>
import { useNotificationsStore } from '@/stores/notifications';
import { onUnmounted, computed } from "vue";
import { BellIcon, InformationCircleIcon } from "@heroicons/vue/24/outline/index.js";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

export default {
  name: 'Notifications',
  components: { MenuItem, MenuItems, Menu, MenuButton, InformationCircleIcon, BellIcon },
  setup() {
    const notificationsStore = useNotificationsStore();

    // Подключение к двум WebSocket сразу
    notificationsStore.startWebSockets();

    // Отключение WebSocket при размонтировании компонента
    onUnmounted(() => {
      notificationsStore.stopWebSockets();
    });

    // Очистка всех уведомлений
    const clearAllNotifications = () => {
      notificationsStore.clearNotifications();
    };

    // Отдельные списки уведомлений по их типу
    const userNotifications = computed(() =>
        notificationsStore.notifications
            .filter(notification => notification.type === 'user')
            // .sort((a, b) => b.isNew - a.isNew) // Сначала новые уведомления
    );

    const broadcastNotifications = computed(() =>
        notificationsStore.notifications
            .filter(notification => notification.type === 'broadcast')
            // .sort((a, b) => b.isNew - a.isNew) // Сначала новые уведомления
    );

    // Количество непрочитанных уведомлений
    const unreadCount = computed(() => notificationsStore.unreadNotifications.length);

    // Проверка, является ли уведомление непрочитанным
    const isUnread = (notification) => {
      return notification.isNew; // Простая проверка нового уведомления
    };

    const markNotificationAsRead = (notification) => {
      setTimeout(() => {
        notificationsStore.markNotificationAsRead(notification.message); // Помечаем как прочитанное
      }, 700);
    };

    // Обработчик: сброс количества непрочитанных уведомлений
    const markNotificationsAsRead = () => {
      notificationsStore.markAllAsRead(); // Сброс состояния непрочитанных уведомлений
    };

    return {
      userNotifications,
      broadcastNotifications,
      unreadCount,
      isUnread,
      markNotificationAsRead,
      markNotificationsAsRead,
      clearAllNotifications
    };

  },
};
</script>

<template>
  <div>
    <Menu as="div" class="relative ml-3">
      <div>
        <!-- MenuButton с обработчиком нажатия -->
        <MenuButton
            class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
          <span class="sr-only">View notifications</span>
          <BellIcon class="size-6" aria-hidden="true" />
          <!-- Количество уведомлений -->
          <div
              v-if="unreadCount > 0"
              class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-1 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
            {{ unreadCount}}
          </div>
        </MenuButton>
      </div>
      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <MenuItems class="absolute right-0 z-10 max-w-md w-3xs outline-none mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          <ul role="list" class="divide-y divide-gray-100 max-h-80 overflow-y-scroll">
            <!-- Если уведомлений нет -->
            <li v-if="!userNotifications.length && !broadcastNotifications.length" class="p-3 text-center text-gray-500">
              Нет уведомлений
            </li>

            <!-- Пользовательские уведомления -->
            <template v-if="userNotifications.length">
              <p class="px-4 py-1 text-xs font-medium text-gray-700">Пользовательские уведомления</p>
              <MenuItem v-for="(notification, index) in userNotifications" :key="'user-' + index">
                <li class="flex justify-between gap-x-5 p-3"
                    :class="{ 'bg-blue-100': isUnread(notification) }"
                    @mouseover="markNotificationAsRead(notification)"
                >
                  <div class="flex gap-x-2">
                    <!-- Иконка зависит от m_type -->
                    <div :class="{
                      'text-blue-500': notification.m_type === 'info',
                      'text-red-500': notification.m_type === 'error',
                      'text-green-500': notification.m_type === 'success',
                      'text-gray-500': !['info', 'error', 'success'].includes(notification.m_type)
                    }">
                      <svg v-if="notification.m_type === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                      <svg v-else-if="notification.m_type === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <svg v-else-if="notification.m_type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                      </svg>
                    </div>

                    <!-- Текст уведомления -->
                    <div class="w-full ml-0 flex-auto">
                      <p class="break-words text-xs text-gray-500">{{ notification.message }}</p>
                    </div>
                  </div>
                </li>
              </MenuItem>
            </template>

            <!-- Общие уведомления -->
            <template v-if="broadcastNotifications.length">
              <p class="px-4 py-1 text-xs font-medium text-gray-700">Общие уведомления</p>
              <MenuItem v-for="(notification, index) in broadcastNotifications" :key="'broadcast-' + index">
                <li class="flex justify-between gap-x-5 p-3"
                    :class="{ 'bg-blue-100': isUnread(notification) }"
                    @mouseover="markNotificationAsRead(notification)"
                >
                  <div class="flex gap-x-2">
                    <!-- Иконка зависит от m_type -->
                    <div :class="{
                      'text-blue-500': notification.m_type === 'info',
                      'text-red-500': notification.m_type === 'error',
                      'text-green-500': notification.m_type === 'success',
                      'text-gray-500': !['info', 'error', 'success'].includes(notification.m_type)
                    }">
                      <svg v-if="notification.m_type === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                      <svg v-else-if="notification.m_type === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <svg v-else-if="notification.m_type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                      </svg>
                    </div>

                    <!-- Текст уведомления -->
                    <div class="w-full ml-0 flex-auto">
                      <p class="break-words text-xs text-gray-500">{{ notification.message }}</p>
                    </div>
                  </div>
                </li>
              </MenuItem>
            </template>
          </ul>

          <!-- Кнопка очистки всех уведомлений -->
          <div v-if="broadcastNotifications.length || userNotifications.length" class="border-t border-gray-200 px-3 py-1">
            <button
                @click.prevent="clearAllNotifications"
                class="w-full text-xs text-gray-700 hover:text-white rounded-md bg-gray-100 hover:bg-red-500 py-1 text-center font-light">
              Очистить все
            </button>
          </div>

        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<style>
/* Если нужно, стили можно оставить неизменными */
</style>