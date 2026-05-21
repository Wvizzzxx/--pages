/**
 * Скрипт экспорта базы данных gruzexpress в JSON-файлы
 * Запуск: node scripts/export-db.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gruzexpress';
const EXPORT_DIR = path.join(__dirname, '..', 'seed');

async function exportDatabase() {
  console.log('Подключение к MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Подключено к:', MONGODB_URI);

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  for (const col of collections) {
    const name = col.name;
    if (name.startsWith('system.')) continue;

    console.log(`Экспорт коллекции: ${name}`);
    const docs = await db.collection(name).find({}).toArray();

    // Преобразуем ObjectId в строки для JSON
    const cleaned = JSON.parse(JSON.stringify(docs, (key, value) => {
      if (value && value.$oid) return value.$oid;
      return value;
    }));

    const filePath = path.join(EXPORT_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');
    console.log(`  → ${docs.length} документов → ${filePath}`);
  }

  console.log('\nЭкспорт завершён!');
  await mongoose.disconnect();
}

exportDatabase().catch(err => {
  console.error('Ошибка экспорта:', err);
  process.exit(1);
});