import nodemailer from 'nodemailer';

// Кэш для Ethereal аккаунта (создаётся один раз автоматически)
let cachedTransporter: nodemailer.Transporter | null = null;
let cachedTestAccount: any = null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  previewUrl?: string;
  provider?: string;
}

/**
 * Определяем приоритет провайдеров:
 * 1. Resend (API ключ) — реальные письма на любую почту, 100/день бесплатно
 * 2. SMTP (nodemailer) — реальные письма через SMTP сервер
 * 3. Ethereal — тестовые письма (видны только в веб-интерфейсе)
 */
function getProvider(): 'resend' | 'smtp' | 'ethereal' {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_USER && process.env.SMTP_HOST) return 'smtp';
  return 'ethereal';
}

/**
 * Отправка через Resend API (бесплатно: 100 писем/день)
 * Регистрация: https://resend.com — 1 API ключ и всё работает
 */
async function sendViaResend(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY!;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@gruzexpress.ru';
  const fromName = process.env.RESEND_FROM_NAME || 'ГрузЭкспресс';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} — ${error}`);
  }

  const result = await response.json();
  console.log(`[Email] ✅ Письмо отправлено через Resend: ${options.subject} → ${options.to} (id: ${result.id})`);
  return { success: true, provider: 'resend' };
}

/**
 * Отправка через SMTP (Mail.ru, Gmail, Яндекс и т.д.)
 */
async function sendViaSMTP(options: SendEmailOptions): Promise<SendEmailResult> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"ГрузЭкспресс" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  console.log(`[Email] ✅ Письмо отправлено через SMTP: ${options.subject} → ${options.to}`);
  return { success: true, provider: 'smtp' };
}

/**
 * Отправка через Ethereal (тестовый режим, письма не доходят до реальных почтовых ящиков)
 */
async function sendViaEthereal(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!cachedTransporter) {
    console.log('[Email] ⚠️ SMTP и Resend не настроены. Создаю тестовый Ethereal аккаунт...');
    cachedTestAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: cachedTestAccount.user,
        pass: cachedTestAccount.pass,
      },
    });
    console.log(`[Email] Ethereal аккаунт создан: ${cachedTestAccount.user}`);
  }

  const info = await cachedTransporter.sendMail({
    from: `"ГрузЭкспресс" <${cachedTestAccount.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
  console.log(`[Email] 📧 Письмо отправлено через Ethereal (тест): ${options.subject} → ${options.to}`);
  if (previewUrl) {
    console.log(`[Email] 🔗 Просмотр: ${previewUrl}`);
  }
  return { success: true, previewUrl, provider: 'ethereal' };
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const provider = getProvider();

  try {
    switch (provider) {
      case 'resend':
        return await sendViaResend(options);
      case 'smtp':
        return await sendViaSMTP(options);
      case 'ethereal':
        return await sendViaEthereal(options);
    }
  } catch (error) {
    console.error(`[Email] Ошибка отправки через ${provider}:`, error);

    // Fallback: если Resend упал — пробуем Ethereal
    if (provider === 'resend') {
      console.log('[Email] Пробую Ethereal как fallback...');
      try {
        return await sendViaEthereal(options);
      } catch {}
    }

    return { success: false };
  }
}

/**
 * Проверяет, будут ли письма доходить до реальных почтовых ящиков
 */
export function isRealEmailProvider(): boolean {
  return getProvider() !== 'ethereal';
}

export function verificationEmailHtml(name: string, token: string): string {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #0f4c5c, #0a3642); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">ГрузЭкспресс</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Подтверждение email</p>
      </div>
      <div style="padding: 0 10px;">
        <h2 style="color: #0f4c5c;">Здравствуйте, ${name}!</h2>
        <p>Спасибо за регистрацию на сайте <strong>ГрузЭкспресс</strong>.</p>
        <p>Для подтверждения вашей электронной почты нажмите кнопку ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="display: inline-block; background: #e86833; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Подтвердить email
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
        <p style="color: #64748b; font-size: 14px;">Ссылка действительна в течение 24 часов.</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ГрузЭкспресс — Надёжные грузоперевозки по всей России</p>
    </body>
    </html>
  `;
}

const statusLabels: Record<string, string> = {
  pending: 'В обработке',
  in_progress: 'В пути',
  completed: 'Доставлен',
  cancelled: 'Отменён',
};

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export function orderStatusEmailHtml(customerName: string, orderId: string, newStatus: string, serviceName: string): string {
  const label = statusLabels[newStatus] || newStatus;
  const color = statusColors[newStatus] || '#6b7280';
  const shortId = orderId.slice(-8).toUpperCase();
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #0f4c5c, #0a3642); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">ГрузЭкспресс</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Обновление статуса заказа</p>
      </div>
      <div style="padding: 0 10px;">
        <h2 style="color: #0f4c5c;">Здравствуйте, ${customerName}!</h2>
        <p>Статус вашего заказа <strong>#${shortId}</strong> (${serviceName}) изменился.</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background: ${color}; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            ${label}
          </div>
        </div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0; color: #475569; font-size: 14px;">
            📦 Заказ: <strong>#${shortId}</strong><br>
            🚚 Услуга: ${serviceName}<br>
            📊 Статус: <strong style="color: ${color};">${label}</strong>
          </p>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 16px;">Вы можете отслеживать статус заказа в <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" style="color: #0f4c5c;">личном кабинете</a>.</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ГрузЭкспресс — Надёжные грузоперевозки по всей России</p>
    </body>
    </html>
  `;
}

export function welcomeEmailHtml(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #0f4c5c, #0a3642); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Добро пожаловать в ГрузЭкспресс!</h1>
      </div>
      <div style="padding: 0 10px;">
        <h2 style="color: #0f4c5c;">Здравствуйте, ${name}!</h2>
        <p>Ваш аккаунт успешно создан. Теперь вы можете:</p>
        <ul style="line-height: 2;">
          <li>📦 Оформлять заказы на грузоперевозки</li>
          <li>📋 Отслеживать статус ваших заказов</li>
          <li>💰 Получать скидки за регулярные заказы</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order" style="display: inline-block; background: #e86833; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Оформить первый заказ
          </a>
        </div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="color: #0f4c5c; margin: 0 0 8px 0;">🎁 Бонус за регистрацию</h3>
          <p style="margin: 0; color: #475569;">После 5 заказов вы получите скидку 5%! После 10 заказов — 10%, после 20 — 15%.</p>
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ГрузЭкспресс — Надёжные грузоперевозки по всей России</p>
    </body>
    </html>
  `;
}