<script>
import WalletDropdownMenu from "@/components/wallet/WalletDropdownMenu.vue";
import {formatDate} from "@/utils.js";

export default {
  methods: {formatDate},
  components: {AddressDropdownMenu: WalletDropdownMenu},
  data() {
    return {
      format_date: {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      },
    }
  },
  props: {
    wallets: Array,
    isLoading: Boolean
  }
};
</script>

<template>
  <!-- component -->
  <ul role="list" class="w-full divide-y divide-gray-100">
    <li class="flex justify-between gap-x-6 py-2" v-for="wallet in wallets" :key="wallet.id">
      <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
        <p class="text-sm/6 text-gray-900">{{wallet.type}}</p>
        <p class="mt-0 text-xs/5 text-gray-400"><time :datetime="wallet.created_at">{{ formatDate(wallet.created_at, format_date, false) }}</time></p>
      </div>
      <div class="flex min-w-0 gap-x-4 mt-1">
        <div class="min-w-0 flex-auto">
          <div class="group flex items-center justify-between border-gray-500 rounded px-3 py-2 bg-slate-50">
            <span class="font-mono text-sm text-slate-700 select-all">{{wallet.address}}</span>
          </div>
        </div>
      </div>
      <div class="flex min-w-0 gap-x-1">
        <AddressDropdownMenu />
      </div>
    </li>
  </ul>
</template>