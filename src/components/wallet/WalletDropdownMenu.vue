<script>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {EllipsisVerticalIcon} from "@heroicons/vue/24/outline/index.js";
import axios from "axios";
import {notAuthDialog} from "@/utils.js";
import {useToastStore} from "@/stores/useToastStore.js";

const toastStore = useToastStore();

export default {
  name: "AddressDropdownMenu",
  components: {Menu, MenuButton, MenuItem, MenuItems, EllipsisVerticalIcon},
  props: {
    wallet: {}
  },
  emits: ["update-wallet-list"],
  data() {
    return {
      userNavigation: [
        { name: 'Copy', action: () => this.copyToClipboard() },
        { name: 'Delete', action: () => this.delete(), danger: true }
      ]
    }
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.wallet.address)
        console.log('Скопировано:', this.wallet.address)
      } catch (err) {
        console.error('Ошибка копирования', err)
      }
    },

    async delete() {
      console.log('Delete wallet', this.wallet);
      const walletId = this.wallet.id;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.delete(`/wallet/${walletId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 204) {
          this.$emit('update-wallet-list')
          toastStore.showToast("Кошелек успешно удалён!");
        }else if(response.status === 401){
          notAuthDialog(this);
        }
      } catch (error) {
        console.error("Ошибка при удалении wallet:", error);
        toastStore.showToast("Ошибка при удалении кошелька", false);
      } finally {
        this.isDeleteModalOpen = false;
      }
    }
  }
};
</script>

<template>
  <Menu as="div" class="relative mt-2">
    <div>
      <MenuButton class="relative flex max-w-xs items-center text-sm focus:ring-0 focus:ring-white focus:ring-offset-0 focus:ring-offset-white focus:outline-hidden">
        <span class="absolute -inset-1.5" />
        <EllipsisVerticalIcon class="size-6 text-gray-500" aria-hidden="true" />
      </MenuButton>
    </div>
    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden">
        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active, close, ...attrs }">
          <button
            v-if="item.action"
            v-bind="attrs"
            @click="item.action(); close()"
            :class="[
              'block w-full text-left px-4 py-2 text-sm',
              active && 'bg-gray-100',
              item.danger ? 'text-red-500' : 'text-gray-700'
            ]">
            {{ item.name }}
          </button>
          <router-link
              v-else
              :to="item.href"
              v-bind="attrs"
              :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']">
            {{ item.name }}
          </router-link>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>