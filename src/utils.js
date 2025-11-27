// Импорты
import {
    initWebSocket,
    checkTaskStatus,
    addTaskForUser,
    getTasksForUser,
    removeTaskForUser,
    removeAllTasksForUser,
} from "@/utils/workerUtils";

// Экспорт функций
export {
    initWebSocket,
    checkTaskStatus,
    addTaskForUser,
    getTasksForUser,
    removeTaskForUser,
    removeAllTasksForUser,
};

// Обрезать длинные строки (12334...0982)
export const shortenString = (str) => {
    if (str.length <= 10) return str;
    return `${str.slice(0, 5)}...${str.slice(-4)}`;
};

export function formatDate(isoDate, userOptions = {}, is_time=true) {
    if (!isoDate) return "";

    const date = new Date(isoDate);

    // Опции форматирования по умолчанию (исключаем час и минуту)
    const defaultOptions = {
        day: "numeric",
        month: "long", // Полное название месяца
        year: "numeric",
    };

    // Если пользователь передал `userOptions`, используем их. Иначе `defaultOptions`
    const options = Object.keys(userOptions).length > 0 ? userOptions : defaultOptions;

    // Формирование основной строки даты (без времени)
    let formattedDate = date.toLocaleDateString("ru-RU", options);

    // Удаление "г." из строки
    formattedDate = formattedDate.replace(" г.", "");

    // Формирование времени отдельно
    const time = date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Совмещение даты и времени
    return is_time ? `${formattedDate} в ${time}` : `${formattedDate}`;
}

// Отображать модальное окно с переходом на авторизацию
export function notAuthDialog(context) {
    context.isDialogOpen = false;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    context.dialogData = {
        title: "Ошибка авторизации",
        text: "Не удалось загрузить профиль. Пожалуйста, войдите заново.",
        text_btn: "Перейти к авторизации"
    };
    context.isDialogOpen = true;
}


