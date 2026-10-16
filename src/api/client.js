const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:8000';

/** @typedef {import('../types/apiModels').ApiErrorEnvelope} ApiErrorEnvelope */
/** @typedef {import('../types/apiModels').ApiResponse<any>} ApiResponse */
/**
 * @typedef {Object} RequestOptions
 * @property {string} [method]
 * @property {any} [body]
 * @property {Record<string, string>} [form]
 * @property {Record<string, string>} [headers]
 * @property {boolean} [auth]
 * @property {string} [idempotencyKey]
 * @property {boolean} [retryOnAuthFailure]
 * @property {boolean} [retryOnRateLimit]
 * @property {boolean} [hasRetriedRateLimit]
 */

const ACCESS_TOKEN_KEY = 'optimos_access_token';
const REFRESH_TOKEN_KEY = 'optimos_refresh_token';

const STATUS_MESSAGES = {
  401: 'Your session has expired. Please sign in again.',
  402: 'You have insufficient credits to complete this action.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource could not be found.',
  409: 'This action could not be completed due to a conflict.',
  422: 'Some fields need attention before this request can be processed.',
  429: 'Too many requests. Please wait and try again.',
  500: 'A server error occurred. Please try again shortly.',
};

let lastApiErrorContext = null;
let lastRateLimitContext = null;
const rateLimitSubscribers = new Set();
const rateLimitCooldownByRoute = new Map();

const DEFAULT_429_RETRY_MS = 5000;
const AUTO_RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const getStoredTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
});

const setStoredTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const parseJsonSafely = async response => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const extractFieldErrors = payload => {
  const rawDetail = payload?.detail;
  if (!Array.isArray(rawDetail)) {
    return null;
  }

  return rawDetail
    .filter(item => item && typeof item === 'object')
    .map(item => {
      const loc = Array.isArray(item.loc) ? item.loc.join('.') : item.loc || 'field';
      return {
        field: String(loc),
        message: item.msg || item.message || 'Invalid value',
        type: item.type || null,
      };
    });
};

const parseRetryAfterMs = retryAfter => {
  if (!retryAfter) return null;

  const asSeconds = Number(retryAfter);
  if (Number.isFinite(asSeconds)) {
    return Math.max(Math.floor(asSeconds * 1000), 0);
  }

  const parsedDate = Date.parse(retryAfter);
  if (!Number.isNaN(parsedDate)) {
    return Math.max(parsedDate - Date.now(), 0);
  }

  return null;
};

const getRouteCooldownKey = ({ method, path }) => `${String(method || 'GET').toUpperCase()} ${path}`;

const extractRateLimitHeaders = headers => ({
  limit: headers.get('X-RateLimit-Limit') || null,
  remaining: headers.get('X-RateLimit-Remaining') || null,
  window: headers.get('X-RateLimit-Window') || null,
  retryAfter: headers.get('Retry-After') || null,
  requestId: headers.get('X-Request-ID') || null,
});

const notifyRateLimitSubscribers = context => {
  rateLimitSubscribers.forEach(callback => {
    try {
      callback(context);
    } catch (callbackError) {
      console.error('[api] Rate-limit subscriber failed.', callbackError);
    }
  });
};

const isRateLimitedForRoute = routeKey => {
  const expiresAt = rateLimitCooldownByRoute.get(routeKey);
  if (!expiresAt) return null;

  const remainingMs = expiresAt - Date.now();
  if (remainingMs <= 0) {
    rateLimitCooldownByRoute.delete(routeKey);
    return null;
  }

  return remainingMs;
};

const wait = delayMs => new Promise(resolve => setTimeout(resolve, delayMs));

/** @param {{ response: Response, data: ApiErrorEnvelope | null }} param0 */
const buildApiError = ({ response, data }) => {
  const envelope = data?.error || null;
  const backendMessage = envelope?.message || data?.detail || '';
  const fallbackMessage = STATUS_MESSAGES[response.status] || `Request failed with status ${response.status}`;
  const message = backendMessage
    ? `${fallbackMessage} ${String(backendMessage).trim()}`
    : fallbackMessage;
  const requestId = envelope?.request_id || response.headers.get('X-Request-ID') || null;
  const fieldErrors = extractFieldErrors(data);

  const error = /** @type {any} */ (new Error(message));
  error.status = response.status;
  error.code = envelope?.code || `HTTP_${response.status}`;
  error.details = envelope?.details || data?.details || null;
  error.requestId = requestId;
  error.path = envelope?.path || null;
  error.timestamp = envelope?.timestamp || null;
  error.fieldErrors = fieldErrors;
  error.retryAfter = response.headers.get('Retry-After') || null;
  error.retryAfterMs = parseRetryAfterMs(error.retryAfter);
  error.rateLimit = extractRateLimitHeaders(response.headers);
  error.raw = data;

  lastApiErrorContext = {
    status: error.status,
    code: error.code,
    requestId,
    path: error.path,
    timestamp: error.timestamp,
  };

  if (requestId) {
    console.error(`[api] Request failed (${error.status}) request_id=${requestId}`, {
      code: error.code,
      path: error.path,
      details: error.details,
      fieldErrors: error.fieldErrors,
    });
  } else {
    console.error(`[api] Request failed (${error.status})`, {
      code: error.code,
      path: error.path,
      details: error.details,
      fieldErrors: error.fieldErrors,
    });
  }

  if (error.status === 429) {
    const cooldownMs = error.retryAfterMs ?? DEFAULT_429_RETRY_MS;
    lastRateLimitContext = {
      ...error.rateLimit,
      cooldownMs,
      status: error.status,
      path: error.path,
      message: error.message,
      timestamp: Date.now(),
    };

    notifyRateLimitSubscribers(lastRateLimitContext);
  }

  return error;
};

