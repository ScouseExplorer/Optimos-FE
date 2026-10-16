import { apiClient } from './client';

const HEALTH_ENDPOINTS = [
  { key: 'root', label: 'API root', path: '/' },
  { key: 'health', label: 'Health', path: '/health' },
  { key: 'live', label: 'Liveness', path: '/health/live' },
  { key: 'ready', label: 'Readiness', path: '/health/ready' },
];

const normalizeDetail = payload => {
  if (!payload) return 'No payload';
  if (typeof payload === 'string') return payload;
  if (typeof payload?.status === 'string') return payload.status;
  if (typeof payload?.detail === 'string') return payload.detail;
  if (typeof payload?.message === 'string') return payload.message;
  return 'OK';
};

const checkEndpoint = async endpoint => {
  const startedAt = Date.now();
  try {
    const result = await apiClient.get(endpoint.path, { auth: false });
    const durationMs = Date.now() - startedAt;

    return {
      ...endpoint,
      ok: true,
      status: result?.status || 200,
      detail: normalizeDetail(result?.data),
      durationMs,
      raw: result?.data || null,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    return {
      ...endpoint,
      ok: false,
      status: error?.status || null,
      detail: error?.message || 'Request failed',
      durationMs,
      raw: error?.raw || null,
    };
  }
};

export const healthService = {
  endpoints: HEALTH_ENDPOINTS,

  async checkAll() {
    const checks = await Promise.all(HEALTH_ENDPOINTS.map(checkEndpoint));
    const healthyCount = checks.filter(check => check.ok).length;
    const total = checks.length;

    let overall = 'offline';
    if (healthyCount === total) {
      overall = 'healthy';
    } else if (healthyCount > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      healthyCount,
      total,
      checks,
      checkedAt: new Date().toISOString(),
    };
  },
};