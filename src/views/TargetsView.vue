<script>
import axios from "axios";
import { useToastStore } from "@/stores/useToastStore";
import AddTargetForm from "@/components/target/AddTargetForm.vue";
import TargetList from "@/components/target/TargetList.vue";
import EditFormDialog from "@/components/target/EditFormDialog.vue";
import DeleteDialog from "@/components/target/DeleteDialog.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import SearchTargets from "@/components/target/SearchTargets.vue";
import {notAuthDialog} from "@/utils.js";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

const toastStore = useToastStore();

export default {
  components: {
    HeaderBlock,
    SearchTargets,
    AddTargetForm,
    TargetList,
    EditFormDialog,
    DeleteDialog,
    InfoDialog
  },
  data() {
    return {
      targets: [], // Список таргетов

      isDialogOpen: false,
      dialogData: { title: "", text: "" },

      isModalOpen: false,
      selectedTarget: null,

      isDeleteModalOpen: false,
      targetToDelete: null,

      isLoadingAddBtn: false,

      isLoadingTargetsList: true,

      errors: {}
    };
  },
  created() {
    this.fetchTargets(); // Загрузка списка таргетов при инициализации компонента
  },
  methods: {
    async fetchTargets() {
      this.isLoadingTargetsList = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/target/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          this.targets = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoadingTargetsList = false;
      }
    },

    async checkTarget(target) {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`/of/target/${target.username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200 && response.data) {
          return response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        } else if (response.status === 404) {
          toastStore.showToast("Таргет не найден в системе", false);
        }
      } catch (error) {
        toastStore.showToast("Ошибка при получении данных таргета", false);
      }
    },

    async addTarget(newTarget) {
      this.isLoadingAddBtn = true;
      this.errors = {}; // Очищаем ошибки перед началом запроса
      const token = localStorage.getItem("access_token");

      try {
        const check_target = await this.checkTarget(newTarget);
        if (check_target && check_target.success) {
          newTarget.of_id = check_target.data.id;

          const response = await axios.post("/target/", newTarget, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 201 && response.data) {
            // Добавляем новый аккаунт в список
            this.targets.unshift({
              ...newTarget,
              id: response.data.id,
              created_at: response.data.created_at || new Date().toISOString()
            });
            toastStore.showToast("Таргет успешно добавлен!");

            // Сбрасываем форму через дочерний компонент
            this.$refs.addTargetForm.resetForm();
          } else if(response.status === 401){
            notAuthDialog(this);
          }
        }
      } catch (error) {
        toastStore.showToast("Ошибка при добавлении таргета", false);
        console.error("Ошибка при добавлении таргета:", error);

        if (error.response && error.response.status === 400) {
          this.errors = error.response.data;
        }
      } finally {
        this.isLoadingAddBtn = false;
      }
    },

    editTarget(account) {
      this.selectedTarget = { ...account };
      this.isModalOpen = true;
    },

    async updateTarget(updatedTarget) {
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.put(`/target/${updatedTarget.id}/`, updatedTarget, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const index = this.targets.findIndex(acc => acc.id === updatedTarget.id);
          if (index !== -1) {
            this.targets[index] = response.data;
          }
          this.isModalOpen = false;
          toastStore.showToast("Таргет успешно обновлён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при обновлении таргета:", error);
        toastStore.showToast("Ошибка при обновлении таргета", false);
      } finally {

      }
    },

    deleteTarget(account) {
      this.targetToDelete = account;
      this.isDeleteModalOpen = true;
    },

    async confirmDelete() {
      const targetId = this.targetToDelete.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.delete(`/target/${targetId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 204) {
          this.targets = this.targets.filter(target => target.id !== targetId);
          toastStore.showToast("Таргет успешно удалён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при удалении таргета:", error);
        toastStore.showToast("Ошибка при удалении таргета", false);
      } finally {
        this.targetToDelete = null;
        this.isDeleteModalOpen = false;
      }
    },

    closeModalEditTarget() {
      this.isModalOpen = false;
      this.selectedTarget = null;
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
    <HeaderBlock title="Targets" />

    <div class="mx-auto w-full">
      <div class="grid grid-cols-12 gap-x-3 gap-y-5">
        <!-- Форма добавления аккаунта -->
        <div class="col-span-12 col-start-1 sm:col-span-12 md:col-span-5 lg:col-span-5 xl:col-span-4 2xl:col-span-3">
          <AddTargetForm
              ref="addTargetForm"
              :onSubmit="addTarget"
              :errors="errors"
              :is-loading-add-btn="isLoadingAddBtn"
              @clear-errors="fieldName => { errors[fieldName] = []; }"
          />
          <SearchTargets :targets="targets":isLoadingDataTargets="isLoadingTargetsList" @update:targets="fetchTargets" />
        </div>

        <!-- Список добавленных аккаунтов -->
        <div class="col-span-12 col-start-1 sm:col-span-12 md:col-span-7 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
          <TargetList
              :targets="targets"
              :is-loading="isLoadingTargetsList"
              @edit-target="editTarget"
              @delete-target="deleteTarget"
          />
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования аккаунта -->
    <EditFormDialog
        v-if="isModalOpen"
        :target="selectedTarget"
        @update-target="updateTarget"
        @close="closeModalEditTarget"
    />

    <!-- Модальное окно удаления -->
    <DeleteDialog
        v-if="isDeleteModalOpen"
        :target="targetToDelete"
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