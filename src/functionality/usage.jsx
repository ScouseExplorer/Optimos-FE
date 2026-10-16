import React from 'react';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { useUsageData } from '../usage/useUsageData';
import './usage.css';

const numberOrDash = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : '—';
};

const moneyOrDash = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? `$${parsed.toFixed(2)}` : '—';
};

export default function UsagePage() {
  const {
    items,
    total,
    limit,
    offset,
    isLoading,
    isPageLoading,
    error,
    refresh,
    loadPage,
  } = useUsageData(15);

  const canGoBack = offset > 0;
  const canGoForward = offset + limit < total;

  return (
    <InternalAppShell title="Usage" activeNav="usage">
      <main className="usage-page">
        <header className="usage-hero">
          <p className="usage-kicker">AI metering</p>
          <h1>Review AI usage history</h1>
          <p>
            Track each generation with status, token count, estimated cost, credits charged, and timestamp.
          </p>
        </header>

        {error && (
          <div className="usage-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={refresh}>Retry</button>
          </div>
        )}

        <section className="usage-panel" aria-label="AI usage history">
          <div className="usage-panel__head">
            <h2>Usage history</h2>
            <button type="button" onClick={refresh} disabled={isLoading || isPageLoading}>Refresh</button>
          </div>

          {isLoading && <p className="usage-muted">Loading usage history...</p>}
          {!isLoading && items.length === 0 && <p className="usage-muted">No usage entries found yet.</p>}

          {!isLoading && items.length > 0 && (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Tokens</th>
                      <th>Estimated cost</th>
                      <th>Credits charged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((entry, index) => (
                      <tr key={`${entry?.id || entry?.usage_id || 'usage'}_${index}`}>
                        <td>{entry?.created_at ? new Date(entry.created_at).toLocaleString() : 'Unknown'}</td>
                        <td>{entry?.status || 'n/a'}</td>
                        <td>{numberOrDash(entry?.tokens_used ?? entry?.tokens)}</td>
                        <td>{moneyOrDash(entry?.estimated_cost ?? entry?.cost_estimate)}</td>
                        <td>{numberOrDash(entry?.credits_charged)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="usage-pagination">
                <button
                  type="button"
                  onClick={() => loadPage({ nextLimit: limit, nextOffset: Math.max(offset - limit, 0), withLoader: true })}
                  disabled={!canGoBack || isPageLoading}
                >
                  Previous
                </button>
                <span>
                  Showing {items.length} of {total}
                </span>
                <button
                  type="button"
                  onClick={() => loadPage({ nextLimit: limit, nextOffset: offset + limit, withLoader: true })}
                  disabled={!canGoForward || isPageLoading}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </InternalAppShell>
  );
}
