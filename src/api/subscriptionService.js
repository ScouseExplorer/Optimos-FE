import { apiClient } from './client';

/** @typedef {import('../types/apiModels').Subscription} Subscription */
/** @typedef {import('../types/apiModels').UsageSummary} UsageSummary */
/** @typedef {import('../types/apiModels').Entitlements} Entitlements */

export const subscriptionService = {
  /** @returns {Promise<Subscription>} */
  async getMySubscription() {
    const result = await apiClient.get('/api/subscriptions/me');
    return result.data;
  },

  /** @returns {Promise<UsageSummary>} */
  async getUsageSummary() {
    const result = await apiClient.get('/api/subscriptions/usage');
    return result.data;
  },

  /** @returns {Promise<Entitlements>} */
  async getEntitlements() {
    const result = await apiClient.get('/api/subscriptions/entitlements');
    return result.data;
  },

  async upgradeTier(tier) {
    const result = await apiClient.post(`/api/subscriptions/upgrade/${tier}`);
    return result.data;
  },
};
