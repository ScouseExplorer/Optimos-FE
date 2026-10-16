import { apiClient } from './client';

export const authService = {
  async register({ email, username, password }) {
    const result = await apiClient.post('/api/auth/register', {
      auth: false,
      body: { email, username, password },
    });

    return result.data;
  },

  async login({ username, password }) {
    const result = await apiClient.post('/api/auth/login', {
      auth: false,
      form: { username, password },
    });

    const payload = result.data || {};
    if (!payload.access_token || !payload.refresh_token) {
      throw new Error('Login succeeded but token payload is invalid.');
    }

    apiClient.authStorage.setStoredTokens({
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
    });

    return payload;
  },

  async refresh(refreshToken) {
    const result = await apiClient.post('/api/auth/refresh', {
      auth: false,
      body: { refresh_token: refreshToken },
    });

    const payload = result.data || {};
    if (!payload.access_token || !payload.refresh_token) {
      throw new Error('Refresh succeeded but token payload is invalid.');
    }

    apiClient.authStorage.setStoredTokens({
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
    });

    return payload;
  },

  async logout() {
    const { refreshToken } = apiClient.authStorage.getStoredTokens();

    try {
      await apiClient.post('/api/auth/logout', {
        body: refreshToken ? { refresh_token: refreshToken } : undefined,
      });
    } finally {
      apiClient.authStorage.clearStoredTokens();
    }
  },
};
