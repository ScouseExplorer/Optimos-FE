import { useCallback, useEffect, useMemo, useState } from 'react';
import { subscriptionService } from '../api/subscriptionService';

const FEATURE_ALIASES = {
  ai_chat: ['ai_chat', 'chat', 'ai_generation'],
  content_scheduler: ['content_scheduler', 'scheduler', 'content_scheduler_access'],
  advanced_analytics: ['advanced_analytics', 'analytics', 'analytics_dashboard'],
};

const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeTier = (value) => {
  if (!value || typeof value !== 'string') return 'free';
  const lowered = value.toLowerCase();
  if (['free', 'pro', 'enterprise'].includes(lowered)) {
    return lowered;
  }
  return lowered;
};

const buildFeatureMap = (entitlements) => {
  const map = {};

  if (Array.isArray(entitlements?.available_features)) {
    entitlements.available_features.forEach((feature) => {
      if (typeof feature === 'string') {
        map[feature] = true;
      }
    });
  }

  if (Array.isArray(entitlements?.disabled_features)) {
    entitlements.disabled_features.forEach((feature) => {
      if (typeof feature === 'string') {
        map[feature] = false;
      }
    });
  }

  const sources = [entitlements?.features, entitlements?.entitlements];
  sources.forEach((source) => {
    if (!source || typeof source !== 'object') return;

    Object.entries(source).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        map[key] = value;
      }
    });
  });

  return map;
};

const readFeatureValue = (featureMap, featureKey) => {
  if (!featureKey) return true;
  if (Object.prototype.hasOwnProperty.call(featureMap, featureKey)) {
    return Boolean(featureMap[featureKey]);
  }

  const aliases = FEATURE_ALIASES[featureKey] || [featureKey];
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(featureMap, alias)) {
      return Boolean(featureMap[alias]);
    }
  }

  return true;
};

export function useSubscriptionData() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpgradingTier, setIsUpgradingTier] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [subscriptionData, usageData, entitlementsData] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getUsageSummary(),
        subscriptionService.getEntitlements(),
      ]);

      setSubscription(subscriptionData || null);
      setUsage(usageData || null);
      setEntitlements(entitlementsData || null);
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load subscription details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const featureMap = useMemo(() => buildFeatureMap(entitlements), [entitlements]);

  const tier = useMemo(() => {
    return normalizeTier(subscription?.tier || entitlements?.tier || usage?.tier || 'free');
  }, [entitlements?.tier, subscription?.tier, usage?.tier]);

  const creditsBalance = useMemo(() => {
    return (
      asNumber(usage?.credits_balance) ??
      asNumber(entitlements?.credits_balance) ??
      asNumber(subscription?.credits_balance)
    );
  }, [entitlements?.credits_balance, subscription?.credits_balance, usage?.credits_balance]);

  const usageSummary = useMemo(() => {
    const remaining =
      asNumber(usage?.messages_remaining) ??
      asNumber(usage?.remaining) ??
      asNumber(entitlements?.messages_remaining);
    const limit =
      asNumber(usage?.monthly_limit) ??
      asNumber(usage?.limit) ??
      asNumber(entitlements?.monthly_limit);

    return {
      remaining,
      limit,
    };
  }, [entitlements?.messages_remaining, entitlements?.monthly_limit, usage?.limit, usage?.messages_remaining, usage?.monthly_limit, usage?.remaining]);

  const canUseFeature = useCallback((featureKey) => readFeatureValue(featureMap, featureKey), [featureMap]);

  const upgradeTier = useCallback(async (nextTier) => {
    setIsUpgradingTier(nextTier);
    setError('');

    try {
      await subscriptionService.upgradeTier(nextTier);
      await refresh();
    } catch (upgradeError) {
      setError(upgradeError?.message || 'Unable to upgrade your plan right now.');
      throw upgradeError;
    } finally {
      setIsUpgradingTier('');
    }
  }, [refresh]);

  return {
    subscription,
    usage,
    entitlements,
    tier,
    creditsBalance,
    usageSummary,
    isLoading,
    error,
    refresh,
    upgradeTier,
    isUpgradingTier,
    canUseFeature,
  };
}
