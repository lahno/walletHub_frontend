<script>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {EllipsisVerticalIcon} from "@heroicons/vue/24/outline/index.js";

export default {
  name: "AddressDropdownMenu",
  components: {Menu, MenuButton, MenuItem, MenuItems, EllipsisVerticalIcon},
  data() {
    return {
      userNavigation: [
        { name: 'Copy', href: '' },
        { name: 'Update', href: '' },
        { name: 'Delete', action: 'delete' }
      ]
    }
  },
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
        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active, ...attrs }">
          <button
              v-if="item.action === 'delete'"
              v-bind="attrs"
              :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block w-full text-left px-4 py-2 text-sm text-red-500 hover:cursor-pointer border-t border-gray-100']">
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