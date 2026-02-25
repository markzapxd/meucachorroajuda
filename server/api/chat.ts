const messageHistory: any[] = [];
const MAX_HISTORY = 100;

// Spam Protection Config
const userStats = new Map<string, { count: number, lastReset: number, timeoutUntil: number }>();
const MSG_LIMIT = 5;
const WINDOW_MS = 10000; // 5 messages per 10 seconds
const TIMEOUT_MS = 15000; // 15 seconds timeout

const MAX_MSG_LENGTH = 100;

export default defineWebSocketHandler({
  open(peer) {
    // Basic Origin Validation (CSWH Protection)
    const url = (peer as any).url || "";
    const headers = (peer as any).headers || {};
    const origin = headers.origin || "";
    const host = headers.host || "";

    // In a real environment, you'd strictly match against your domain
    if (origin && !origin.includes(host)) {
      console.warn(`[ws] Blocked connection from unauthorized origin: ${origin}`);
      peer.close(4003, "Forbidden Origin");
      return;
    }

    peer.subscribe("chat");
    
    if (messageHistory.length > 0) {
      peer.send(JSON.stringify({
        type: 'history',
        messages: messageHistory
      }));
    }
  },

  message(peer, message) {
    let rawText = "";
    let incomingUserId = "Anonymous";

    try {
      const data = JSON.parse(message.text());
      rawText = data.text || "";
      incomingUserId = data.userId || peer.id.slice(0, 8);
    } catch (e) {
      rawText = message.text();
      incomingUserId = peer.id.slice(0, 8);
    }

    if (!rawText) return;

    // Payload Size Limit
    if (rawText.length > MAX_MSG_LENGTH) {
      peer.send(JSON.stringify({
        type: 'message',
        data: {
          id: Date.now(),
          userId: 'System',
          text: `Mensagem muito longa! O limite é de ${MAX_MSG_LENGTH} caracteres.`,
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      }));
      return;
    }

    // Check Timeout
    const now = Date.now();
    const stats = userStats.get(incomingUserId) || { count: 0, lastReset: now, timeoutUntil: 0 };
    
    if (now < stats.timeoutUntil) {
      const remainingSeconds = Math.ceil((stats.timeoutUntil - now) / 1000);
      peer.send(JSON.stringify({
        type: 'message',
        data: {
          id: now,
          userId: 'System',
          text: `Calma lá! Você está enviando mensagens muito rápido. Aguarde ${remainingSeconds} segundos.`,
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      }));
      return;
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
      userStats.set(incomingUserId, stats);
      peer.send(JSON.stringify({
        type: 'message',
        data: {
          id: now,
          userId: 'System',
          text: `🚨 Spam detectado! Você parou no "gancho" por 15 segundos.`,
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      }));
      return;
    }
    userStats.set(incomingUserId, stats);

    // Robust XSS Sanitization (Strip tags and normalize whitespace)
    const sanitizedText = rawText
      .replace(/<[^>]*>?/gm, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .trim();

    if (sanitizedText.length === 0) return;

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

    const broadcastPayload = JSON.stringify({
      type: 'message',
      data: payload
    });

    peer.publish("chat", broadcastPayload);
    peer.send(broadcastPayload);
  },

  close(peer) {
    console.log("[ws] closed", peer.id);
  },

  error(peer, error) {
    console.warn("[ws] error", peer.id, error);
  },
});
