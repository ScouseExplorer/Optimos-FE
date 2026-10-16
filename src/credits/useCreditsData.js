import { useCallback, useEffect, useMemo, useState } from 'react';
import { creditsService } from '../api/creditsService';

const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function useCreditsData() {
  const [wallet, setWallet] = useState(null);
  const [featureCosts, setFeatureCosts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTransactionsPage = useCallback(async ({ nextLimit = limit, nextOffset = offset, withLoader = true } = {}) => {
    if (withLoader) {
      setIsPageLoading(true);
    }

    try {
      const transactionData = await creditsService.getTransactions({
        limit: nextLimit,
        offset: nextOffset,
      });

      setTransactions(transactionData.items);
      setTotalTransactions(transactionData.total);
      setLimit(transactionData.limit);
      setOffset(transactionData.offset);
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
      const [walletData, costsData] = await Promise.all([
        creditsService.getWallet(),
        creditsService.getFeatureCosts(),
      ]);

      setWallet(walletData || null);
      setFeatureCosts(costsData || []);
      await loadTransactionsPage({ nextLimit: limit, nextOffset: 0, withLoader: false });
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load credits data right now.');
    } finally {
      setIsLoading(false);
    }
  }, [limit, loadTransactionsPage]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const creditsBalance = useMemo(() => {
    return (
      asNumber(wallet?.credits_balance) ??
      asNumber(wallet?.balance) ??
      asNumber(wallet?.credits)
    );
  }, [wallet?.balance, wallet?.credits, wallet?.credits_balance]);

  return {
    wallet,
    creditsBalance,
    featureCosts,
    transactions,
    totalTransactions,
    limit,
    offset,
    isLoading,
    isPageLoading,
    error,
    refresh,
    loadTransactionsPage,
  };
}
