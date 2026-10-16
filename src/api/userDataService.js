import { apiClient } from './client';

/** @typedef {import('../types/apiModels').Experience} Experience */
/** @typedef {import('../types/apiModels').Opinion} Opinion */
/** @typedef {import('../types/apiModels').UserPost} UserPost */
/** @typedef {import('../types/apiModels').PaginatedResponse<Experience>} ExperiencePage */
/** @typedef {import('../types/apiModels').PaginatedResponse<Opinion>} OpinionPage */
/** @typedef {import('../types/apiModels').PaginatedResponse<UserPost>} UserPostPage */

const toSafeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePage = (payload, fallbackLimit, fallbackOffset) => ({
  items: Array.isArray(payload?.items) ? payload.items : [],
  total: toSafeNumber(payload?.total, 0),
  limit: toSafeNumber(payload?.limit, fallbackLimit),
  offset: toSafeNumber(payload?.offset, fallbackOffset),
});

const listResource = async (path, { limit = 10, offset = 0 } = {}) => {
  const safeLimit = Math.min(Math.max(toSafeNumber(limit, 10), 1), 100);
  const safeOffset = Math.max(toSafeNumber(offset, 0), 0);

  const result = await apiClient.get(`${path}?limit=${safeLimit}&offset=${safeOffset}`);
  return normalizePage(result.data || {}, safeLimit, safeOffset);
};

const createResource = async (path, payload) => {
  const result = await apiClient.post(path, { body: payload });
  return result.data;
};

const updateResource = async (path, id, payload) => {
  const result = await apiClient.patch(`${path}/${id}`, { body: payload });
  return result.data;
};

const deleteResource = async (path, id) => {
  await apiClient.delete(`${path}/${id}`);
};

export const userDataService = {
  /** @returns {Promise<ExperiencePage>} */
  listExperiences: options => listResource('/api/experiences', options),
  /** @param {Experience} payload */
  createExperience: payload => createResource('/api/experiences', payload),
  /** @param {string|number} id @param {Experience} payload */
  updateExperience: (id, payload) => updateResource('/api/experiences', id, payload),
  deleteExperience: id => deleteResource('/api/experiences', id),

  /** @returns {Promise<OpinionPage>} */
  listOpinions: options => listResource('/api/opinions', options),
  /** @param {Opinion} payload */
  createOpinion: payload => createResource('/api/opinions', payload),
  /** @param {string|number} id @param {Opinion} payload */
  updateOpinion: (id, payload) => updateResource('/api/opinions', id, payload),
  deleteOpinion: id => deleteResource('/api/opinions', id),

  /** @returns {Promise<UserPostPage>} */
  listPosts: options => listResource('/api/posts', options),
  /** @param {UserPost} payload */
  createPost: payload => createResource('/api/posts', payload),
  /** @param {string|number} id @param {UserPost} payload */
  updatePost: (id, payload) => updateResource('/api/posts', id, payload),
  deletePost: id => deleteResource('/api/posts', id),
};
