<script>
import Loader from "@/components/utils/Loader.vue";
import AddAccountForm from "@/components/account/AddAccountForm.vue";
import InfoDialog from "@/components/dialogs/InfoDialog.vue";
import DeleteDialog from "@/components/account/DeleteDialog.vue";

import {XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import Button from "@/components/forms/Button.vue";
import ClientItem from "@/components/client/ClientItem.vue";

export default {
  components: {ClientItem, XMarkIcon, DeleteDialog, InfoDialog, AddAccountForm, Loader, Button},
  data() {
    return {

    }
  },
  methods: {

  },
  props: {
    clients: Array,
    isLoading: Boolean
  },
  emits: ["edit-client", "delete-client", "update-client-list"],
};
</script>

<template>
  <!-- component -->
  <div class="mx-auto w-full">
    <div class="grid my-5">
      <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-1 xs:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        <div v-for="client in clients" :key="client.id">
          <ClientItem
              v-if="client.status"
              :client="client"
              :is-loading="isLoading"
              @update-client-list="$emit('update-client-list')" />
        </div>
      </ul>
    </div>
  </div>
</template>