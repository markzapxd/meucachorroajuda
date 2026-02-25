// server/api/chat.ts
const messageHistory: any[] = [];
const MAX_HISTORY = 100;

// Spam Protection Config
const userStats = new Map<string, { count: number, lastReset: number, timeoutUntil: number }>();
const MSG_LIMIT = 5;
const WINDOW_MS = 10000;
const TIMEOUT_MS = 15000;
const MAX_MSG_LENGTH = 100;

export default defineEventHandler(async (event) => {
  const method = event.method;

  // GET: Fetch message history
  if (method === 'GET') {
    return {
      type: 'history',
      messages: messageHistory
    };
  }

  // POST: Send new message
  if (method === 'POST') {
    const body = await readBody(event);
    const rawText = (body.text || "").trim();
    const incomingUserId = body.userId || "Anonymous";
    
    // Identify Client IP for robust rate limiting
    const clientIP = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1';

    if (!rawText) {
      throw createError({ statusCode: 400, statusMessage: "Message text is required" });
    }

    // Payload Size Limit
    if (rawText.length > MAX_MSG_LENGTH) {
      return {
        type: 'error',
        message: `Mensagem muito longa! O limite é de ${MAX_MSG_LENGTH} caracteres.`
      };
    }

    // Check Timeout based on IP
    const now = Date.now();
    const stats = userStats.get(clientIP) || { count: 0, lastReset: now, timeoutUntil: 0 };
    
    if (now < stats.timeoutUntil) {
      const remainingSeconds = Math.ceil((stats.timeoutUntil - now) / 1000);
      return {
        type: 'error',
        message: `Calma lá! Sua conexão está bloqueada por mais ${remainingSeconds} segundos.`,
        retryAfter: remainingSeconds
      };
    }

    // Update stats
    if (now - stats.lastReset > WINDOW_MS) {
      stats.count = 1;
      stats.lastReset = now;
    } else {
      stats.count++;
    }

    if (stats.count > MSG_LIMIT) {
      stats.timeoutUntil = now + TIMEOUT_MS;
      userStats.set(clientIP, stats);
      console.warn(`[Spam] IP Blocked: ${clientIP}`);
      return {
        type: 'error',
        message: `🚨 Spam detectado de sua conexão! Bloqueado por 15 segundos.`,
        retryAfter: 15
      };
    }
    userStats.set(clientIP, stats);

    // Robust XSS Sanitization
    const sanitizedText = rawText
      .replace(/<[^>]*>?/gm, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    if (sanitizedText.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "Invalid message content" });
    }

    const payload = {
      id: Date.now(),
      userId: incomingUserId,
      text: sanitizedText,
      timestamp: new Date().toISOString(),
    };

    messageHistory.push(payload);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }

    return {
      type: 'success',
      data: payload
    };
  }

  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
