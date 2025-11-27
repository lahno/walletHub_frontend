import { defineStore } from 'pinia';
import { initNotificationsWebSocket } from '@/utils/notificationsSocket';

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: JSON.parse(localStorage.getItem('notifications')) || [], // Загруженные уведомления
        unreadNotifications: JSON.parse(localStorage.getItem('unreadNotifications')) || [], // Непрочитанные
        userSocket: null, // WebSocket для пользовательских уведомлений
        broadcastSocket: null, // WebSocket для общих уведомлений
    }),
    actions: {
        // Метод запуска двух WebSocket сразу
        startWebSockets() {
            this.startUserWebSocket();
            this.startBroadcastWebSocket();
        },

        // Метод остановки двух WebSocket сразу
        stopWebSockets() {
            this.stopUserWebSocket();
            this.stopBroadcastWebSocket();
        },

        // Запуск WebSocket для пользовательских уведомлений
        startUserWebSocket() {
            if (this.userSocket) {
                console.warn('WebSocket для пользовательских уведомлений уже запущен.');
                return;
            }

            this.userSocket = initNotificationsWebSocket(
                (data) => {
                    this.addNotification({ ...data, type: 'user' });
                },
                () => {
                    console.log('WebSocket для пользовательских уведомлений закрыт');
                    this.userSocket = null;
                },
                (error) => {
                    console.error('Ошибка в WebSocket для пользовательских уведомлений:', error);
                }
            );
        },

        // Остановка пользовательского WebSocket
        stopUserWebSocket() {
            if (this.userSocket) {
                this.userSocket.close();
                this.userSocket = null;
            }
        },

        // Запуск WebSocket для общих уведомлений
        startBroadcastWebSocket() {
            if (this.broadcastSocket) {
                console.warn('WebSocket для общих уведомлений уже запущен.');
                return;
            }

            // Получение токена
            const token = localStorage.getItem("access_token");

            // Инициализация WebSocket с другим URL для общих уведомлений
            this.broadcastSocket = initNotificationsWebSocket(
                (data) => {
                    this.addNotification({ ...data, type: 'broadcast' });
                },
                () => {
                    console.log('WebSocket для общих уведомлений закрыт');
                    this.broadcastSocket = null;
                },
                (error) => {
                    console.error('Ошибка в WebSocket для общих уведомлений:', error);
                },
                `${import.meta.env.VITE_BACKEND_URL}/ws/notifications/broadcast/?token=${token}`
            );
        },

        // Остановка WebSocket для общих уведомлений
        stopBroadcastWebSocket() {
            if (this.broadcastSocket) {
                this.broadcastSocket.close();
                this.broadcastSocket = null;
            }
        },

        // Добавление уведомления в массив
        addNotification(notification) {
            const isDuplicate = this.notifications.some(
                (n) => n.message === notification.message && n.type === notification.type
            );
            if (!isDuplicate) {
                const newNotification = {
                    ...notification,
                    m_type: notification.m_type || 'info', // Тип "info" по умолчанию
                    isNew: true
                };
                this.notifications.push(newNotification);
                this.unreadNotifications.push(newNotification); // Добавляем в непрочитанные
                this.saveNotifications();
            }
        },

        // Пометить все уведомления как прочитанные
        markAllAsRead() {
            // Очищаем только число непрочитанных и оставляем статус `isNew`
            this.unreadNotifications = [];
            this.notifications.forEach((notification) => {
                notification.isNew = false;
            });
            this.saveNotifications();
        },

        // Помечает конкретное уведомление как прочитанное
        markNotificationAsRead(notificationMessage) {
            const notification = this.notifications.find(
                (n) => n.message === notificationMessage
            );

            if (notification) {
                notification.isNew = false;
            }

            // Обновляем unreadNotifications для корректного хранения
            this.unreadNotifications = this.notifications.filter((n) => n.isNew);
            this.saveNotifications();
        },

        // Удаление всех уведомлений
        clearNotifications() {
            this.notifications = [];
            this.unreadNotifications = [];
            this.saveNotifications();
        },

        // Сохранение уведомлений в localStorage
        saveNotifications() {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('unreadNotifications', JSON.stringify(this.unreadNotifications));
        },

        // Удаление конкретного уведомления
        removeNotification(index) {
            this.notifications.splice(index, 1);
            this.saveNotifications();
        }
    }
});