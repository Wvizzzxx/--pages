# 🚚 ГрузЭкспресс — Система управления грузоперевозками

Полнофункциональная платформа для грузоперевозок с клиентским сайтом, админ-панелью и API.

## 🏗 Архитектура

Монорепозиторий (Turborepo) с тремя приложениями:

| Приложение | Описание | Порт |
|-----------|----------|------|
| `apps/web` | Клиентский сайт (Vue 3 + Vite) | 3000 |
| `apps/admin` | Админ-панель (Vue 3 + Vite) | 3001 |
| `apps/api` | REST API (Fastify + MongoDB) | 4000 |

### Стек технологий

- **Frontend:** Vue 3, TypeScript, Vite, Pinia, Vue Router
- **Backend:** Fastify, Mongoose, JWT
- **База данных:** MongoDB
- **Монорепо:** Turborepo, npm workspaces
- **UI-кит:** Собственный (`packages/ui`)

---

## 🚀 Гайд по запуску на чистом ПК

### Шаг 1: Установка Node.js

Скачайте и установите **Node.js версии 18 или выше**:

1. Перейдите на [https://nodejs.org/](https://nodejs.org/)
2. Скачайте **LTS-версию** (рекомендуется)
3. Запустите установщик и следуйте инструкциям
4. **Обязательно** поставьте галочку "Automatically install the necessary tools" (если есть)

Проверьте установку — откройте **Терминал** (PowerShell или CMD) и выполните:

```bash
node --version
# Должно вывести: v18.x.x или выше

npm --version
# Должно вывести: 9.x.x или выше
```

### Шаг 2: Установка MongoDB

MongoDB — это база данных, которая нужна проекту.

1. Перейдите на [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Скачайте **MongoDB Community Server**
3. Запустите установщик:
   - Выберите **"Complete"** установку
   - Поставьте галочку **"Install MongoDB as a Service"** (важно!)
   - Завершите установку

Проверьте — в PowerShell выполните:

```bash
mongosh --quiet --eval "db.runCommand({ping:1})"
```

Если видите `{"ok":1}` — MongoDB работает корректно.

### Шаг 3: Клонирование проекта

Откройте папку, куда хотите скачать проект, и выполните:

```bash
git clone https://github.com/DianaBotalova/Jfdjsj.git
cd Jfdjsj
```

### Шаг 4: Автоматическая установка (рекомендуется)

Запустите скрипт автоматической установки — он всё сделает сам:

```bash
.\setup.bat
```

Скрипт выполнит:
- Проверит Node.js и npm
- Установит все зависимости (`npm install`)
- Скопирует конфигурацию `.env`
- Импортирует тестовые данные в MongoDB

### Шаг 5: Запуск

После установки запустите проект:

```bash
.\start.bat
```

Или через npm:

```bash
npm run dev
```

### Шаг 6: Откройте в браузере

| Сайт | URL |
|------|-----|
| 🌐 Клиентский сайт | [http://localhost:3000](http://localhost:3000) |
| ⚙️ Админ-панель | [http://localhost:3001](http://localhost:3001) |
| 🔧 API | [http://localhost:4000](http://localhost:4000) |

---

## 🔑 Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| 👑 Администратор | `admin@gruzexpress.ru` | `admin123` |
| 👤 Пользователь (со скидкой 5%) | `wvizzzxx@yandex.ru` | `admin123` |

---

## 📦 Структура проекта

```
грузоперевозки/
├── apps/
│   ├── web/              # Клиентский сайт
│   │   └── src/
│   │       ├── views/     # Страницы (главная, услуги, профиль, заказ)
│   │       ├── components/# Компоненты (header, footer, чат-бот)
│   │       ├── api/       # API-клиенты
│   │       ├── stores/    # Pinia stores (auth)
│   │       └── router/    # Маршрутизация
│   ├── admin/            # Админ-панель
│   │   └── src/
│   │       ├── views/     # Дашборд, заказы, пользователи, услуги, галерея
│   │       ├── api/       # API-клиенты админки
│   │       └── components/# Пагинация, диалоги, layout
│   └── api/              # Backend API
│       └── src/
│           ├── routes/    # Маршруты (auth, orders, services, users, gallery)
│           ├── models/    # Mongoose модели (User, Order, Service, Gallery)
│           ├── middleware/ # JWT авторизация
│           └── lib/       # Утилиты (email, ошибки, пагинация)
├── packages/
│   ├── ui/               # Переиспользуемые UI-компоненты (BaseButton, BaseModal...)
│   ├── types/            # TypeScript типы
│   └── schemas/          # Zod-схемы валидации
├── seed/                 # 📂 Экспорт базы данных (JSON)
├── scripts/
│   ├── export-db.js      # Экспорт MongoDB → JSON
│   └── seed-db.js        # Импорт JSON → MongoDB
├── setup.bat             # Автоматическая установка
├── start.bat             # Запуск проекта
└── turbo.json            # Конфигурация Turborepo
```

---

## 🗄 База данных

### Коллекции

| Коллекция | Описание | Документов |
|-----------|----------|------------|
| `users` | Пользователи (админы, клиенты) | 3 |
| `services` | Услуги перевозки | 4 |
| `orders` | Заказы | 13 |
| `galleries` | Фотографии галереи | 2 |
| `sitesettings` | Настройки сайта | 91 |

### Экспорт данных

Чтобы экспортировать текущее состояние базы:

```bash
node scripts/export-db.js
```

Данные сохранятся в папку `seed/` в формате JSON.

### Импорт данных (seed)

Чтобы заполнить базу тестовыми данными:

```bash
node scripts/seed-db.js
```

Это очистит коллекции и заполнит их данными из папки `seed/`.

### Скидочная система

Автоматическая скидка за количество заказов:

| Кол-во заказов | Скидка |
|---------------|--------|
| 0–4 | 0% |
| 5–9 | 5% |
| 10–19 | 10% |
| 20+ | 15% |

Скидка применяется автоматически при оформлении заказа и пересчитывается при завершении заказа.

---

## 🔧 Конфигурация

Файл конфигурации: `apps/api/.env`

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/gruzexpress

# JWT (секрет для токенов)
JWT_SECRET=gruzexpress-secret-key-2024
JWT_EXPIRES_IN=7d

# Сервер
PORT=4000
FRONTEND_URL=http://localhost:3000

# Email (Resend — бесплатно 100 писем/день)
RESEND_API_KEY=your-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Настройка email

**Вариант 1: Resend (рекомендуется)**
1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Создайте API-ключ
3. Добавьте в `.env`: `RESEND_API_KEY=re_xxxxx`

**Вариант 2: SMTP**
```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=ваша@почта.ru
SMTP_PASS=ваш_пароль
```

**Вариант 3: Без email** — если ничего не настроено, письма уходят через Ethereal (тестовый режим).

---

## 📋 Возможности

### Клиентский сайт
- 🏠 Главная страница с информацией о компании
- 🛠 Каталог услуг с ценами
- 📦 Оформление заявки на перевозку
- 👤 Личный кабинет с историей заказов
- 🎁 Система скидок за количество заказов
- 📸 Галерея выполненных работ
- 💬 Онлайн-чат (чат-бот)
- 📱 Адаптивный дизайн

### Админ-панель
- 📊 Дашборд со статистикой
- 📦 Управление заказами (смена статуса, комментарии)
- 👥 Управление пользователями
- 🛠 Управление услугами (CRUD)
- 📸 Управление галереей
- ⚙️ Настройки сайта
- ✉️ Email-уведомления о смене статуса

---

## 🛠 Разработка

### Команды

```bash
# Запуск всех сервисов
npm run dev

# Запуск только API
cd apps/api && npm run dev

# Запуск только клиентского сайта
cd apps/web && npm run dev

# Запуск только админки
cd apps/admin && npm run dev

# Экспорт базы данных
node scripts/export-db.js

# Импорт базы данных
node scripts/seed-db.js
```

### Добавление зависимостей

```bash
# Зависимость для конкретного приложения
cd apps/web && npm install axios

# Глобальная зависимость (из корня)
npm install --workspace=apps/web axios
```

---

## ❓ Решение проблем

### MongoDB не запускается
Убедитесь, что служба MongoDB запущена:
```bash
# Windows (PowerShell от администратора)
net start MongoDB
```

### Порт уже занят
Проверьте, что ничего не использует порт:
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

### Зависимости не устанавливаются
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### База данных пуста
```bash
node scripts/seed-db.js
```

---

## 📄 Лицензия

Проект создан в учебных целях.