<template>
  <main class="privacy-view">
    <div class="container">
      <h1 class="page-title">Политика конфиденциальности</h1>
      <p class="page-updated">Дата последнего обновления: {{ new Date().toLocaleDateString('ru-RU') }}</p>

      <div class="privacy-content">
        <section>
          <h2>1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки персональных данных
            пользователей сайта <strong>ГрузЭкспресс</strong> (далее — «Сайт», «Оператор»).
            Используя Сайт, вы подтверждаете своё согласие с условиями данной Политики.
          </p>
        </section>

        <section>
          <h2>2. Сбор персональных данных</h2>
          <p>Мы можем собирать следующие персональные данные:</p>
          <ul>
            <li><strong>Имя</strong> — при регистрации и оформлении заказа</li>
            <li><strong>Адрес электронной почты</strong> — для авторизации и уведомлений</li>
            <li><strong>Номер телефона</strong> — для связи по заказам</li>
            <li><strong>Адрес доставки</strong> — для выполнения заказов</li>
            <li><strong>История заказов</strong> — для предоставления скидок и аналитики</li>
          </ul>
        </section>

        <section>
          <h2>3. Цели обработки данных</h2>
          <p>Персональные данные обрабатываются в следующих целях:</p>
          <ul>
            <li>Регистрация и авторизация пользователей</li>
            <li>Оформление и выполнение заказов на грузоперевозки</li>
            <li>Связь с пользователем по вопросам заказов</li>
            <li>Предоставление скидок и бонусов за регулярные заказы</li>
            <li>Отправка уведомлений о статусе заказов</li>
            <li>Улучшение качества обслуживания</li>
          </ul>
        </section>

        <section>
          <h2>4. Защита персональных данных</h2>
          <p>
            Мы принимаем необходимые правовые, организационные и технические меры для защиты
            персональных данных от неправомерного доступа, уничтожения, изменения, блокирования,
            копирования, предоставления, распространения, а также от иных неправомерных действий.
          </p>
          <ul>
            <li>Пароли хешируются с использованием алгоритма bcrypt</li>
            <li>Передача данных между сервером и клиентом защищена протоколом HTTPS</li>
            <li>Доступ к персональным данным имеют только уполномоченные сотрудники</li>
          </ul>
        </section>

        <section>
          <h2>5. Подтверждение электронной почты</h2>
          <p>
            При регистрации на Сайте пользователь получает письмо с ссылкой для подтверждения
            адреса электронной почты. Подтверждение необходимо для:
          </p>
          <ul>
            <li>Восстановления доступа к аккаунту</li>
            <li>Получения уведомлений о заказах</li>
            <li>Предотвращения создания фейковых аккаунтов</li>
          </ul>
        </section>

        <section>
          <h2>6. Скидочная программа</h2>
          <p>
            Зарегистрированные пользователи участвуют в программе лояльности. Скидки начисляются
            автоматически в зависимости от количества выполненных заказов:
          </p>
          <ul>
            <li><strong>5 и более заказов</strong> — скидка 5%</li>
            <li><strong>10 и более заказов</strong> — скидка 10%</li>
            <li><strong>20 и более заказов</strong> — скидка 15%</li>
          </ul>
          <p>Данные о количестве заказов и размере скидки хранятся в личном кабинете пользователя.</p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Сайт может использовать файлы cookie для обеспечения работоспособности,
            улучшения пользовательского опыта и анализа трафика. Вы можете настроить
            браузер для отказа от cookie, однако это может повлиять на работоспособность сайта.
          </p>
        </section>

        <section>
          <h2>8. Права пользователей</h2>
          <p>Пользователь имеет право:</p>
          <ul>
            <li>Получить информацию о своих персональных данных</li>
            <li>Требовать исправления неточных данных</li>
            <li>Требовать удаления своих персональных данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
          </ul>
        </section>

        <section>
          <h2>9. Контактная информация</h2>
          <p>
            По вопросам обработки персональных данных вы можете обратиться:<br>
            <strong>Email:</strong> info@gruzexpress.ru<br>
            <strong>Телефон:</strong> +7 (800) 555-35-35<br>
            <strong>Адрес:</strong> г. Москва, ул. Транспортная, д. 1
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.privacy-view {
  padding: var(--spacing-2xl) 0 var(--spacing-4xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.page-updated {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-3xl);
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
}

.privacy-content section {
  margin-bottom: var(--spacing-2xl);
}

.privacy-content h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-100);
}

.privacy-content p {
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.privacy-content ul {
  list-style: none;
  padding: 0;
}

.privacy-content li {
  padding: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
  position: relative;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.privacy-content li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}
</style>