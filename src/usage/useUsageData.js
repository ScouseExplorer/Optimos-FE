import { useCallback, useEffect, useState } from 'react';
import { usageService } from '../api/usageService';

export function useUsageData(initialLimit = 15) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPage = useCallback(async ({ nextLimit = limit, nextOffset = offset, withLoader = true } = {}) => {
    if (withLoader) {
      setIsPageLoading(true);
    }

    try {
      const payload = await usageService.getMyUsage({
        limit: nextLimit,
        offset: nextOffset,
      });

      setItems(payload.items);
      setTotal(payload.total);
      setLimit(payload.limit);
      setOffset(payload.offset);
    } finally {
      if (withLoader) {
        setIsPageLoading(false);
      }
    }
  }, [limit, offset]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      await loadPage({ nextLimit: limit, nextOffset: 0, withLoader: false });
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load usage logs right now.');
    } finally {
      setIsLoading(false);
    }
  }, [limit, loadPage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    items,
    total,
    limit,
    offset,
    isLoading,
    isPageLoading,
    error,
    refresh,
    loadPage,
  };
}
