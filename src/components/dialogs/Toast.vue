<script setup>
import { useToastStore } from '@/stores/useToastStore'

const toastStore = useToastStore()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast flex items-center w-full max-w-xs p-4 bg-white rounded-lg shadow-md  dark:bg-gray-800"
          role="alert"
          @mouseenter="toastStore.pauseToast(toast.id)"
          @mouseleave="toastStore.resumeToast(toast.id, 4000)"
      >
        <div
            :class="[toast.status_icon ? 'text-green-600' : 'text-red-600', 'inline-flex items-center justify-center shrink-0 w-5 h-5']"
        >
          <span v-if="toast.status_icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span class="sr-only">Success icon</span>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span class="sr-only">Error icon</span>
          </span>

        </div>
        <div class="ms-3 text-sm font-normal mx-5 text-gray-500 dark:text-gray-300">{{ toast.message }}</div>
        <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 hover:cursor-pointer rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
            @click="toastStore.removeToast(toast.id)"
        >
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3 size-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.toast-container {
  position: fixed;
  bottom: 80px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Анимация */
.toast-enter-active, .toast-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
