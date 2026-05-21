<template>
  <div class="chatbot">
    <!-- Кнопка открытия -->
    <button class="chatbot-toggle" @click="toggleChat" :class="{ active: isOpen }">
      <span v-if="!isOpen" class="toggle-icon">💬</span>
      <span v-else class="toggle-icon">✕</span>
      <span v-if="!isOpen && unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
    </button>

    <!-- Окно чата -->
    <Transition name="chat-slide">
      <div v-if="isOpen" class="chatbot-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div>
              <div class="chat-name">Ассистент ГрузЭкспресс</div>
              <div class="chat-status">Онлайн</div>
            </div>
          </div>
          <button class="chat-close" @click="toggleChat">✕</button>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-for="(msg, i) in messages" :key="i" class="chat-message" :class="msg.type">
            <div class="message-bubble">
              <div v-if="msg.type === 'bot'" class="message-avatar">🤖</div>
              <div class="message-content" v-html="msg.text"></div>
            </div>
          </div>
          <div v-if="typing" class="chat-message bot">
            <div class="message-bubble">
              <div class="message-avatar">🤖</div>
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Быстрые ответы -->
        <div v-if="showQuickReplies" class="quick-replies">
          <button
            v-for="(qr, i) in quickReplies"
            :key="i"
            class="quick-reply-btn"
            @click="sendQuickReply(qr)"
          >
            {{ qr.label }}
          </button>
        </div>

        <div class="chat-input-area">
          <input
            v-model="userInput"
            type="text"
            class="chat-input"
            placeholder="Напишите сообщение..."
            @keyup.enter="sendMessage"
            :disabled="typing"
          />
          <button class="chat-send" @click="sendMessage" :disabled="!userInput.trim() || typing">
            ➤
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';

interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
}

interface QuickReply {
  label: string;
  keywords: string[];
  answer: string;
}

const isOpen = ref(false);
const userInput = ref('');
const typing = ref(false);
const unreadCount = ref(1);
const messagesContainer = ref<HTMLElement | null>(null);

const messages = ref<ChatMessage[]>([
  {
    type: 'bot',
    text: '👋 Здравствуйте! Я виртуальный ассистент <strong>ГрузЭкспресс</strong>.<br><br>Чем могу помочь? Выберите тему или напишите свой вопрос:',
  },
]);

const quickReplies: QuickReply[] = [
  { label: '📦 Услуги и цены', keywords: ['услуг', 'цен', 'стоимость', 'тариф'], answer: 'Мы предлагаем широкий спектр услуг:<br><br>🚚 <strong>Городские перевозки</strong> — от 1 500 ₽<br>🌍 <strong>Межгородские перевозки</strong> — от 3 000 ₽<br>🏠 <strong>Переезды</strong> — от 2 000 ₽<br>📐 <strong>Негабаритные грузы</strong> — индивидуально<br><br>Подробнее на странице <a href="/services" style="color:#e86833;font-weight:600;">Услуги</a>' },
  { label: '⏰ Сроки доставки', keywords: ['срок', 'время', 'доставк', 'сколько', 'долго'], answer: '⏱ <strong>Сроки доставки:</strong><br><br>• Городские перевозки — <strong>2-4 часа</strong><br>• Межгородские — <strong>1-3 дня</strong> в зависимости от расстояния<br>• Междугородние дальние — <strong>3-7 дней</strong><br><br>Точный срок уточняет менеджер после оформления заявки.' },
  { label: '💰 Как заказать', keywords: ['заказать', 'оформить', 'как', 'заявк'], answer: '📝 <strong>Как оформить заказ:</strong><br><br>1. Нажмите <a href="/order" style="color:#e86833;font-weight:600;">«Оформить заявку»</a><br>2. Заполните форму (откуда, куда, услуга)<br>3. Менеджер свяжется в течение <strong>30 минут</strong><br>4. Согласуете детали и цену<br><br>Также можно позвонить: <strong>+7 (800) 555-35-35</strong>' },
  { label: '🛡️ Гарантии', keywords: ['гаранти', 'страхов', 'сохран', 'безопасн'], answer: '🛡️ <strong>Наши гарантии:</strong><br><br>• Все грузы <strong>застрахованы</strong><br>• GPS-отслеживание в реальном времени<br>• Фиксация цены в договоре<br>• Акт приёма-передачи<br>• Более <strong>13 лет</strong> на рынке<br><br>Подробнее: <a href="/guarantee" style="color:#e86833;font-weight:600;">Гарантии</a>' },
  { label: '📞 Контакты', keywords: ['контакт', 'телефон', 'адрес', 'связаться', 'позвонить', 'номер'], answer: '📞 <strong>Наши контакты:</strong><br><br>☎️ <strong>+7 (800) 555-35-35</strong> (бесплатно)<br>📧 info@gruzexpress.ru<br>📍 г. Москва, ул. Транспортная, д. 1<br>⏰ Работаем <strong>круглосуточно</strong>' },
  { label: '💳 Скидки', keywords: ['скидк', 'акци', 'промо', 'купон', 'бонус'], answer: '🎁 <strong>Скидочная система:</strong><br><br>• 5+ заказов → <strong>5% скидка</strong><br>• 10+ заказов → <strong>10% скидка</strong><br>• 20+ заказов → <strong>15% скидка</strong><br><br>Скидка применяется <strong>автоматически</strong> при оформлении заказа в личном кабинете.' },
];

