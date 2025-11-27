import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import { createPinia } from 'pinia'
import { formatDate } from '@/utils';

axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$formatDate = formatDate;

app.use(router)
app.use(pinia)

app.mount('#app')