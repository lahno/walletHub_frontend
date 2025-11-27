export function initNotificationsWebSocket(onMessageCallback, onCloseCallback, onErrorCallback, customUrl = null) {
    // Получение токена
    const token = localStorage.getItem("access_token");
    const defaultUrl = `${import.meta.env.VITE_BACKEND_URL}/ws/notifications/user/?token=${token}`;
    const socketUrl = customUrl || defaultUrl; // Используем URL, если передан, иначе дефолтный

    // Создаем экземпляр WebSocket
    const socket = new WebSocket(socketUrl);

    // Обработка сообщений
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "ping") {
            return;
        }

        // console.log('Полученные данные:', data);

        if (onMessageCallback) {
            onMessageCallback(data);
        }

        // Отправка подтверждения уведомления
        if (data.notification_id) {
            try {
                // Проверяем готовность соединения
                if (socket.readyState === WebSocket.OPEN) {
                    const payload = JSON.stringify({
                        type: 'acknowledgement',
                        notification_id: data.notification_id
                    });
                    // console.log('Отправка подтверждения:', payload);
                    socket.send(payload);
                } else {
                    console.warn('WebSocket не готов для отправки. Состояние:', socket.readyState);
                }
            } catch (e) {
                console.error('Ошибка при отправке подтверждения:', e);
            }
        }
    };

    // Добавляем обработчик открытия соединения
    socket.onopen = () => {
        console.log('WebSocket соединение установлено');
    };

    // Обработка закрытия соединения
    socket.onclose = () => {
        console.warn('WebSocket соединение закрыто.');
        if (onCloseCallback) {
            onCloseCallback();
        }
    };

    // Обработка ошибок
    socket.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
        if (onErrorCallback) {
            onErrorCallback(error);
        }
    };

    return socket;
}