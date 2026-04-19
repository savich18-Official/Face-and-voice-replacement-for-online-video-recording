# PHANTOM CRYPT v2.0
### Система цифровой анонимизации в реальном времени

**Phantom Crypt** — это специализированное веб-приложение для обеспечения анонимности при видеозаписи. Проект объединяет технологии нейронного трекинга лиц и цифровой обработки звука для полного скрытия личности пользователя.

---

## Основной функционал

*   **Face Tracking & Masking**: Использование нейросетевых моделей для обнаружения лица и автоматического наложения анимированной GIF-маски. Маска динамически следует за движениями головы.
*   **Voice Modulation**: Реал-тайм обработка аудиопотока через Web Audio API. Применяется дисторшн, фильтрация частот и компрессия для создания неузнаваемого голоса.
*   **Virtual Background**: Замена реального фона на пользовательские анимированные ассеты.
*   **Direct Intercept**: Запись комбинированного видео и аудио потока напрямую в браузере с возможностью сохранения в форматах MP4 и WebM.
*   **Dynamic Assets**: Возможность изменять маски и фоны "на лету" с помощью внешних URL-ссылок через встроенный CORS-прокси.

---

## Инженерный стек

- **Frontend**: React 18, Vite, Tailwind CSS.
- **AI/ML**: face-api.js (Tiny Face Detector).
- **Audio/Video**: Web Audio API, MediaRecorder API, HTML5 Canvas.
- **Backend**: Node.js, Express (Proxy-service for external assets).

---

## Установка и запуск

1. **Клонирование**:
   ```bash
   git clone https://github.com/savich18/phantom-crypt.git
   ```
2. **Зависимости**:
   ```bash
   npm install
   ```
3. **Запуск**:
   ```bash
   npm run dev
   ```

---

## Автор
**Savich18**

---

`SYSTEM STATUS: OPERATIONAL // ENCRYPTION: AES-4096 // NEURAL LINK: ENABLED`
