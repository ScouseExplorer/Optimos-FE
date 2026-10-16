import { apiClient } from './client';

export const adminService = {
  async getStats() {
    const result = await apiClient.get('/api/admin/stats');
    return result.data || {};
  },

  async getUsers() {
    const result = await apiClient.get('/api/admin/users');
    const payload = result.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.users)) return payload.users;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  },

  async getChatStats(days = 7) {
    const safeDays = Math.max(Number(days) || 7, 1);
    const result = await apiClient.get(`/api/admin/chat-stats?days=${safeDays}`);
    return result.data || {};
  },

  async adjustCredits(payload) {
    const result = await apiClient.post('/api/credits/admin/adjust', {
      body: payload,
    });
    return result.data;
  },
};
