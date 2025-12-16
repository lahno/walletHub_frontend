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
<!--            <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">-->

<!--              &lt;!&ndash; Сообщение &ndash;&gt;-->
<!--              <div v-if="msg" class="mb-4 font-normal text-gray-700 dark:text-gray-300">-->
<!--                {{ msg }}-->
<!--              </div>-->

<!--              <div class="flex justify-center items-center my-5"-->
<!--                   v-if="isLoadingForm || !changedProfile.settings">-->
<!--                <Loader :size="6"/>-->
<!--              </div>-->

<!--              <h4>Настройки</h4>-->

<!--            </div>-->
          </div>

        </div>
      </div>
    </div>


  </div>
</template>