let refreshInFlight = null;

const refreshTokens = async currentRefreshToken => {
  const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Request-ID': getRequestId(),
    },
    body: JSON.stringify({ refresh_token: currentRefreshToken }),
  });

  const refreshData = await parseJsonSafely(refreshResponse);
  if (!refreshResponse.ok) {
    throw buildApiError({ response: refreshResponse, data: refreshData });
  }

  const nextAccess = refreshData?.access_token;
  const nextRefresh = refreshData?.refresh_token;
  if (!nextAccess || !nextRefresh) {
    throw new Error('Refresh response is missing new tokens.');
  }

  setStoredTokens({ accessToken: nextAccess, refreshToken: nextRefresh });
  return { accessToken: nextAccess, refreshToken: nextRefresh };
};

const ensureFreshAccessToken = async () => {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshTokens(refreshToken).finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
};

const buildUrl = path => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

/** @returns {Promise<ApiResponse>} */
const request = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    form,
    headers = {},
    auth = true,
    idempotencyKey,
    retryOnAuthFailure = true,
    retryOnRateLimit = true,
    hasRetriedRateLimit = false,
  } = /** @type {RequestOptions} */ (options);

  const routeKey = getRouteCooldownKey({ method, path });
  const activeCooldownMs = isRateLimitedForRoute(routeKey);
  if (activeCooldownMs) {
    const waitSeconds = Math.ceil(activeCooldownMs / 1000);
    const error = /** @type {any} */ (new Error(`Too many requests. Please wait ${waitSeconds}s before retrying this action.`));
    error.status = 429;
    error.code = 'HTTP_429';
    error.retryAfterMs = activeCooldownMs;
    error.retryAfter = String(waitSeconds);
    error.path = path;

    lastRateLimitContext = {
      ...(lastRateLimitContext || {}),
      cooldownMs: activeCooldownMs,
      status: 429,
      path,
      message: error.message,
      timestamp: Date.now(),
    };
    notifyRateLimitSubscribers(lastRateLimitContext);
    throw error;
  }

  const { accessToken } = getStoredTokens();
  const requestHeaders = /** @type {Record<string, string>} */ ({
    Accept: 'application/json',
    'X-Request-ID': getRequestId(),
    ...headers,
  });

  let payload;
  if (form) {
    payload = new URLSearchParams(form);
    requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  if (idempotencyKey) {
    requestHeaders['Idempotency-Key'] = idempotencyKey;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: payload,
  });

  const rateLimitHeaders = extractRateLimitHeaders(response.headers);
  lastRateLimitContext = {
    ...(lastRateLimitContext || {}),
    ...rateLimitHeaders,
    status: response.status,
    path,
    timestamp: Date.now(),
  };

  const data = await parseJsonSafely(response);

  if (response.status === 429) {
    const retryAfterMs = parseRetryAfterMs(rateLimitHeaders.retryAfter) ?? DEFAULT_429_RETRY_MS;
    rateLimitCooldownByRoute.set(routeKey, Date.now() + retryAfterMs);

    lastRateLimitContext = {
      ...lastRateLimitContext,
      cooldownMs: retryAfterMs,
      message: STATUS_MESSAGES[429],
    };
    notifyRateLimitSubscribers(lastRateLimitContext);

    const normalizedMethod = String(method || 'GET').toUpperCase();
    const isSafeToRetry = AUTO_RETRYABLE_METHODS.has(normalizedMethod) || Boolean(idempotencyKey);

    if (retryOnRateLimit && !hasRetriedRateLimit && isSafeToRetry) {
      await wait(retryAfterMs);
      return request(path, {
        method,
        body,
        form,
        headers,
        auth,
        idempotencyKey,
        retryOnAuthFailure,
        retryOnRateLimit,
        hasRetriedRateLimit: true,
      });
    }
  }

  if (response.status === 401 && auth && retryOnAuthFailure) {
    try {
      await ensureFreshAccessToken();
      return request(path, {
        method,
        body,
        form,
        headers,
        auth,
        idempotencyKey,
        retryOnAuthFailure: false,
        retryOnRateLimit,
        hasRetriedRateLimit,
      });
    } catch (error) {
      clearStoredTokens();
      throw error;
    }
  }

  if (!response.ok) {
    throw buildApiError({ response, data });
  }

  return {
    status: response.status,
    data,
    headers: response.headers,
  };
};

export const apiClient = {
  request,
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, options = {}) => request(path, { ...options, method: 'POST' }),
  patch: (path, options = {}) => request(path, { ...options, method: 'PATCH' }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  authStorage: {
    getStoredTokens,
    setStoredTokens,
    clearStoredTokens,
  },
  config: {
    API_BASE_URL,
  },
  diagnostics: {
    getLastApiErrorContext: () => lastApiErrorContext,
    getLastRateLimitContext: () => lastRateLimitContext,
  },
  rateLimit: {
    subscribe: callback => {
      if (typeof callback !== 'function') {
        return () => {};
      }

      rateLimitSubscribers.add(callback);
      return () => {
        rateLimitSubscribers.delete(callback);
      };
    },
  },
};
