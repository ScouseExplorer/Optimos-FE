import React from 'react';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { useSubscriptionData } from '../subscription/useSubscriptionData';
import './subscription.css';

const UPGRADE_TIERS = [
  { key: 'free', label: 'Free', description: 'Starter capabilities for getting started.' },
  { key: 'pro', label: 'Pro', description: 'Unlock premium growth and AI workflows.' },
  { key: 'enterprise', label: 'Enterprise', description: 'Highest limits and enterprise capabilities.' },
];

function formatMaybeNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString() : 'N/A';
}

export default function SubscriptionPage() {
  const {
    tier,
    creditsBalance,
    usageSummary,
    isLoading,
    error,
    refresh,
    upgradeTier,
    isUpgradingTier,
    canUseFeature,
  } = useSubscriptionData();

  return (
    <InternalAppShell title="Subscription" activeNav="subscription">
      <main className="subscription-page">
        <header className="subscription-hero">
          <p className="subscription-kicker">Plan and entitlements</p>
          <h1>Control your workspace limits</h1>
          <p>
            Your backend subscription and entitlement response drives what is available in the UI.
          </p>
        </header>

        {error && (
          <div className="subscription-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={refresh}>Retry</button>
          </div>
        )}

        <section className="subscription-summary" aria-label="Plan summary">
          <article>
            <h2>Current tier</h2>
            <p className="summary-value summary-value--tier">{tier}</p>
          </article>

          <article>
            <h2>Credits balance</h2>
            <p className="summary-value">{isLoading ? 'Loading...' : formatMaybeNumber(creditsBalance)}</p>
          </article>

          <article>
            <h2>Usage remaining</h2>
            <p className="summary-value">
              {isLoading
                ? 'Loading...'
                : `${formatMaybeNumber(usageSummary.remaining)} / ${formatMaybeNumber(usageSummary.limit)}`}
            </p>
          </article>
        </section>

        <section className="subscription-plans" aria-label="Upgrade plans">
          {UPGRADE_TIERS.map((plan) => {
            const isCurrent = tier === plan.key;
            const isUpgrading = isUpgradingTier === plan.key;

            return (
              <article key={plan.key} className={`plan-card${isCurrent ? ' plan-card--current' : ''}`}>
                <div className="plan-card__header">
                  <h3>{plan.label}</h3>
                  {isCurrent && <span>Current</span>}
                </div>
                <p>{plan.description}</p>

                <button
                  type="button"
                  disabled={isLoading || isCurrent || Boolean(isUpgradingTier)}
                  onClick={() => upgradeTier(plan.key)}
                >
                  {isUpgrading ? 'Upgrading...' : isCurrent ? 'Active plan' : `Upgrade to ${plan.label}`}
                </button>
              </article>
            );
          })}
        </section>

        <section className="subscription-entitlements" aria-label="Feature access">
          <h2>Feature access from entitlements</h2>
          <div className="entitlements-grid">
            <article>
              <h3>AI chat</h3>
              <p>{canUseFeature('ai_chat') ? 'Enabled' : 'Locked'}</p>
            </article>
            <article>
              <h3>Content scheduler</h3>
              <p>{canUseFeature('content_scheduler') ? 'Enabled' : 'Locked'}</p>
            </article>
            <article>
              <h3>Advanced analytics</h3>
              <p>{canUseFeature('advanced_analytics') ? 'Enabled' : 'Locked'}</p>
            </article>
          </div>
        </section>
      </main>
    </InternalAppShell>
  );
}
