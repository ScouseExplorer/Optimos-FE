import { apiClient } from './client';

/** @typedef {import('../types/apiModels').ChatHistory} ChatHistory */
/** @typedef {import('../types/apiModels').ChatResponse} ChatResponse */

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

export const chatService = {
  /** @returns {Promise<ChatHistory>} */
  async listChats({ limit = 20, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(toPositiveInt(limit, 20), 1), 100);
    const safeOffset = Math.max(toPositiveInt(offset, 0), 0);
    const result = await apiClient.get(`/api/chats?limit=${safeLimit}&offset=${safeOffset}`);

    const payload = result.data || {};
    return {
      chats: Array.isArray(payload.chats) ? payload.chats : [],
      total: Number(payload.total) || 0,
      limit: Number(payload.limit) || safeLimit,
      offset: Number(payload.offset) || safeOffset,
    };
  },

  /** @returns {Promise<ChatResponse>} */
  async createChat({ userMessage, idempotencyKey }) {
    const result = await apiClient.post('/api/chats', {
      body: { user_message: userMessage },
      idempotencyKey,
    });

    return result.data;
  },

  async deleteChat(chatId) {
    await apiClient.delete(`/api/chats/${chatId}`);
  },

  async clearChats() {
    await apiClient.delete('/api/chats');
  },
};
