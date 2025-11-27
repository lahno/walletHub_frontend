import { createRouter, createWebHistory } from 'vue-router';
import axios from "axios";

// Функция проверки авторизации
const isAuthenticated = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false; // Если токена нет, пользователь точно не авторизован

  try {
    const response = await axios.get('/profile/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response && response.status === 200; // Авторизация успешна, если статус 200
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false; // Ошибка проверки токена, пользователь не авторизован
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/Layout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/RegisterView.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
        },
      ]
    },


    // AUTH ROUTS
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: () => import('../views/AccountsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'targets',
          name: 'targets',
          component: () => import('../views/TargetsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('../views/MessagesView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'limits',
          name: 'limits',
          component: () => import('../views/LimitsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'archives',
          name: 'archives',
          component: () => import('../views/ArchivesView.vue'),
          meta: { requiresAuth: true },
        },
        // {
        //   path: 'profile',
        //   name: 'profile',
        //   component: () => import('../views/ProfileView.vue'),
        //   meta: { requiresAuth: true },
        // },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
          meta: { requiresAuth: true },
        }
      ]
    },

    // ERRORS ROUTS
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
});

// Глобальный навигационный гард для авторизации
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }
});



export default router;
