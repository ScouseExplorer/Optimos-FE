import { apiClient } from './client';

/** @typedef {import('../types/apiModels').CreditWallet} CreditWallet */
/** @typedef {import('../types/apiModels').CreditTransaction} CreditTransaction */
/** @typedef {import('../types/apiModels').FeatureCost} FeatureCost */
/** @typedef {import('../types/apiModels').PaginatedResponse<CreditTransaction>} CreditTransactionPage */

const normalizePagination = ({ payload, fallbackLimit, fallbackOffset }) => {
  const limit = Number(payload?.limit);
  const offset = Number(payload?.offset);

  return {
    limit: Number.isFinite(limit) ? limit : fallbackLimit,
    offset: Number.isFinite(offset) ? offset : fallbackOffset,
  };
};

export const creditsService = {
  /** @returns {Promise<CreditWallet|null>} */
  async getWallet() {
    const result = await apiClient.get('/api/credits/wallet');
    return result.data || null;
  },

  /** @returns {Promise<CreditTransactionPage>} */
  async getTransactions({ limit = 20, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const result = await apiClient.get(`/api/credits/transactions?limit=${safeLimit}&offset=${safeOffset}`);
    const payload = result.data || {};
    const pagination = normalizePagination({
      payload,
      fallbackLimit: safeLimit,
      fallbackOffset: safeOffset,
    });

    return {
      items: Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload.transactions)
          ? payload.transactions
          : [],
      total: Number(payload.total) || 0,
      limit: pagination.limit,
      offset: pagination.offset,
    };
  },

  /** @returns {Promise<FeatureCost[]>} */
  async getFeatureCosts() {
    const result = await apiClient.get('/api/credits/feature-costs');
    const payload = result.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload?.costs)) {
      return payload.costs;
    }

    return [];
  },
};
