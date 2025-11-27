<script>
import Input from "@/components/forms/Input.vue";
import Button from "@/components/forms/Button.vue";
import WorkerFindTargets from "@/components/workers/WorkerFindTargets.vue";
import axios from "axios";
import {addTaskForUser, checkTaskStatus, notAuthDialog} from "@/utils.js";
import {useToastStore} from "@/stores/useToastStore.js";
import Loader from "@/components/utils/Loader.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import HeaderAuth from "@/components/HeaderAuth.vue";
import WorkerSendComments from "@/components/workers/WorkerSendComments.vue";

const toastStore = useToastStore();
const taskStateMap = {
  send_comments: "isSendingRun",
};

export default {
  components: {WorkerSendComments, HeaderAuth, InfoDialog, Loader, WorkerFindTargets, Input, Button},
  props: {
    messages: {
      type: Array,
      default: []
    },
    targets: {
      type: Array,
      default: []
    },
    accounts: {
      type: Array,
      default: []
    },
    isLoadingDataComments: {
      type: Boolean,
      default: false,
    },
    isLoadingDataTargets: {
      type: Boolean,
      default: false,
    },
    isLoadingDataAccounts: {
      type: Boolean,
    }
  },
  data() {
    return {
      task_workers: [],
      msg: "",
      task_name: "",
      isSendingRun: false,

      isDialogOpen: false, // Контролируем открытие/закрытие диалога
      dialogData: { title: "", text: "" }, // Данные для диалога
    }
  },
  methods: {
    closeAuthErrorDialog() {
      this.isDialogOpen = false;
      this.$nextTick(() => {
        this.$router.push("/login");
      });
    },

    updateMessage(newMsg) {
      this.msg = newMsg;
    },

    disabledBtn(task_name) {
      // Выбираем состояние на основе task_name
      const stateKey = taskStateMap[task_name];
      if (!stateKey) {
        console.error(`Не найдено соответствующее состояние для ${task_name}`);
        return;
      }

      this[stateKey] = true;
    },
    enabledBtn(task_name) {
      // Выбираем состояние на основе task_name
      const stateKey = taskStateMap[task_name];
      if (!stateKey) {
        console.error(`Не найдено соответствующее состояние для ${task_name}`);
        return;
      }

      this[stateKey] = false;
    },

    removeWorker(id) {
      // Удаление компонента из массива workers
      this.task_workers = this.task_workers.filter((worker) => worker.id !== id);
    },
    async startSendComment(task_name, endpoint) {
      if (this.messages.length === 0 || this.accounts.length === 0 || this.targets.length === 0) {
        toastStore.showToast("Недостаточно данных \nПроверьте сообщения, аккаунты и таргеты!", false, 10000);
        return false;
      }
      this.disabledBtn(task_name);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/websocket/task/sender/${endpoint}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user_id", response.data.user_id);

        // Добавляем новую задачу
        addTaskForUser(response.data.user_id, response.data.task_id, task_name);

        // Добавляем задачу в workers
        this.task_workers.push({
          id: response.data.task_id,
          task: {
            task_id: response.data.task_id,
            user_id: response.data.user_id,
            name: task_name,
          }
        });

        this.msg = `Выполняется задача ${task_name}`;
        toastStore.showToast(response.data.message, true, 10000);

      } catch (error) {
        // Проверяем, является ли ошибка AxiosError
        if (axios.isAxiosError(error)) {
          console.error("Ошибка при запуске задачи: ", error.response?.status || error.message);

          if (error.response) {
            // Если есть статус ошибки
            const errorStatus = error.response.status;

            if (errorStatus === 401) {
              notAuthDialog(this);
            } else {
              this.msg = `Произошла ошибка: ${errorStatus}`;
              toastStore.showToast(`Ошибка ${errorStatus}: запрос не выполнен.`, false);
            }
          } else {
            // Если ошибка без ответа (например, сервер не отвечает)
            console.log("Ошибка без ответа от сервера");
            toastStore.showToast("Ошибка сети или нет ответа от сервера!", false);
          }
        } else {
          // Обработка других ошибок (например, непредвиденных JS-ошибок)
          console.error("Непредвиденная ошибка:", error);
          toastStore.showToast("Произошла ошибка!", false);
          this.msg = "Ошибка при запуске задачи.";
        }
      }
    },
    async findActiveTasks(task_name) {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          // console.error("Не найден user_id!");
          return;
        }

        const ongoingTasks = await checkTaskStatus(userId, task_name);

        if (ongoingTasks.length > 0) {
          const validTasks = ongoingTasks.filter((taskId) => typeof taskId === 'string' || typeof taskId === 'number');

          this.task_workers = validTasks.map((taskId) => ({
            id: taskId,
            task: {
              task_id: taskId,
              user_id: userId,
              name: task_name,
            },
          }));

          this.msg = `Найдено ${validTasks.length} активных задач.`;
          this.disabledBtn(task_name);
        }
      } catch (error) {
        console.error("Ошибка при проверке активных задач:", error);
        toastStore.showToast("Ошибка при загрузке задач!", false);
        this.task_workers = [];
      }
    }
  },
  mounted() {
    // Запускаем проверку активных задач при монтировании
    this.findActiveTasks("send_comments");
  },

}
</script>

<template>
  <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 dark:text-gray-300">Рассылка комментариев</h2>

    <!-- Сообщение -->
    <div v-if="msg" class="mb-4 text-gray-700 dark:text-gray-300">
      {{ msg }}
    </div>

    <div class="flex justify-center items-center my-5" v-if="isLoadingDataComments || isLoadingDataTargets || isLoadingDataAccounts">
      <Loader :size="6"/>
    </div>

    <div v-else class="max-w-full mx-auto">

      <div class="max-w-full mx-auto mb-4">
        <ul class="list-none list-inside font-light text-md dark:text-gray-200">
          <li>Сообщений: <span class="font-bold" :class="messages.length <= 0 ?'text-red-500' : 'text-gray-700 dark:text-gray-300'">{{ messages.length }}</span></li>
          <li>Аккаунтов: <span class="font-bold" :class="accounts.length <= 0 ?'text-red-500' : 'text-gray-700 dark:text-gray-300'">{{accounts.length}}</span></li>
          <li>Таргетов: <span class="font-bold" :class="targets.length <= 0 ?'text-red-500' : 'text-gray-700 dark:text-gray-300'">{{targets.length}}</span></li>
        </ul>
      </div>

      <transition-group name="fade" tag="div">
        <WorkerSendComments
            v-for="(worker, index) in task_workers"
            :key="worker?.id || index"
            :task="worker.task"
            @update:msg="updateMessage"
            @update:btn="enabledBtn"
            @update:remove="removeWorker"
        />
      </transition-group>

      <Button
          text="Запуск"
          :onClick="() => startSendComment('send_comments', 'send_comment')"
          :disabled="isSendingRun"
          :isLoading="isSendingRun"
          class="mt-4" />

    </div>

    <!-- Диалоговое окно ошибки авторизации -->
    <InfoDialog v-if="isDialogOpen" :data_msg="dialogData" @close="closeAuthErrorDialog" />

  </div>
</template>

<style>
/* Стили для анимации */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: transform 0.8s ease;
}
</style>
