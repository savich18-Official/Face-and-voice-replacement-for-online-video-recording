<div align="center">

# 🎭 PHANTOM CRYPT v2.0
### Advanced Facial Anonymization Matrix

[![Version](https://img.shields.io/badge/version-2.0.0-green.svg?style=for-the-badge&logo=ghostery)](https://github.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

---

**Phantom Crypt** — это тактическая станция для полной цифровой анонимизации. 
Инструмент позволяет скрывать личность в реальном времени, подменяя лицо анимированным слоем и модулируя голос до неузнаваемости.

[**Запустить Протокол**](https://ais-dev-yamzm56qpnuy57gapurgtq-733143645969.asia-southeast1.run.app) • [**Сообщить об Ошибке**](https://github.com/) • [**Wiki**](https://github.com/)

</div>

---

## ⚡ Особенности Системы

- 🧬 **Нейронная Маскировка**: Использование `face-api.js` для захвата лица и наложения динамической GIF-маски с точностью до миллиметра.
- 🖼️ **Цифровой Фон**: Мгновенная подмена заднего плана на любой анимированный ассет.
- 🎙️ **Звуковое Искажение**: Встроенная модуляция голоса через Web Audio API (Distortion + Low-pass filter + Compression).
- 📹 **Перехват Потока**: Запись видео в форматах MP4 (AVC1) и WebM с частотой 30 FPS.
- 🕹️ **HUD Интерфейс**: Полностью анимированный пользовательский интерфейс в стиле тактических дисплеев будущего.
- 🛠️ **Динамическая Настройка**: Смена масок и фонов "на лету" через ввод URL-адресов прямо в консоли.

---

## 🚀 Быстрый Старт

### Системные Требования
*   Node.js v18.x или выше
*   Доступ к веб-камере и микрофону

### Установка
1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/your-username/phantom-crypt.git
   cd phantom-crypt
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите систему:
   ```bash
   npm run dev
   ```

---

## 🛠 Технологический Стек

| Инструмент | Описание |
| :--- | :--- |
| **React 18** | Ядро интерфейса и управление состоянием. |
| **Vite** | Сверхбыстрая сборка и HMR. |
| **Tailwind CSS** | Стилизация тактического HUD. |
| **Motion** | Плавные анимации элементов интерфейса. |
| **Face-api.js** | Нейронные сети для детекции лиц. |
| **Web Audio API** | Модуляция и обработка голоса. |

---

## 📂 Структура Проекта

```text
phantom-crypt/
├── src/
│   ├── App.tsx          # Главное ядро и логика HUD
│   ├── main.tsx         # Точка входа
│   └── index.css        # Глобальные стили и шейдеры
├── server.ts            # Прокси-сервер для обхода CORS
├── public/              # Статические ассеты
└── package.json         # Зависимости и скрипты
```

---

## 🧪 Безопасность и CORS

Для корректной работы с внешними GIF-файлами используется встроенный прокси-сервер. Это позволяет избежать ошибок `Tainted Canvas` и использовать любые изображения из интернета в качестве масок.

---

<div align="center">

### Разработано для теней. Использовать ответственно.

`SYSTEM STATUS: STABLE // ENCRYPTION: ACTIVE`

</div>
