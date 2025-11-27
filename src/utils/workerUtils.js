import axios from "axios";

/**
 * Инициализация WebSocket для передачи данных задачи
 * @param {string} taskId - ID задачи
 * @param {function} onMessageCallback - Callback при получении нового сообщения (данных)
 * @param {function} onCloseCallback - Callback при закрытии соединения
 * @param {function} onErrorCallback - Callback при ошибке соединения
 * @returns {WebSocket} socket - WebSocket-объект
 */
export function initWebSocket(taskId, onMessageCallback, onCloseCallback, onErrorCallback) {

    const socket = new WebSocket(`${import.meta.env.VITE_BACKEND_URL}/ws/process_status/${taskId}/`);

    // Обработка событий WebSocket
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (onMessageCallback) {
            onMessageCallback(data); // Вызываем callback с обновленным статусом
        }
    };

    socket.onclose = () => {
        if (onCloseCallback) {
            onCloseCallback();
        }
    };

    socket.onerror = (error) => {
        if (onErrorCallback) {
            onErrorCallback(error);
        }
    };

    return socket; // Возвращаем объект WebSocket
}

/**
 * Получение статуса задач пользователя
 * @param {string} userId - ID пользователя
 * @param {string} taskName - Категория задачи
 * @returns {Promise<Array<string>>} - Список активных задач
 */
export async function checkTaskStatus(userId, taskName) {
    try {
        // Получаем список задач для пользователя
        const tasks = getTasksForUser(userId, taskName);

        const ongoingTasks = []; // Список задач, которые ещё выполняются

        // Проверяем статус каждой задачи
        for (const taskId of tasks) {
            try {
                const response = await axios.get(`/websocket/task-status/${taskId}/`);

                // Если задача завершена, удаляем её
                if (response.data.status === "SUCCESS" || response.data.status === "FAILURE" || response.data.status === "REVOKED" || response.data.status === "NOT_FOUND") {
                    removeTaskForUser(userId, taskId, taskName);
                } else {
                    ongoingTasks.push(taskId); // Сохраняем, если задача ещё выполняется
                }
            } catch (error) {
                console.error(`Ошибка при проверке статуса задачи ${taskId}:`, error);
                ongoingTasks.push(taskId); // В случае ошибки задача остаётся в ongoingTasks
            }
        }

        return ongoingTasks; // Возвращаем массив активных задач
    } catch (error) {
        console.error("Ошибка при проверке статуса задач:", error);
        return []; // В случае ошибки возвращаем пустой массив
    }
}

/**
 * Добавление задачи для пользователя
 * @param {string} userId - ID пользователя
 * @param {string} taskId - ID задачи
 * @param {string} taskName - Категория задачи
 */
export function addTaskForUser(userId, taskId, taskName) {
    const allUsersTasks = JSON.parse(localStorage.getItem("userTasks")) || {};

    if (!allUsersTasks[userId]) {
        allUsersTasks[userId] = {};
    }

    if (!allUsersTasks[userId][taskName]) {
        allUsersTasks[userId][taskName] = [];
    }

    allUsersTasks[userId][taskName].push(taskId);

    localStorage.setItem("userTasks", JSON.stringify(allUsersTasks));
}

/**
 * Получение задач пользователя
 * @param {string} userId - ID пользователя
 * @param {string|null} taskName - Категория задачи (или null)
 * @returns {Array|string|Object} - Список задач или всех задач пользователя
 */
export function getTasksForUser(userId, taskName = null) {
    const allUsersTasks = JSON.parse(localStorage.getItem("userTasks")) || {};

    if (!allUsersTasks[userId]) return taskName ? [] : {};

    if (taskName) {
        return allUsersTasks[userId][taskName] || [];
    }

    return allUsersTasks[userId];
}

/**
 * Удаление задачи для пользователя
 * @param {string} userId - ID пользователя
 * @param {string} taskId - ID задачи
 * @param {string} taskName - Категория задачи
 */
export function removeTaskForUser(userId, taskId, taskName) {
    const allUsersTasks = JSON.parse(localStorage.getItem("userTasks")) || {};

    if (!allUsersTasks[userId] || !allUsersTasks[userId][taskName]) return;

    allUsersTasks[userId][taskName] = allUsersTasks[userId][taskName].filter((id) => id !== taskId);

    if (allUsersTasks[userId][taskName].length === 0) delete allUsersTasks[userId][taskName];

    if (Object.keys(allUsersTasks[userId]).length === 0) delete allUsersTasks[userId];

    localStorage.setItem("userTasks", JSON.stringify(allUsersTasks));
}

/**
 * Удаление всех задач пользователя
 * @param {string} userId - ID пользователя
 * @param {string|null} taskName - Категория задачи (или null)
 */
export function removeAllTasksForUser(userId, taskName = null) {
    const allUsersTasks = JSON.parse(localStorage.getItem("userTasks")) || {};

    if (!allUsersTasks[userId]) return;

    if (taskName) {
        delete allUsersTasks[userId][taskName];
    } else {
        delete allUsersTasks[userId];
    }

    localStorage.setItem("userTasks", JSON.stringify(allUsersTasks));
}