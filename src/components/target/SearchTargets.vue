<script>
import Input from "@/components/forms/Input.vue";
import Button from "@/components/forms/Button.vue";
import WorkerFindTargets from "@/components/workers/WorkerFindTargets.vue";
import axios from "axios";
import {addTaskForUser, checkTaskStatus} from "@/utils.js";
import {useToastStore} from "@/stores/useToastStore.js";
import Loader from "@/components/utils/Loader.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import HeaderAuth from "@/components/HeaderAuth.vue";

const toastStore = useToastStore();
const taskStateMap = {
  find_recommends_target: "isFindingRecommends",
  find_friends_target: "isFindingFriends",
  find_random_target: "isFindingRandom"
};

export default {
  components: {HeaderAuth, InfoDialog, Loader, WorkerFindTargets, Input, Button},
  props: {
    targets: {
      type: Array,
      default: []
    },
    isLoadingDataTargets: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      task_workers: [],
      msg: "",
      task_name: "",
      isFindingRecommends: false,
      isFindingFriends: false,
      isFindingRandom: false,
      isDialogOpen: false, // Контролируем открытие/закрытие диалога
      dialogData: { title: "", text: "" }, // Данные для диалога
    }
  },
  methods: {
    showAuthErrorDialog() {
      this.msg = "Ошибка авторизации.";
      toastStore.showToast("Ошибка: вы не авторизованы.", false);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.dialogData = {
        title: "Ошибка авторизации",
        text: "Не удалось отправить запрос. Пожалуйста, войдите заново.",
        text_btn: "Перейти к авторизации"
      };
      this.isDialogOpen = true;
    },
    closeAuthErrorDialog() {
      this.isDialogOpen = false;
      this.$router.push("/login"); // 🔥 Перенаправляем после закрытия
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
    async startFindTarget(task_name, endpoint) {
      this.disabledBtn(task_name);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/websocket/task/target/${endpoint}/`, {
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
              this.showAuthErrorDialog();
            } else {
              this.msg = `Произошла ошибка: ${errorStatus}`;
              toastStore.showToast(`Ошибка ${errorStatus}: запрос не выполнен.`, false);
            }
          } else {
            // Если ошибка без ответа (например, сервер не отвечает)
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
          console.error("Не найден user_id!");
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
    this.findActiveTasks("find_recommends_target");
    this.findActiveTasks("find_friends_target");
    this.findActiveTasks("find_random_target");
  },

}
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 dark:text-gray-300">Поиск таргетов</h2>

    <!-- Сообщение -->
    <div v-if="msg" class="mb-4 text-gray-700 dark:text-gray-300">
      {{ msg }}
    </div>

    <div class="w-full mx-auto">


      <div class="flex justify-center items-center my-5" v-if="isLoadingDataTargets">
        <Loader :size="6"/>
      </div>

      <div v-else class="max-w-full mx-auto mb-4">
        <ul class="list-none list-inside font-light text-md dark:text-gray-200">
          <li>Таргетов: <span class="font-bold text-gray-700 dark:text-gray-300">{{ targets.length }}</span></li>
        </ul>
      </div>

      <transition-group name="fade" tag="div">
        <WorkerFindTargets
            v-for="(worker, index) in task_workers"
            :key="worker?.id || index"
            :task="worker.task"
            @update:msg="updateMessage"
            @update:btn="enabledBtn"
            @update:remove="removeWorker"
            @update:targets="$emit('update:targets')"
        />
      </transition-group>
      <div class="grid grid-flow-row auto-rows-max md:auto-rows-min mt-5">
        <div class="space-y-2 space-x-2">
          <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-slate-500 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              @click="startFindTarget('find_recommends_target', 'find_recommend')"
              :disabled="isFindingRecommends">
            <span class="inline-flex items-center">
              <!-- Если isFindingRecommends = true, показываем лоадер -->
              <svg
                  v-if="isFindingRecommends"
                  aria-hidden="true"
                  role="status"
                  class="inline animate-spin text-green-500 size-4 mr-1"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              Рекомендации
            </span>
          </button>
          <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-slate-500 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              @click="startFindTarget('find_friends_target', 'find_friend')"
              :disabled="isFindingFriends">
            <span class="inline-flex items-center">
              <!-- Если isFindingFriends = true, показываем лоадер -->
              <svg
                  v-if="isFindingFriends"
                  aria-hidden="true"
                  role="status"
                  class="inline animate-spin text-green-500 size-4 mr-1"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              Друзья
            </span>
          </button>
<!--          <button-->
<!--              type="button"-->
<!--              class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-slate-500 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"-->
<!--              @click="startFindTarget('find_random_target', 'find_random')"-->
<!--              :disabled="isFindingRandom">-->
<!--            <span class="inline-flex items-center">-->
<!--              &lt;!&ndash; Если isFindingRandom = true, показываем лоадер &ndash;&gt;-->
<!--              <Loader v-if="isFindingRandom" :size="4" :mr="1" />-->

<!--              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-1">-->
<!--                <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" />-->
<!--              </svg>-->
<!--              Рандомные-->
<!--            </span>-->
<!--          </button>-->
        </div>
      </div>

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
