@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║     ГрузЭкспресс — Установка проекта     ║
echo ╚══════════════════════════════════════════╝
echo.

:: Проверяем наличие Node.js
echo [1/6] Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен!
    echo    Скачайте с https://nodejs.org/ (версия 18+)
    echo    Установите и запустите этот скрипт снова.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js %NODE_VER% найден
echo.

:: Проверяем наличие npm
echo [2/6] Проверка npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm не установлен!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
echo ✅ npm %NPM_VER% найден
echo.

:: Устанавливаем зависимости
echo [3/6] Установка зависимостей (npm install)...
echo Это может занять несколько минут...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при установке зависимостей!
    echo    Попробуйте: npm cache clean --force
    pause
    exit /b 1
)
echo ✅ Зависимости установлены
echo.

:: Копируем .env файлы если их нет
echo [4/6] Настройка конфигурации...
if not exist "apps\api\.env" (
    if exist "apps\api\.env.example" (
        copy "apps\api\.env.example" "apps\api\.env" >nul
        echo ✅ Создан apps\api\.env из шаблона
    ) else (
        echo ⚠️  Файл apps\api\.env не найден, создайте вручную
    )
) else (
    echo ✅ Файл apps\api\.env уже существует
)
echo.

:: Проверяем MongoDB и импортируем данные
echo [5/6] Проверка MongoDB и импорт данных...
mongosh --quiet --eval "db.runCommand({ping:1})" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB не найдена или не запущена!
    echo    Установите MongoDB: https://www.mongodb.com/try/download/community
    echo    Запустите MongoDB и повторите установку.
    echo    После запуска MongoDB выполните: node scripts\seed-db.js
) else (
    echo ✅ MongoDB доступна
    echo Импорт тестовых данных...
    node scripts\seed-db.js
)
echo.

:: Готово
echo [6/6] Завершение...
echo.
echo ╔══════════════════════════════════════════╗
echo ║           ✅ Установка завершена!         ║
echo ╠══════════════════════════════════════════╣
echo ║                                          ║
echo ║  Запуск:  start.bat или npm run dev      ║
echo ║                                          ║
echo ║  🌐 Веб-сайт:  http://localhost:3000     ║
echo ║  🔧 API:       http://localhost:4000     ║
echo ║  ⚙️  Админка:   http://localhost:3001     ║
echo ║                                          ║
echo ║  Админ: admin@gruzexpress.ru / admin123  ║
echo ║                                          ║
echo ╚══════════════════════════════════════════╝
echo.
pause