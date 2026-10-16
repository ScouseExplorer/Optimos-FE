import { apiClient } from './client';

/** @typedef {import('../types/apiModels').User} User */
/** @typedef {import('../types/apiModels').Profile} Profile */
/** @typedef {import('../types/apiModels').NotificationPreferences} NotificationPreferences */
/** @typedef {import('../types/apiModels').SecuritySettings} SecuritySettings */

export const userService = {
  /** @returns {Promise<User>} */
  async getMe() {
    const result = await apiClient.get('/api/users/me');
    return result.data;
  },

  /** @returns {Promise<Profile>} */
  async getMyProfile() {
    const result = await apiClient.get('/api/users/me/profile');
    return result.data;
  },

  /** @param {Profile} payload */
  async updateMyProfile(payload) {
    const result = await apiClient.patch('/api/users/me/profile', {
      body: payload,
    });
    return result.data;
  },

  /** @returns {Promise<NotificationPreferences>} */
  async getMyNotifications() {
    const result = await apiClient.get('/api/users/me/notifications');
    return result.data;
  },

  /** @param {NotificationPreferences} payload */
  async updateMyNotifications(payload) {
    const result = await apiClient.patch('/api/users/me/notifications', {
      body: payload,
    });
    return result.data;
  },

  /** @returns {Promise<SecuritySettings>} */
  async getMySecurity() {
    const result = await apiClient.get('/api/users/me/security');
    return result.data;
  },

  /** @param {SecuritySettings} payload */
  async updateMySecurity(payload) {
    const result = await apiClient.patch('/api/users/me/security', {
      body: payload,
    });
    return result.data;
  },
};
