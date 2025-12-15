<script>
import Button from "@/components/forms/Button.vue";
import WalletList from "@/components/wallet/WalletList.vue";
import DeleteDialog from "./DeleteDialog.vue";
import {TrashIcon, PlusIcon} from "@heroicons/vue/16/solid/index.js";
import axios from "axios";
import {notAuthDialog} from "@/utils.js";
import {useToastStore} from "@/stores/useToastStore.js";
import NewWalletForm from "@/components/wallet/NewWalletForm.vue";

const toastStore = useToastStore();

export default {
  components: {NewWalletForm, AddressList: WalletList, Button, DeleteDialog},
  props: {
    client: Object,
    isLoading: Boolean
  },
  emits: ["update-client-list"],
  data() {
    return {
      isDeleteModalOpen: false,
      isNewWalletModalOpen: false,
    }
  },
  methods: {
    TrashIcon, PlusIcon,

    async confirmDelete() {
      const clientId = this.client.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.delete(`/client/${clientId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 204) {
          this.$emit('update-client-list')
          toastStore.showToast("Клиент успешно удалён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при удалении client:", error);
        toastStore.showToast("Ошибка при удалении client", false);
      } finally {
        this.isDeleteModalOpen = false;
      }
    },

    async newWallet(newWalletData) {
      console.log(newWalletData);

      const clientId = this.client.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.post(`/wallet/`, newWalletData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 201) {
          this.$emit('update-client-list')
          console.log(response.data);
          toastStore.showToast("Новый кошелек создан");
          this.isNewWalletModalOpen = false;
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при new wallet:", error);
        toastStore.showToast("Ошибка при new wallet", false);
      } finally {
        this.isDeleteModalOpen = false;
      }
    }

  }
};
</script>

<template>
  <!-- component -->
  <li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
    <div class="flex w-full items-center justify-between space-x-6 p-6">
      <div class="flex-1 truncate">
        <div class="flex items-center space-x-3">
          <h3 class="truncate text-sm font-medium text-gray-900">{{client.name}}</h3>
        </div>
        <p class="mt-1 truncate text-sm text-gray-500">{{client.type}}</p>
      </div>
      <div class="flex-shrink-0">
        <div class="flex">
          <div class="flex items-center space-x-1">
            <Button :icon="PlusIcon" text="" size="sm" position="end" @click="isNewWalletModalOpen = true" />
            <Button :icon="TrashIcon" text="" color="red" size="sm" position="end" @click="isDeleteModalOpen = true" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="client.wallets.length" class="flex w-full items-center justify-between space-x-6 p-6">
      <AddressList :wallets="client.wallets" :is-loading="isLoading" @update-wallet-list="$emit('update-client-list')" />
    </div>

    <!-- Модальное окно удаления -->
    <NewWalletForm
        v-if="isNewWalletModalOpen"
        :client="client"
        @close="() => { isNewWalletModalOpen = false }"
        @new-wallet="newWallet"
    />

    <!-- Модальное окно удаления -->
    <DeleteDialog
        v-if="isDeleteModalOpen"
        :client="client"
        @close="() => { isDeleteModalOpen = false }"
        @confirm-delete="confirmDelete"
    />
  </li>
</template>