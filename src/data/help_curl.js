import curl_string_chrome_1 from "@/assets/img/instructions/curl_string_chrome_1.png";
import curl_string_safari_1 from "@/assets/img/instructions/curl_string_safari_1.png";
import curl_string_chrome_2 from "@/assets/img/instructions/curl_string_chrome_2.png";
import curl_string_safari_2 from "@/assets/img/instructions/curl_string_safari_2.png";

export default {
    title: "Как получить cURL string?",
    text: `
    <p></p>
    <p>Для получения <b>cURL string</b> необходимо:</p>
    <p>1. перейти на сайт <a href="https://onlyfans.com" target="_blank" class="text-blue-400 hover:text-blue-500 outline-none">onlyfans.com</a></p>
    <p>2. открыть Web Inspector браузера</p>
    <ul class="ml-2">
      <li><i>Safari: Opt + Cmd + I</i></li>
      <li><i>Chrome: F12 (или Fn + F12)</i></li>
    </ul>
    <p>3. перейти на вкладку "сеть" или "Network" и отфильтровать все запросы "XHR/выборка или Fetch/XHR":</p>
    <i>chrome:</i>
    <img src="${curl_string_chrome_1}" alt="curl_string_chrome_1">
    <i>safari:</i>
    <img src="${curl_string_safari_1}" alt="curl_string_safari_1">
    <p>4. выполнить вход в аккаунт</p>
    <p>5. найти запрос <b>me</b> нажать правой кнопкой на нём и выбрать <b>скопировать cURL</b></p>
    <i>chrome:</i>
    <img src="${curl_string_chrome_2}" alt="curl_string_chrome_2">
    <i>safari:</i>
    <img src="${curl_string_safari_2}" alt="curl_string_safari_2">
    <p>Это всё, cURL string скопирован! 😉</p>
  `,
};