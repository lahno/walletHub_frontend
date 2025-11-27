<script>
import {onMounted, reactive, ref, watch} from "vue";
import debounce from "lodash/debounce";
import axios from "axios";
import Loader from "@/components/utils/Loader.vue";
import Input from "@/components/forms/Input.vue";
import Select from "@/components/forms/Select.vue";
import { SwitchGroup, SwitchLabel, Switch } from "@headlessui/vue";
import { useToastStore } from "@/stores/useToastStore.js";
import HeaderBlock from "@/components/utils/HeaderBlock.vue";

const toastStore = useToastStore();

export default {
  name: "SettingsEditor",
  components: {HeaderBlock, Select, Input, Loader, SwitchGroup, SwitchLabel, Switch },
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const changedProfile = reactive(JSON.parse(JSON.stringify(props.profile)));
    const errors = ref({});
    const isLoadingForm = ref(false);
    const msg = ref("");

    const defaultSettings = {
      count_contacts: 0,
      count_targets: 0,
      count_friends: 0,
      count_recommends: 0,
      find_friends_max_depth: 0,
      visible_logs: 0,
      notifications: { email: true, sms: false },
      skip_error_subscribe: false,
      mute_new_target: true,
      unsubscribe_where_error_posts_can_comment: false,
      use_proxy_api_client: true,
      cleanup_invalid_targets: false,
    };

    const count_contacts = Array.from({ length: 30 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    const count_targets = Array.from({ length: 100 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    const count_friends = Array.from({ length: 100 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    const count_recommends = Array.from({ length: 100 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    const find_friends_max_depth = Array.from({ length: 5 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    const visible_logs = Array.from({ length: 30 }, (_, i) => ({
      key: i + 1,
      value: i + 1,
    }));

    // Функция для добавления значений по умолчанию
    const initializeSettings = (profile) => {
      if (!profile.settings) {
        profile.settings = JSON.parse(JSON.stringify(defaultSettings));
      } else {
        profile.settings = {
          ...JSON.parse(JSON.stringify(defaultSettings)), // Значения по умолчанию
          ...profile.settings // Существующие значения профиля
        };
      }
    };

    // Загружаем профиль при первом посещении
    onMounted(() => {
      loadProfile();
    });

    const loadProfile = async () => {
      isLoadingForm.value = true;
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get('/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          // Обновляем профиль и добавляем настройки по умолчанию
          Object.assign(changedProfile, JSON.parse(JSON.stringify(response.data)));
          initializeSettings(changedProfile);
        }

      } catch (error) {
        console.error("Ошибка загрузки данных профиля:", error);
        toastStore.showToast("Не удалось загрузить профиль", false);
      } finally {
        isLoadingForm.value = false;
      }
    };

    // Дебаунсер для сохранения профиля (ожидание ввода)
    const saveProfile = debounce(async () => {
      errors.value = {}; // Очищаем ошибки перед новой отправкой
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.put("/user/", changedProfile, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          toastStore.showToast("Изменения успешно сохранены!", true, 1500);
        }else{
          toastStore.showToast("Error saving settings", false);
        }
      } catch (error) {
        if (
            error.response &&
            (error.response.status === 400 || error.response.status === 401)
        ) {
          errors.value = error.response.data;
        } else {
          console.error("Unexpected error:", error);
        }
        toastStore.showToast("Error saving settings", false);
      } finally {

      }
    }, 500); // Время задержки перед сохранением (в миллисекундах)

    // Следим за изменением данных профиля
    watch(
        () => JSON.parse(JSON.stringify(changedProfile)),
        () => {
          saveProfile(); // Сохранение только после окончания ввода
        },
        { deep: true }
    );

    const clearFieldErrors = (fieldName) => {
      if (errors.value[fieldName]) {
        errors.value[fieldName] = []; // Очистка ошибок для указанного поля
      }
    };

    return {
      changedProfile,
      loadProfile,
      initializeSettings,
      isLoadingForm,
      count_contacts,
      count_targets,
      count_friends,
      count_recommends,
      find_friends_max_depth,
      visible_logs,
      errors,
      msg,
      clearFieldErrors
    };
  }
};
</script>

<template>
  <div>
    <HeaderBlock title="Настройки аккаунта" sub_title="Измените основные настройки вашего аккаунта." />

    <div class="mx-auto max-w-7xl px-0 sm:px-0 lg:px-0 xl:px-8">
      <div class="grid grid-cols-6 gap-x-3 gap-y-5">
        <div class="col-span-6 col-start-1 lg:col-span-3 lg:col-start-1 md:col-span-4 md:col-start-1">
          <div class="mt-4">
            <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">

              <!-- Сообщение -->
              <div v-if="msg" class="mb-4 font-normal text-gray-700 dark:text-gray-300">
                {{ msg }}
              </div>

              <div class="flex justify-center items-center my-5"
                   v-if="isLoadingForm || !changedProfile.settings">
                <Loader :size="6"/>
              </div>

              <div v-else class="max-w-full mx-auto">
                <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">Архивы</label>
                <!-- Количество видимых логов -->
                <div v-if="changedProfile.settings.visible_logs !== undefined" class="w-full grid gap-3 grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                  <Select
                      v-model="changedProfile.settings.visible_logs"
                      :items="visible_logs"
                      placeholder="Сколько отображать логов"
                      :required="false"
                      :errors="errors['settings.visible_logs']"
                      @clear-errors="clearFieldErrors('settings.visible_logs')"
                  />
                </div>

                <!-- Использовать прокси в запросах (use_proxy_api_client) -->
                <div class="my-6">
                  <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">APIClient</label>
                  <SwitchGroup class="mb-2">
                    <div class="flex items-center">
                      <Switch
                          v-model="changedProfile.settings.use_proxy_api_client"
                          :class="changedProfile.settings.use_proxy_api_client ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">use_proxy_api_client</span>
                        <span
                            aria-hidden="true"
                            :class="changedProfile.settings.use_proxy_api_client ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <SwitchLabel class="min-w-30 ml-4 text-sm font-light text-gray-700 dark:text-gray-300">Использовать прокси в запросах</SwitchLabel>
                    </div>
                  </SwitchGroup>
                </div>

                <div class="my-6">
                  <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">Поиск таргетов</label>
                  <!-- Количество таргетов из рекомендованных -->
                  <div v-if="changedProfile.settings.count_recommends !== undefined" class="w-full grid gap-3 grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                    <Select
                        v-model="changedProfile.settings.count_recommends"
                        :items="count_recommends"
                        placeholder="Количество таргетов для поиска рекомендованных"
                        :required="false"
                        :errors="errors['settings.count_recommends']"
                        @clear-errors="clearFieldErrors('settings.count_recommends')"
                    />
                  </div>

                  <!-- Вложенность при поиске друзей друзей -->
                  <div v-if="changedProfile.settings.find_friends_max_depth !== undefined" class="w-full grid gap-3 grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                    <Select
                        v-model="changedProfile.settings.find_friends_max_depth"
                        :items="find_friends_max_depth"
                        placeholder="Вложенность при поиске друзей друзей"
                        :required="false"
                        :errors="errors['settings.find_friends_max_depth']"
                        @clear-errors="clearFieldErrors('settings.find_friends_max_depth')"
                    />
                  </div>
                </div>

                <div class="my-6">
                  <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">Рассылка комментариев</label>
                  <!-- Удаление таргетов и отписка при рассылке комментариев -->
                  <SwitchGroup class="mb-2">
                    <div class="flex items-center">
                      <Switch
                          v-model="changedProfile.settings.unsubscribe_where_error_posts_can_comment"
                          :class="changedProfile.settings.unsubscribe_where_error_posts_can_comment ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">unsubscribe_where_error_posts_can_comment</span>
                        <span
                            aria-hidden="true"
                            :class="changedProfile.settings.unsubscribe_where_error_posts_can_comment ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <SwitchLabel class="min-w-30 ml-4 text-sm font-light text-gray-700 dark:text-gray-300">Удалять таргет если закрыты комментарии</SwitchLabel>
                    </div>
                  </SwitchGroup>
                </div>

                <div class="my-6">
                  <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">Воркеры (общее)</label>
                  <SwitchGroup class="mb-2">
                    <div class="flex items-center">
                      <Switch
                          v-model="changedProfile.settings.skip_error_subscribe"
                          :class="changedProfile.settings.skip_error_subscribe ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">skip_error_subscribe</span>
                        <span
                            aria-hidden="true"
                            :class="changedProfile.settings.skip_error_subscribe ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <SwitchLabel class="min-w-30 ml-4 text-sm font-light text-gray-700 dark:text-gray-300">Пропускать ошибки подписок</SwitchLabel>
                    </div>
                  </SwitchGroup>
                  <SwitchGroup class="mb-2">
                    <div class="flex items-center">
                      <Switch
                          v-model="changedProfile.settings.mute_new_target"
                          :class="changedProfile.settings.mute_new_target ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">mute_new_target</span>
                        <span
                            aria-hidden="true"
                            :class="changedProfile.settings.mute_new_target ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <SwitchLabel class="min-w-30 ml-4 text-sm font-light text-gray-700 dark:text-gray-300">Заглушать новые таргеты</SwitchLabel>
                    </div>
                  </SwitchGroup>
                </div>

                <div class="my-6">
                  <label class="block text-lg font-normal text-gray-700 dark:text-gray-300">Регулярные задачи</label>
                  <!-- Удаление неактуальных таргетов -->
                  <SwitchGroup class="mb-2">
                    <div class="flex items-center">
                      <Switch
                          v-model="changedProfile.settings.cleanup_invalid_targets"
                          :class="changedProfile.settings.cleanup_invalid_targets ? 'bg-green-500' : 'bg-slate-300'"
                          class="relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="sr-only">cleanup_invalid_targets</span>
                        <span
                            aria-hidden="true"
                            :class="changedProfile.settings.cleanup_invalid_targets ? 'translate-x-6' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <SwitchLabel class="min-w-30 ml-4 text-sm font-light text-gray-700 dark:text-gray-300">Удалять неактуальные таргеты</SwitchLabel>
                    </div>
                  </SwitchGroup>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


  </div>
</template>