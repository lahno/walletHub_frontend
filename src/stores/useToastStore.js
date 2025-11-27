import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([])

    function showToast(message, status_icon = true, duration = 5000) {
        const id = Date.now()
        const toast = { id, message, status_icon, paused: false, timeoutId: null }
        toasts.value.push(toast)

        startAutoRemove(id, duration)
    }

    function startAutoRemove(id, duration) {
        const toast = toasts.value.find(t => t.id === id)
        if (!toast) return

        toast.timeoutId = setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    function pauseToast(id) {
        const toast = toasts.value.find(t => t.id === id)
        if (toast && toast.timeoutId) {
            clearTimeout(toast.timeoutId)
            toast.timeoutId = null
        }
    }

    function resumeToast(id, duration) {
        const toast = toasts.value.find(t => t.id === id)
        if (toast && !toast.timeoutId) {
            startAutoRemove(id, duration)
        }
    }

    function removeToast(id) {
        toasts.value = toasts.value.filter(toast => toast.id !== id)
    }

    return { toasts, showToast, removeToast, pauseToast, resumeToast }
})
