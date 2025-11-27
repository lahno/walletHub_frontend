<script>
import AddTargetForm from "@/components/target/AddTargetForm.vue";
import TargetList from "@/components/target/TargetList.vue";
import SearchTargets from "@/components/target/SearchTargets.vue";
import axios from "axios";
import SendComments from "@/components/sender/SendComments.vue";
import {notAuthDialog} from "@/utils.js";
import ArchiveList from "@/components/archive/ArchiveList.vue";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

export default {
  components: {HeaderBlock, ArchiveList, SendComments, SearchTargets, TargetList, AddTargetForm},
  props: {
    profile: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      archives: [],
    };
  },
  created() {
    this.fetchArchives(); // Загрузка списка таргетов при инициализации компонента
  },
  methods: {
    async fetchArchives() {
      this.isLoading = true;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("/archive/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          this.archives = response.data;
        } else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
      } finally {
        this.isLoading = false;
      }
    },
  }
};
</script>

<template>
  <div>
    <HeaderBlock title="Archives" />

    <div class="mx-auto w-full">
      <div class="grid grid-cols-6 gap-x-3 gap-y-5">
        <!-- Форма Рассылки комментарий -->
        <div class="col-span-6 col-start-1 lg:col-span-4 lg:col-start-2 md:col-span-6 md:col-start-1">
          <div class="mt-4">
            <ArchiveList :archives="archives" :is-loading="isLoading" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
