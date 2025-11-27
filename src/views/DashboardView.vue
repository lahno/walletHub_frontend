<script>
import SendComments from "@/components/sender/SendComments.vue";
import SearchTargets from "@/components/target/SearchTargets.vue";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";
import DataFetcher from "@/components/fetcher/DataFetcher.vue";
import CheckStatus from "@/components/account/CheckStatus.vue";
import axios from "axios";
import {notAuthDialog} from "@/utils.js";
import Notifications from "@/components/utils/NotificationHeader.vue";
import ClientList from "@/components/client/ClientList.vue";
import NewClientForm from "@/components/client/NewClientForm.vue";
import {useToastStore} from "@/stores/useToastStore.js";

const toastStore = useToastStore();

export default {
  components: {AddClientForm: NewClientForm, CheckStatus, Notifications, HeaderBlock, SearchTargets, SendComments, DataFetcher, ClientList},
  props: {
    profile: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      clients: [],

      errors: {},

      isLoadingData: false,
      isLoadingAddBtn: false,
    };
  },
  methods: {
    async fetchClients() {
      this.isLoadingData = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/client/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          // Фильтруем сообщения с положительным статусом
          this.clients = response.data.filter(message => message.status === true);
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoadingData = false;
      }
    },

    async openFormAddClient() {
      this.$refs.addClientForm.isOpen = true;
    },

    async addClient(newClient) {
      this.isLoadingAddBtn = true;
      this.errors = {}; // Очищаем ошибки перед началом запроса
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.post("/client/", newClient, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 201 && response.data) {
          toastStore.showToast("Client успешно добавлен!");
          await this.fetchClients();

          // Сбрасываем форму через дочерний компонент
          this.$refs.addClientForm.resetForm();

          // Закрываем модальное окно
          this.$refs.addClientForm.isOpen = false;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при добавлении client:", error);
        // Сохраняем ошибки от сервера (например, 400)
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data; // Передаём ошибки обратно в форму
        } else {
          toastStore.showToast("Ошибка при добавлении client", false);
        }
      } finally {
        this.isLoadingAddBtn = false;
      }
    },

  },
  mounted() {
    this.fetchClients()
  },
};
</script>

<template>
  <div>
    <HeaderBlock title="Clients" :open-form-add-client="openFormAddClient" />

    <div class="mx-auto w-full">
      <div class="grid">

        <AddClientForm
            ref="addClientForm"
            :onSubmit="addClient"
            :errors="errors"
            :is-loading-add-btn="isLoadingAddBtn"
            @clear-errors="fieldName => { errors[fieldName] = []; }"
        />

        <ClientList v-if="clients.length" :clients="clients" @update-client-list="fetchClients" />

      </div>
    </div>

  </div>
</template>
