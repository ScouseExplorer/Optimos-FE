import { apiClient } from './client';

/** @typedef {import('../types/apiModels').AIUsage} AIUsage */
/** @typedef {import('../types/apiModels').PaginatedResponse<AIUsage>} AIUsagePage */

export const usageService = {
  /** @returns {Promise<AIUsagePage>} */
  async getMyUsage({ limit = 20, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const result = await apiClient.get(`/api/usage/me?limit=${safeLimit}&offset=${safeOffset}`);
    const payload = result.data || {};

    return {
      items: Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload.usage)
          ? payload.usage
          : [],
      total: Number(payload.total) || 0,
      limit: Number.isFinite(Number(payload.limit)) ? Number(payload.limit) : safeLimit,
      offset: Number.isFinite(Number(payload.offset)) ? Number(payload.offset) : safeOffset,
    };
  },
};
