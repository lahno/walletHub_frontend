<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon, SlashIcon, UserIcon } from "@heroicons/vue/24/outline";
import axios from "axios"; // Подключение Axios

// Навигационное меню
const navigation = [
  { name: "Home", href: "/" },
];

// Состояния
const mobileMenuOpen = ref(false);
const route = useRoute();
const isAuthenticated = ref(false); // Отслеживание состояния авторизации

// Новый метод для проверки профиля
const checkProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      isAuthenticated.value = false;
      return;
    }

    const response = await axios.get("/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  } catch (error) {
    console.error("Ошибка при проверке профиля: ", error);
    isAuthenticated.value = false; // Если произошла ошибка, считаем, что пользователь не авторизован
  }
};

// Метод для наблюдения за localStorage
window.addEventListener("storage", () => {
  isAuthenticated.value = !!localStorage.getItem("access_token");
});

// Загружаем профиль при монтировании компонента
onMounted(() => {
  checkProfile();
});
</script>

<template>
  <header class="inset-x-0 top-0 z-50 pb-10">
    <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <!-- Мобильное меню -->
      <div class="flex lg:hidden">
        <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>

      <!-- Навигация (Desktop) -->
      <div class="hidden lg:flex lg:gap-x-12 text-gray-900 dark:text-gray-300">
        <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="text-sm/6 font-semibold"
            :class="{ 'text-gray-400': route.path === item.href }"
        >
          {{ item.name }}
        </RouterLink>
      </div>

      <!-- Меню действий -->
      <div
          class="hidden lg:flex lg:flex-1 lg:justify-end text-gray-900 dark:text-gray-300"
          v-if="isAuthenticated"
      >
        <a href="/auth/dashboard" class="text-sm/6 font-semibold mx-2"
        >Account <UserIcon class="size-4 inline-flex" /></a
        >
      </div>
      <div
          class="hidden lg:flex lg:flex-1 lg:justify-end text-gray-900 dark:text-gray-300"
          v-else
      >
        <a
            href="/login"
            class="text-sm/6 font-semibold"
            :class="{ 'text-gray-400': route.name === 'login' }"
        >
          Log in
        </a>
        <SlashIcon class="size-6" />
        <a
            href="/register"
            class="text-sm/6 font-semibold"
            :class="{ 'text-gray-400': route.name === 'register' }"
        >
          Sign up
        </a>
      </div>
    </nav>

    <!-- Мобильное меню -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50" />
      <DialogPanel
          class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6 text-gray-900 dark:text-gray-300">
              <RouterLink
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50"
                  :class="{ 'text-gray-400': route.path === item.href }"
              >
                {{ item.name }}
              </RouterLink>
            </div>
            <div class="py-6" v-if="isAuthenticated">
              <a
                  href="/auth/dashboard"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50"
              >
                Account
              </a>
            </div>
            <div class="py-6" v-else>
              <a
                  href="/login"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50"
              >
                Log in
              </a>
              <a
                  href="/register"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-300 hover:bg-gray-50"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>