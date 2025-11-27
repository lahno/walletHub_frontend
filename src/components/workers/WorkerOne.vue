<script>
import { initWebSocket, removeTaskForUser } from "@/utils";
import { useToastStore } from "@/stores/useToastStore";

const toastStore = useToastStore();

export default {
  props: {
    task: Object,
  },
  data() {
    return {
      socket: null,
      message: "Waiting for task...",
      progress: 0,
      iteration: 0,
      success_iteration: 0,
      error_iteration: 0,
      stopped: false, // Маркер остановки задачи через кнопку
    };
  },
  methods: {
    initializeWebSocket() {
      // Открываем WebSocket для задачи
      this.socket = initWebSocket(
          this.task.task_id,
          (task) => {
            // Обработка полученных данных задачи
            this.message = task?.message ?? "";
            this.progress = task?.progress ?? 0;
            this.iteration = task?.iteration ?? 0;
            this.success_iteration = task?.success_iteration ?? 0;
            this.error_iteration = task?.error_iteration ?? 0;

            // Когда прогресс достигает 100%, считаем задачу завершённой
            if (task.progress === 100) {
              console.log("WebSocket task finished.");

              // Удаляем задачу из локального хранилища
              removeTaskForUser(this.task.user_id, this.task.task_id, this.task.name);

              // Закрываем WebSocket
              this.closeWebSocket();
            }
          },
          () => {
            // Закрытие WebSocket
            this.message = "WebSocket соединение закрыто.";
            toastStore.showToast("WebSocket соединение закрыто.", true);
          },
          (error) => {
            // Обработка ошибок WebSocket
            toastStore.showToast("Ошибка подключения WebSocket!", false);
            console.error("WebSocket ошибка:", error);
          }
      );
    },
    closeWebSocket() {
      // Безопасное закрытие WebSocket
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      // Маркер остановки задачи
      this.stopped = true;
    },
  },
  mounted() {
    // При монтировании инициализируем WebSocket
    if (!this.task || !this.task.task_id) {
      console.error("Невозможно инициализировать WebSocket без ID задачи!");
      return;
    }

    this.initializeWebSocket();
  },
  beforeUnmount() {
    // При размонтировании закрываем WebSocket
    this.closeWebSocket();
  },
};
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
    <!-- ID процесса -->
    <div class="text-sm text-gray-500 mb-2">
      ID процесса: <span class="font-bold text-gray-700">{{ this.task.task_id || "---" }}</span>
    </div>

    <!-- Краткое описание -->
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      {{ task?.name || "Name task not set" }}
    </h3>

    <!-- Полоска прогресса -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium text-gray-500">{{ message }}: {{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div class="bg-green-500 h-3 rounded-full" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Значения -->
    <div class="grid grid-cols-3 gap-4 text-center mb-4">
      <div>
        <span class="block text-xl font-bold text-gray-800">{{ iteration }}</span>
        <span class="text-sm text-gray-500">Итерации</span>
      </div>
      <div>
        <span class="block text-xl font-bold text-green-600">{{ success_iteration }}</span>
        <span class="text-sm text-gray-500">Успехи</span>
      </div>
      <div>
        <span class="block text-xl font-bold text-red-600">{{ error_iteration }}</span>
        <span class="text-sm text-gray-500">Ошибки</span>
      </div>
    </div>

    <!-- Кнопка Стоп -->
    <button
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="closeWebSocket"
        :disabled="stopped || progress === 100"
    >
      {{ stopped ? "Остановлено" : "Стоп" }}
    </button>
  </div>
</template>