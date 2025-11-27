<script>
import axios from "axios";
import { useToastStore } from "@/stores/useToastStore";
import AddAccountForm from "@/components/account/AddAccountForm.vue";
import AccountList from "@/components/account/AccountList.vue";
import EditFormDialog from "@/components/account/EditFormDialog.vue";
import DeleteDialog from "@/components/account/DeleteDialog.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import TargetList from "@/components/target/TargetList.vue";
import {notAuthDialog} from "@/utils.js";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

const toastStore = useToastStore();

export default {
  components: {
    HeaderBlock,
    TargetList,
    AddAccountForm,
    AccountList,
    EditFormDialog,
    DeleteDialog,
    InfoDialog
  },
  data() {
    return {
      accounts: [], // Список аккаунтов
      account_types: [],

      isDialogOpen: false,
      dialogData: { title: "", text: "" },

      isModalOpen: false,
      selectedAccount: null,

      isDeleteModalOpen: false,
      accountToDelete: null,

      isLoadingAddBtn: false,
      isLoadingAccountsList: false,
      isLoadingAccountsType: false,
      isLoadingDeleteBtn: false,

      errors: {}
    };
  },
  created() {
    this.fetchAccounts(); // Загрузка списка аккаунтов
    this.fetchAccountTypes(); // Загрузка списка типов аккаунта
  },
  methods: {
    async fetchAccounts() {
      this.isLoadingAccountsList = true;
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
        this.isLoadingAccountsList = false;
      }
    },
    async fetchAccountTypes() {
      this.isLoadingAccountsType = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/account/account_type/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          this.account_types = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoadingAccountsType = false;
      }
    },

    editAccount(account) {
      this.selectedAccount = { ...account };
      this.isModalOpen = true;
    },

    async updateAccount(updatedAccount) {
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.put(`/account/${updatedAccount.id}/`, updatedAccount, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const index = this.accounts.findIndex(acc => acc.id === updatedAccount.id);
          if (index !== -1) {
            this.accounts[index] = response.data;
          }
          this.isModalOpen = false;
          toastStore.showToast("Аккаунт успешно обновлён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при обновлении аккаунта:", error);
        toastStore.showToast("Ошибка при обновлении аккаунта", false);
      } finally {

      }
    },

    deleteAccount(account) {
      this.accountToDelete = account;
      this.isDeleteModalOpen = true;
    },

    async confirmDelete() {
      this.isLoadingDeleteBtn = true;
      const accountId = this.accountToDelete.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.delete(`/account/${accountId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 204) {
          this.accounts = this.accounts.filter(account => account.id !== accountId);
          toastStore.showToast("Аккаунт успешно удалён!");
        }else if(response.status === 400){
          toastStore.showToast(response.data.error, response.data.success);
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
        toastStore.showToast("Ошибка при удалении аккаунта", false);
      } finally {
        this.accountToDelete = null;
        this.isDeleteModalOpen = false;
        this.isLoadingDeleteBtn = false;
      }
    },

    closeModalEditAccount() {
      this.isModalOpen = false;
      this.selectedAccount = null;
    },

    closeDialogAndRedirectToLogin() {
      this.isDialogOpen = false;
      // this.$router.push("/login");
      this.$nextTick(() => {
        this.$router.push("/login");
      });
    },
  }
};
</script>

<template>
  <div>
    <HeaderBlock title="Accounts" />

    <div class="mx-auto w-full">
      <div class="grid grid-cols-12 gap-x-3 gap-y-5">
        <!-- Список добавленных аккаунтов -->
        <div class="col-span-12 col-start-1 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12">
          <AccountList
              :accounts="accounts"
              :is-loading="isLoadingAccountsList"
              @edit-account="editAccount"
              @delete-account="deleteAccount"
          />
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования аккаунта -->
    <EditFormDialog
        v-if="isModalOpen"
        :account="selectedAccount"
        :types="account_types"
        @update-account="updateAccount"
        @close="closeModalEditAccount"
    />

    <!-- Модальное окно удаления -->
    <DeleteDialog
        v-if="isDeleteModalOpen"
        :account="accountToDelete"
        :is-loading="isLoadingDeleteBtn"
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