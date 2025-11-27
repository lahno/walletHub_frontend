<script>

import {defineComponent, ref} from "vue";
import HeaderMain from "@/components/HeaderMain.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import avatar from "@/assets/img/ava1.png";

export default defineComponent({
  components: {InfoDialog, HeaderMain},
  data() {
    return {
      profile: { imageUrl: avatar },
      isDialogOpen: ref(false), // Контролируем открытие/закрытие диалога
      dialogData: ref({ title: "", text: "" }), // Данные для диалога
    };
  },
  methods: {
    closeDialog() {
      this.isDialogOpen = false;
    },
  },
})
</script>

<template>
  <div>

    <HeaderMain />

    <!-- Диалоговое окно -->
    <InfoDialog v-if="isDialogOpen" :data_msg="dialogData" @close="closeDialog" />

    <router-view />

  </div>
</template>