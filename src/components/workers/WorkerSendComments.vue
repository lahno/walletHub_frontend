<script>
import { initWebSocket, removeTaskForUser, shortenString } from "@/utils";
import { useToastStore } from "@/stores/useToastStore";
import axios from "axios";

const toastStore = useToastStore();

export default {
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      socket: null,
      message: "Waiting for task...",
      error_message: "",
      progress: 0,
      iteration: 0,
      success_iteration: 0,
      error_iteration: 0,
      stopped: false, // Маркер остановки задачи через кнопку
      isUnmounted: false,
      worker_logs: [],
      logsContainer: null,
    };
  },
  watch: {
    task(newVal) {
      if (!newVal && !this.isUnmounted) {
        console.warn("Получено некорректное значение task:", newVal);
      }
    }
  },
  methods: {
    shortenString,

    // Автоскрол вниз логов
    scrollToBottom() {
      // Проверяем, существует ли контейнер для логов
      if (this.logsContainer) {
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
      }
    },

    initializeWebSocket() {
      // Открываем WebSocket для задачи
      this.socket = initWebSocket(
          this.task.task_id,
          (task_data) => {
            // Обработка полученных данных задачи
            this.message = task_data?.message ? task_data.message.slice(0, 30)+"..." : "";
            this.progress = task_data?.progress ?? 0;
            this.iteration = task_data?.iteration ?? 0;
            this.success_iteration = task_data?.success_iteration ?? 0;
            this.error_iteration = task_data?.error_iteration ?? 0;

            // console.log("WebSocket task data:", task_data);
            this.worker_logs.push({
              message: task_data?.message || "",
              message_error: task_data?.message_error || "",
              data: task_data?.data || {},
            });
            // Оставляем в массиве только последние 1000 записей
            if (this.worker_logs.length > 1000) {
              this.worker_logs.shift(); // Удаляет первую запись
            }

            // ПРОКРУЧИВАЕМ ЛОГИ ВНИЗ
            this.$nextTick(() => {
              this.scrollToBottom();
            });


            // Когда прогресс прислал тип данных process_finished, считаем задачу завершённой
            if (task_data.type === 'process_finished') {
              this.worker_logs.push({
                message: "Задача завершена",
              });

              // Удаляем задачу из локального хранилища
              removeTaskForUser(this.task.user_id, this.task.task_id, this.task.name);

              // Закрываем WebSocket
              this.closeWebSocket();

              // Обновляем основное сообщение
              this.$emit("update:msg", `${this.task.name} выполнен!`);
            }

            // Когда прогресс вернул ошибку
            if (task_data.message_error.length > 0) {
              console.log("WebSocket task returned error.", task_data.message_error);
              this.error_message = task_data.message_error;
              toastStore.showToast(task_data.message_error, false, 20000);
              this.$emit("update:msg", `task ${this.task.name} error`);

              // Удаляем задачу из локального хранилища
              removeTaskForUser(this.task.user_id, this.task.task_id, this.task.name);

              // Закрываем WebSocket
              this.closeWebSocket();
            }
          },
          () => {
            // Закрытие WebSocket
            this.message = "Задача завершена";
            toastStore.showToast("WebSocket соединение закрыто.", true);

            // Включаем кнопку запуска
            this.$emit("update:btn", this.task.name);
          },
          (error) => {
            // Обработка ошибок WebSocket
            toastStore.showToast("Ошибка подключения WebSocket!", false, 15000);
            console.error("WebSocket ошибка:", error);
          }
      );
    },
    async stopTask() {
      // Закрываем WebSocket
      this.closeWebSocket();

      // this.$emit("update:remove", this.task.task_id);
      const result = await axios.get(`/websocket/stop-task/${this.task.task_id}/`);
      if (result.status === 200 && result.data.status === true) {
        toastStore.showToast(result.data.message, true);
        this.$emit("update:btn", this.task.name);
        this.stopped = true;
      } else {
        toastStore.showToast("Ошибка остановки задачи!", false, 15000);
      }
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
    // console.log("Компонент WorkerSendComments смонтирован с task:", this.task);

    // Получаем ссылку на контейнер логов
    this.logsContainer = this.$refs.logsContainer;

    if (!this.task || !this.task.task_id) {
      console.error("Невозможно инициализировать WebSocket без ID задачи!");
      return;
    }

    this.initializeWebSocket();
  },
  beforeUnmount() {
    this.isUnmounted = true;
    // console.log("Компонент WorkerSendComments размонтирован:", this.task?.task_id);
  },
};
</script>

<template>
  <div class="max-w-xl mx-auto p-6 mb-5 bg-white border border-gray-200 rounded-lg shadow">
    <!-- ID процесса -->
    <div class="text-sm text-gray-500 mb-2">
      ID процесса: <span class="font-bold text-gray-700">{{ shortenString(this.task.task_id) || "---" }}</span>
    </div>

    <!-- Краткое описание -->
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      {{ task?.name || "Name task not set" }}
    </h3>

    <!-- Полоска прогресса -->
    <div class="mb-4">
      <div class="grid grid-cols-1 content-start gap-2 items-center mb-1">
        <span class="text-sm font-medium text-gray-500">{{ progress }}% (<span class="text-xs font-medium italic text-gray-500">{{ message }}</span>)</span>
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

    <!-- Логи процесса -->
    <div class="mb-4">
      <div
          class="h-26 overflow-y-auto bg-gray-50 border rounded-md border-gray-300 p-2"
          ref="logsContainer"
      >
      <template v-if="worker_logs.length">
        <ul class="space-y-1">
          <li
              v-for="(log, index) in worker_logs"
              :key="index"
              class="text-xs text-gray-600"
          >
          <span v-if="log && (log.message || log.message_error)">
            [{{ index + 1 }}]: {{ log.message || log.message_error }}
          </span>
            <a v-if="log && log.data && log.data.target_url" :href="log.data.target_url" target="_blank" class="relative inline-flex ml-1 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </a>
            <a v-if="log && log.data && log.data.post_url" :href="log.data.post_url" target="_blank" class="relative inline-flex ml-1 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </a>
          </li>
        </ul>
      </template>

      <p v-else class="text-sm text-gray-400 italic">Логи отсутствуют</p>
    </div>
  </div>

    <!-- Сообщения об ошибке -->
    <div class="flex justify-center" v-if="error_message">
      <span class="text-xs font-medium text-red-600">Error: {{error_message}}</span>
    </div>

    <!-- Кнопка Стоп -->
    <button
        v-if="progress !== 100"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        @click="stopTask()"
        :disabled="stopped || progress === 100"
    >
      {{ stopped ? "Остановлено" : "Стоп" }}
    </button>
  </div>
</template>