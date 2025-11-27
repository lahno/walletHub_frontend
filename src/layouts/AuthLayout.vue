<script>
import {ref} from "vue";
import axios from 'axios';
import HeaderAuth from "@/components/HeaderAuth.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import avatar from '@/assets/img/ava1.png';
import {useToastStore} from "@/stores/useToastStore.js";

const toastStore = useToastStore();

export default {
  components: {HeaderAuth, InfoDialog},
  data() {
    return {
      profile: { imageUrl: avatar },
      isDialogOpen: ref(false), // Контролируем открытие/закрытие диалога
      dialogData: ref({ title: "", text: "" }), // Данные для диалога
    };
  },
  methods: {
    showAuthErrorDialog() {
      this.msg = "Ошибка авторизации.";
      toastStore.showToast("Ошибка: вы не авторизованы.", false);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.dialogData = {
        title: "Ошибка авторизации",
        text: "Не удалось загрузить профиль. Пожалуйста, войдите заново.",
        text_btn: "Перейти к авторизации"
      };
      this.isDialogOpen = true;
    },
    closeAuthErrorDialog() {
      this.isDialogOpen = false;
      this.$router.push("/login"); // 🔥 Перенаправляем после закрытия
    },
  },
  async mounted() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Обновляем profile, но сохраняем imageUrl, если он не пришел с сервера
      this.profile = {
        ...response.data,
        imageUrl: response.data.imageUrl || this.profile.imageUrl, // если нет аватара, оставляем дефолтный
      };
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
          console.log("Ошибка без ответа от сервера");
          toastStore.showToast("Ошибка сети или нет ответа от сервера!", false);
        }
      } else {
        // Обработка других ошибок (например, непредвиденных JS-ошибок)
        console.error("Непредвиденная ошибка:", error);
        toastStore.showToast("Произошла ошибка!", false);
        this.msg = "Ошибка при получении данных профиля";
      }
    }
  },
};
</script>

<template>
  <div>

    <HeaderAuth v-if="profile" :profile="profile" />

    <!-- Диалоговое окно -->
    <InfoDialog v-if="isDialogOpen" :data_msg="dialogData" @close="closeAuthErrorDialog" />

    <router-view v-bind="{ profile }" />

  </div>
</template>