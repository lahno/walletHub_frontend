<script>
import axios from "axios";
import { useToastStore } from "@/stores/useToastStore";
import EditFormDialog from "@/components/message/EditFormDialog.vue";
import DeleteDialog from "@/components/message/DeleteDialog.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import AddMessageForm from "@/components/message/AddMessageForm.vue";
import MessageList from "@/components/message/MessageList.vue";
import {notAuthDialog} from "@/utils.js";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

const toastStore = useToastStore();

export default {
  components: {
    HeaderBlock,
    MessageList,
    AddMessageForm,
    EditFormDialog,
    DeleteDialog,
    InfoDialog
  },
  data() {
    return {
      messages: [],
      accounts: [],

      isDialogOpen: false,
      dialogData: { title: "", text: "" },

      isModalOpen: false,
      selectedMessage: null,

      isDeleteModalOpen: false,
      messageToDelete: null,

      isLoadingAddBtn: false,
      isLoadingMessagesList: false,

      errors: {}
    };
  },
  created() {
    this.fetchMessages();
    this.fetchAccounts();
  },
  methods: {
    async fetchMessages() {
      this.isLoadingMessagesList = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/message/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          this.messages = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoadingMessagesList = false;
      }
    },
    async fetchAccounts() {
      this.isLoadingMessagesList = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/account/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          this.accounts = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoadingMessagesList = false;
      }
    },

    async addMessage(newMessage) {
      this.isLoadingAddBtn = true;
      this.errors = {}; // Очищаем ошибки перед началом запроса
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.post("/message/", newMessage, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 201 && response.data) {
          toastStore.showToast("Message успешно добавлен!");
          await this.fetchMessages();

          // Сбрасываем форму через дочерний компонент
          this.$refs.addMessageForm.resetForm();
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при добавлении message:", error);
        // Сохраняем ошибки от сервера (например, 400)
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data; // Передаём ошибки обратно в форму
        } else {
          toastStore.showToast("Ошибка при добавлении message", false);
        }
      } finally {
        this.isLoadingAddBtn = false;
      }
    },

    editMessage(message) {
      this.selectedMessage = { ...message };
      this.isModalOpen = true;
    },

    async updateMessage(updatedMessage) {
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.put(`/message/${updatedMessage.id}/`, updatedMessage, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const index = this.messages.findIndex(acc => acc.id === updatedMessage.id);
          if (index !== -1) {
            this.messages[index] = response.data;
          }
          this.isModalOpen = false;
          toastStore.showToast("Message успешно обновлён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при обновлении message:", error);
        toastStore.showToast("Ошибка при обновлении message", false);
      } finally {

      }
    },

    deleteMessage(message) {
      this.messageToDelete = message;
      this.isDeleteModalOpen = true;
    },

    async confirmDelete() {
      const messageId = this.messageToDelete.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.delete(`/message/${messageId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 204) {
          this.messages = this.messages.filter(message => message.id !== messageId);
          toastStore.showToast("Аккаунт успешно удалён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при удалении message:", error);
        toastStore.showToast("Ошибка при удалении message", false);
      } finally {
        this.messageToDelete = null;
        this.isDeleteModalOpen = false;
      }
    },

    closeModalEditMessage() {
      this.isModalOpen = false;
      this.selectedMessage = null;
    },

    closeDialogAndRedirectToLogin() {
      this.isDialogOpen = false;
      this.$nextTick(() => {
        this.$router.push("/login");
      });
    },
  }
};
</script>

<template>
  <div>
    <HeaderBlock title="Messages" />

    <div class="mx-auto w-full">
      <div class="grid grid-cols-12 gap-x-3 gap-y-5">
        <!-- Форма добавления аккаунта -->
        <div class="col-span-12 col-start-1 sm:col-span-12 md:col-span-5 lg:col-span-5 xl:col-span-4 2xl:col-span-3">
          <AddMessageForm
              ref="addMessageForm"
              :prop-accounts="accounts"
              :onSubmit="addMessage"
              :errors="errors"
              :is-loading-add-btn="isLoadingAddBtn"
              @clear-errors="fieldName => { errors[fieldName] = []; }"
          />
        </div>

        <!-- Список добавленных аккаунтов -->
        <div class="col-span-12 col-start-1 sm:col-span-12 md:col-span-7 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
          <MessageList
              :messages="messages"
              :is-loading="isLoadingMessagesList"
              @edit-message="editMessage"
              @delete-message="deleteMessage"
          />
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования message -->
    <EditFormDialog
        v-if="isModalOpen"
        :message="selectedMessage"
        :accounts="accounts"
        @update-message="updateMessage"
        @close="closeModalEditMessage"
    />

    <!-- Модальное окно удаления -->
    <DeleteDialog
        v-if="isDeleteModalOpen"
        :message="messageToDelete"
        @close="() => { isDeleteModalOpen = false }"
        @confirm-delete="confirmDelete"
    />

    <!-- Диалоговое окно -->
    <InfoDialog
        v-if="isDialogOpen"
        :data_msg="dialogData"
        @close="closeDialogAndRedirectToLogin"
    />
  </div>
</template>