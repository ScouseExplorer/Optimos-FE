import { useCallback, useEffect, useState } from 'react';

export function useResourceCrud({ listFn, createFn, updateFn, deleteFn }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [error, setError] = useState('');

  const loadPage = useCallback(async ({ nextLimit = limit, nextOffset = offset, withLoader = true } = {}) => {
    if (withLoader) setIsPageLoading(true);

    try {
      const page = await listFn({ limit: nextLimit, offset: nextOffset });
      setItems(page.items);
      setTotal(page.total);
      setLimit(page.limit);
      setOffset(page.offset);
    } finally {
      if (withLoader) setIsPageLoading(false);
    }
  }, [limit, listFn, offset]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      await loadPage({ nextLimit: limit, nextOffset: 0, withLoader: false });
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load data right now.');
    } finally {
      setIsLoading(false);
    }
  }, [limit, loadPage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createItem = useCallback(async payload => {
    setIsSaving(true);
    setError('');

    try {
      await createFn(payload);
      await loadPage({ nextLimit: limit, nextOffset: 0, withLoader: false });
    } catch (saveError) {
      setError(saveError?.message || 'Unable to create item right now.');
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [createFn, limit, loadPage]);

  const updateItem = useCallback(async (id, payload) => {
    setIsSaving(true);
    setError('');

    try {
      await updateFn(id, payload);
      await loadPage({ nextLimit: limit, nextOffset: offset, withLoader: false });
    } catch (saveError) {
      setError(saveError?.message || 'Unable to update item right now.');
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }, [limit, loadPage, offset, updateFn]);

  const deleteItem = useCallback(async id => {
    setIsDeletingId(id);
    setError('');

    try {
      await deleteFn(id);
      await loadPage({ nextLimit: limit, nextOffset: offset, withLoader: false });
    } catch (deleteError) {
      setError(deleteError?.message || 'Unable to delete item right now.');
      throw deleteError;
    } finally {
      setIsDeletingId(null);
    }
  }, [deleteFn, limit, loadPage, offset]);

  return {
    items,
    total,
    limit,
    offset,
    isLoading,
    isPageLoading,
    isSaving,
    isDeletingId,
    error,
    refresh,
    loadPage,
    createItem,
    updateItem,
    deleteItem,
  };
}
