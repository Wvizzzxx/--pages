@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║      ГрузЭкспресс — Запуск проекта       ║
echo ╚══════════════════════════════════════════╝
echo.
echo Запуск серверов разработки...
echo.
echo   🌐 Веб-сайт:  http://localhost:3000
echo   🔧 API:       http://localhost:4000
echo   ⚙️  Админка:   http://localhost:3001
echo.
echo Нажмите Ctrl+C для остановки
echo ─────────────────────────────────────────
echo.
call npm run dev