<script>
import Button from "@/components/forms/Button.vue";

export default {
  components: {Button},
  props: {
    title: String,
    sub_title: String,
    openFormAddClient: { type: Function, default: false }
  },
  emits: ["open-form-add-client"]
};
</script>

<template>
  <header class="bg-white dark:bg-gray-600 shadow-sm mb-5">
    <div class="grid grid-cols-2 gap-4">
      <div class="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <h1 v-if="title" class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300">{{title}}</h1>
        <p v-if="sub_title" class="text-gray-500  dark:text-gray-400">{{sub_title}}</p>
      </div>
      <div class="mx-auto w-full px-4 py-6">
        <Button text="Add new client" color="emerald" position="end" @click="openFormAddClient" />
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>