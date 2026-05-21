/**
 * Скрипт импорта (seed) базы данных gruzexpress из JSON-файлов
 * Запуск: node scripts/seed-db.js
 *
 * Импортирует все данные из папки seed/ в MongoDB.
 * Админ-аккаунт: admin@gruzexpress.ru / admin123
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gruzexpress';
const SEED_DIR = path.join(__dirname, '..', 'seed');

// Известные пароли для пользователей (bcrypt хеши будут перезаписаны)
const KNOWN_PASSWORDS = {
  'admin@gruzexpress.ru': 'admin123',
};

async function seedDatabase() {
  console.log('Подключение к MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Подключено к:', MONGODB_URI);

  const db = mongoose.connection.db;

  // Список коллекций для импорта (порядок важен для ссылок)
  const collections = ['users', 'services', 'orders', 'galleries', 'sitesettings'];

  for (const colName of collections) {
    const filePath = path.join(SEED_DIR, `${colName}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Пропуск: ${colName} (файл не найден)`);
      continue;
    }

    let docs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`\n📥 Импорт коллекции: ${colName} (${docs.length} документов)`);

    // Обработка паролей пользователей
    if (colName === 'users') {
      for (const user of docs) {
        const knownPassword = KNOWN_PASSWORDS[user.email];
        if (knownPassword) {
          user.password = await bcrypt.hash(knownPassword, 12);
          console.log(`  🔑 Пароль обновлён для: ${user.email} → ${knownPassword}`);
        }
        // Удаляем verificationToken и resetToken для чистоты
        user.verificationToken = null;
        user.resetToken = null;
        user.resetTokenExpires = null;
        user.emailVerified = true; // Все аккаунты подтверждены
      }
    }

    // Удаляем старые данные и вставляем новые
    await db.collection(colName).deleteMany({});
    if (docs.length > 0) {
      // Преобразуем _id строки обратно в ObjectId
      const cleaned = docs.map(doc => {
        const d = { ...doc };
        if (d._id && typeof d._id === 'string') {
          d._id = new mongoose.Types.ObjectId(d._id);
        }
        // Обработка вложенных ObjectId
        if (d.userId && typeof d.userId === 'string') {
          d.userId = new mongoose.Types.ObjectId(d.userId);
        }
        if (d.serviceId && typeof d.serviceId === 'string') {
          d.serviceId = new mongoose.Types.ObjectId(d.serviceId);
        }
        // Удаляем __v
        delete d.__v;
        return d;
      });
      await db.collection(colName).insertMany(cleaned);
    }
    console.log(`  ✅ Импортировано ${docs.length} документов`);
  }

  console.log('\n🎉 Импорт базы данных завершён!');
  console.log('\nДанные для входа:');
  console.log('  Админ: admin@gruzexpress.ru / admin123');
  console.log('  Пользователь: wvizzzxx@yandex.ru / admin123');
  await mongoose.disconnect();
}

seedDatabase().catch(err => {
  console.error('Ошибка импорта:', err);
  process.exit(1);
});