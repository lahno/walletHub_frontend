<script>
import Button from "@/components/forms/Button.vue";

export default {
  components: { Button },
  props: {
    isLoadingInitBtn: { type: Boolean, default: false },
  },
  methods: {
    generateAuthLink() {
      this.$emit("init-auth-url");
    },
  }
};
</script>

<template>
  <div class="font-medium">
    <Button text="Добавить" :isLoading="isLoadingInitBtn" :onClick="generateAuthLink" color="emerald" size="sm"/>
  </div>

<!--  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">-->
<!--    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-300">Добавить аккаунт</h2>-->

<!--    &lt;!&ndash; Лоадер &ndash;&gt;-->
<!--    <div v-if="isLoading" class="flex justify-center my-5">-->
<!--      <Loader :size="10" :mr="0" />-->
<!--    </div>-->

<!--    <form v-else @submit.prevent="submitForm">-->
<!--      &lt;!&ndash; Email &ndash;&gt;-->
<!--&lt;!&ndash;      <Input&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="form.email"&ndash;&gt;-->
<!--&lt;!&ndash;          placeholder="Email"&ndash;&gt;-->
<!--&lt;!&ndash;          :required="true"&ndash;&gt;-->
<!--&lt;!&ndash;          :errors="errors['email']"&ndash;&gt;-->
<!--&lt;!&ndash;          @clear-errors="clearFieldErrors('email')"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; Name &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <Input&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="form.name"&ndash;&gt;-->
<!--&lt;!&ndash;          placeholder="Имя"&ndash;&gt;-->
<!--&lt;!&ndash;          :required="true"&ndash;&gt;-->
<!--&lt;!&ndash;          :errors="errors['name']"&ndash;&gt;-->
<!--&lt;!&ndash;          @clear-errors="clearFieldErrors('name')"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->

<!--      &lt;!&ndash; cURL string &ndash;&gt;-->
<!--&lt;!&ndash;      <TextArea&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="form.curl_string"&ndash;&gt;-->
<!--&lt;!&ndash;          placeholder="cURL string"&ndash;&gt;-->
<!--&lt;!&ndash;          :errors="errors['curl_string']"&ndash;&gt;-->
<!--&lt;!&ndash;          :helpBtnFunc="showCurlStringHelp"&ndash;&gt;-->
<!--&lt;!&ndash;          @clear-errors="clearFieldErrors('curl_string')" />&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; Type &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <Select&ndash;&gt;-->
<!--&lt;!&ndash;          v-model="form.type"&ndash;&gt;-->
<!--&lt;!&ndash;          :items="accountTypes"&ndash;&gt;-->
<!--&lt;!&ndash;          placeholder="Тип"&ndash;&gt;-->
<!--&lt;!&ndash;          :required="true"&ndash;&gt;-->
<!--&lt;!&ndash;          :errors="errors['type']"&ndash;&gt;-->
<!--&lt;!&ndash;          @clear-errors="clearFieldErrors('type')"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->

<!--      &lt;!&ndash; Status &ndash;&gt;-->
<!--&lt;!&ndash;      <SwitchGroup>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;          <SwitchLabel class="mr-4 text-sm font-light text-gray-700 dark:text-gray-200">Статус:</SwitchLabel>&ndash;&gt;-->
<!--&lt;!&ndash;          <Switch&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="form.status"&ndash;&gt;-->
<!--&lt;!&ndash;              :class="form.status ? 'bg-green-500' : 'bg-slate-300'"&ndash;&gt;-->
<!--&lt;!&ndash;              class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="sr-only">Use setting</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span&ndash;&gt;-->
<!--&lt;!&ndash;                aria-hidden="true"&ndash;&gt;-->
<!--&lt;!&ndash;                :class="form.status ? 'translate-x-6' : 'translate-x-0'"&ndash;&gt;-->
<!--&lt;!&ndash;                class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </Switch>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </SwitchGroup>&ndash;&gt;-->

<!--      <div class="flex space-x-2 mt-8">-->

<!--&lt;!&ndash;        &lt;!&ndash; Кнопка создания ссылки авторизации &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="mb-4">&ndash;&gt;-->
<!--&lt;!&ndash;          <Button text="Добавить аккаунт" type="button" :isLoading="isLoadingInitBtn" :onClick="generateAuthLink" color="emerald"/>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--        &lt;!&ndash; Кнопка отправки &ndash;&gt;-->
<!--        <div class="mb-4">-->
<!--          -->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->

<!--    &lt;!&ndash; Диалоговое окно подсказки как получить curl_string &ndash;&gt;-->
<!--    <LongTextDialog-->
<!--        v-if="isCurlStringHelpDialogOpen"-->
<!--        :data_msg="curlStringHelpDialogData"-->
<!--        @close="closeDialogCurlStringHelp"-->
<!--    />-->

<!--  </div>-->
</template>