<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Toast from "@/components/dialogs/Toast.vue";
import axios from 'axios';

const route = useRoute();
const backend_version = ref('');

const fetchVersion = async () => {
  try {
    const response = await axios.get('/get-version/');
    if (response.data.status === 'ok') {
      backend_version.value = response.data.version ? `v.${response.data.version}` : `v.${response.data.hash.slice(0, 7)}`;
    } else {
      console.error('Ошибка при получении версии:', response.data.error);
    }
  } catch (error) {
    console.error('Ошибка при получении версии:', error);
    backend_version.value = '';
  }
};


// Получаем версию при монтировании компонента
onMounted(() => {
  fetchVersion();
});

const routesWithBackground = ['/login', '/register'];
</script>



<template>
  <div class="min-h-screen flex flex-col">

    <div v-if="routesWithBackground.includes(route.path)" class="absolute inset-x-0 -top-10 -z-40 transform-gpu overflow-hidden blur-3xl sm:-top-70" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#54ff98] to-[#ffaa54] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 74.1%)" />
    </div>

  <!-- Основной контент -->
    <main class="flex-grow">
      <div class="relative isolate px-6 lg:px-8 my-5">

        <RouterView />

      </div>
    </main>

    <footer class="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
      <div class="w-full mx-auto p-4 flex justify-between">
        <span class="text-sm font-light text-gray-400 sm:text-center dark:text-gray-400">
          © {{new Date().getFullYear()}} WalletHub™
        </span>
        <span class="text-xs font-light leading-5 text-gray-400 sm:text-center dark:text-gray-300">
          Developed by <a href="https://t.me/lakhno_d" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Solid</a> {{ backend_version }}
        </span>
      </div>
    </footer>

    <Toast />

  </div>
  <span class="after:ml-0.5 after:text-red-500 after:content-['*'] justify-end hidden text-gray-400"></span>
</template>