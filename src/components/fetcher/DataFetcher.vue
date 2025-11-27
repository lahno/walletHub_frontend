<script>
import axios from 'axios';
import Input from "@/components/forms/Input.vue";
import TextArea from "@/components/forms/TextArea.vue";
import {useToastStore} from "@/stores/useToastStore.js";
import Button from "@/components/forms/Button.vue";

const toastStore = useToastStore();

export default {
  name: 'DataFetcher',
  components: {Button, TextArea, Input},
  data() {
    return {
      dbConfig: {
        url: '', // URL подключения к базе
        table: '', // Имя таблицы
      },
      data: [], // Данные из базы
      uploadedData: [], // Данные из загруженного файла
      isLoading: false, // Флаг загрузки
      isUploading: false, // Флаг отправки данных из файла
      successMsg: null, // Сообщение об успешной операции
      error: null, // Ошибки
      isSaving: false, // Флаг сохранения данных
    };
  },
  methods: {
    // Получение данных из базы через сервер
    async fetchData() {
      this.isLoading = true;
      this.error = null;
      this.data = [];
      try {
        const token = localStorage.getItem("access_token");
        // Отправляем POST-запрос на сервер
        const response = await axios.post('/data/fetch/', {
          url: this.dbConfig.url,
          table: this.dbConfig.table,
        }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
        });

        this.data = response.data; // Получаем данные из ответа
      } catch (err) {
        this.error = err.response?.data?.error || 'Не удалось получить данные';
      } finally {
        this.isLoading = false;
      }
    },

    // Скачать данные в файл
    downloadData() {
      const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.dbConfig.table}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    // Сохранение данных на сервере
    async saveToBackend() {
      this.isSaving = true;
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.post('/data/save/', { data: this.data }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
        });
        toastStore.showToast("Данные успешно сохранены на сервере!", true);
      } catch (err) {
        toastStore.showToast("Ошибка при сохранении данных на сервере", false);
      } finally {
        this.isSaving = false;
      }
    },
    // Обработчик загрузки файла
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.error = "Файл не выбран!";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Парсим содержимое файла (должен быть JSON)
          this.uploadedData = JSON.parse(reader.result);
          this.error = null;
          this.successMsg = "Файл успешно загружен.";
          this.uploadFileData();
        } catch (err) {
          this.uploadedData = [];
          this.error = "Ошибка при чтении файла. Убедитесь, что это корректный JSON.";
        }
      };
      reader.readAsText(file);
    },

    // Отправка данных из файла на сервер
    async uploadFileData() {
      this.isUploading = true;
      this.error = null;
      this.successMsg = null;

      try {
        const token = localStorage.getItem("access_token"); // Токен из локального хранилища

        // Отправляем POST-запрос с данными из файла
        const response = await axios.post(
            "/data/save/",
            { data: this.uploadedData }, // Отправляем JSON-объекты
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
        );

        this.successMsg = response.data.message || "Данные успешно отправлены на сервер!";
      } catch (err) {
        this.error =
            err.response?.data?.message || "Ошибка при отправке данных на сервер.";
      } finally {
        this.isUploading = false;
      }
    },

  },
};
</script>

<template>
  <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 dark:text-gray-300">Импорт данных</h2>
    <h2 class="text-md font-medium mb-2 dark:text-gray-300">Загрузить данные из внешней БД:</h2>

    <!-- Ошибка -->
    <div v-if="error" class="mt-4 mb-3 text-sm text-red-500">
      Произошла ошибка: {{ error }}
    </div>

    <!-- Поле для ввода URL -->
    <div class="mb-4">
      <TextArea
          v-model="dbConfig.url"
          :rows="4"
          placeholder="URL базы данных"
          :required="true"
      />
    </div>

    <!-- Поле для ввода имени таблицы -->
    <div class="mb-4">
      <Input
          v-model="dbConfig.table"
          placeholder="Имя таблицы"
          :required="true"
      />
    </div>

    <!-- Кнопка для получения данных -->
    <Button
        :text="isLoading ? 'Загрузка...' : 'Получить данные'"
        :onClick="fetchData"
        :disabled="isLoading || !dbConfig.url || !dbConfig.table"
        :isLoading="isLoading" />

    <!-- Полученные данные -->
    <div v-if="data.length" class="mt-8">
      <h2 class="text-xl font-medium mb-2 dark:text-gray-300">Полученные данные:</h2>
      <div class="mt-1">
        <p class="text-sm">Получено записей: <b>{{data.length}}</b> из таблицы <b>{{dbConfig.table}}</b></p>
      </div>

      <!-- Кнопки для сохранения и загрузки -->
      <div class="mt-4 flex gap-4">
        <Button
            text="Скачать файл"
            :onClick="downloadData" color="lime" />
        <Button
            text="Сохранить на сервере"
            :disabled="isSaving"
            :onClick="saveToBackend" color="blue" />
      </div>
    </div>

    <!-- Загрузка файла -->
    <div class="mt-4 border-t border-gray-200 pt-4">
      <h2 class="text-md font-medium mb-2 dark:text-gray-300">Загрузить данные из файла:</h2>

      <div class="flex items-center justify-center w-full">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">.json</p>
          </div>
          <input id="dropzone-file" type="file" accept=".json" class="hidden" @change="handleFileUpload" />
        </label>
      </div>

    </div>

    <!-- Сообщение об успешной загрузке -->
    <div v-if="successMsg" class="mt-4 mb-1 text-sm text-green-600">
      {{ successMsg }}
    </div>

  </div>
</template>