const showQuickReplies = ref(true);

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    scrollToBottom();
  }
}

function sendQuickReply(qr: QuickReply) {
  messages.value.push({ type: 'user', text: qr.label });
  showQuickReplies.value = false;
  typing.value = true;
  scrollToBottom();

  setTimeout(() => {
    messages.value.push({ type: 'bot', text: qr.answer });
    typing.value = false;
    showQuickReplies.value = true;
    scrollToBottom();
  }, 600 + Math.random() * 400);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ type: 'user', text });
  userInput.value = '';
  typing.value = true;
  showQuickReplies.value = false;
  scrollToBottom();

  setTimeout(() => {
    const response = findResponse(text);
    messages.value.push({ type: 'bot', text: response });
    typing.value = false;
    showQuickReplies.value = true;
    scrollToBottom();
  }, 500 + Math.random() * 500);
}

function findResponse(input: string): string {
  const lower = input.toLowerCase();

  // Поиск по ключевым словам
  for (const qr of quickReplies) {
    for (const keyword of qr.keywords) {
      if (lower.includes(keyword)) {
        return qr.answer;
      }
    }
  }

  // Приветствие
  if (/(привет|здравствуй|добр|хай|hello|hi)/i.test(lower)) {
    return '👋 Здравствуйте! Рад вас видеть. Чем могу помочь? Выберите тему из кнопок ниже или напишите ваш вопрос.';
  }

  // Благодарность
  if (/(спасибо|благодар|thanks)/i.test(lower)) {
    return '😊 Пожалуйста! Рад помочь. Если есть ещё вопросы — обращайтесь!';
  }

  // Работа/вакансии
  if (/(работ|ваканс|трудоус|сотрудник)/i.test(lower)) {
    return '💼 <strong>Вакансии:</strong><br><br>Мы всегда рады видеть профессионалов в нашей команде! Отправляйте резюме на <strong>hr@gruzexpress.ru</strong> или звоните +7 (800) 555-35-35.';
  }

  // Ответ по умолчанию
  return '🤔 Интересный вопрос! Для получения подробной консультации рекомендую:<br><br>• Позвонить: <strong>+7 (800) 555-35-35</strong><br>• Написать: <strong>info@gruzexpress.ru</strong><br>• Или задайте вопрос, используя кнопки ниже 👇';
}

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.chatbot {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e86833, #d45a28);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(232, 104, 51, 0.4);
  transition: all 0.3s;
  position: relative;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(232, 104, 51, 0.5);
}

.chatbot-toggle.active {
  background: #555;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.chatbot-window {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 380px;
  max-height: 520px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

/* Анимация */
.chat-slide-enter-active {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-slide-leave-active {
  animation: slideUp 0.2s ease reverse;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Заголовок */
.chat-header {
  background: linear-gradient(135deg, #0f4c5c, #0a3642);
  color: white;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.chat-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.chat-status {
  font-size: 0.75rem;
  color: #6ee7b7;
}

.chat-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Сообщения */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  min-height: 200px;
  scroll-behavior: smooth;
}

.chat-message {
  display: flex;
}

.chat-message.user {
  justify-content: flex-end;
}

.message-bubble {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  max-width: 85%;
}

.chat-message.bot .message-bubble {
  flex-direction: row;
}

.chat-message.user .message-bubble {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  min-width: 28px;
  background: #e8f4f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.message-content {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.88rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.bot .message-content {
  background: #f3f4f6;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

.user .message-content {
  background: linear-gradient(135deg, #e86833, #d45a28);
  color: white;
  border-bottom-right-radius: 4px;
}

/* Typing indicator */
.typing-dots {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Быстрые ответы */
.quick-replies {
  padding: 0 16px 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quick-reply-btn {
  padding: 6px 12px;
  background: #f0f7ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-reply-btn:hover {
  background: #1d4ed8;
  color: white;
  border-color: #1d4ed8;
}

/* Ввод */
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.chat-input:focus {
  border-color: #e86833;
}

.chat-send {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e86833, #d45a28);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.chat-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(232, 104, 51, 0.4);
}

.chat-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Адаптив */
@media (max-width: 480px) {
  .chatbot-window {
    width: calc(100vw - 32px);
    right: -8px;
    bottom: 68px;
    max-height: 70vh;
  }
}
</style>