import React from 'react';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { useCreditsData } from '../credits/useCreditsData';
import './credits.css';

const numberOrFallback = (value, fallback = 'N/A') => {
  return Number.isFinite(value) ? value.toLocaleString() : fallback;
};

const moneyOrFallback = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 'N/A';
  return `$${parsed.toFixed(2)}`;
};

export default function CreditsPage() {
  const {
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
  } = useCreditsData();

  const canGoBack = offset > 0;
  const canGoForward = offset + limit < totalTransactions;

  return (
    <InternalAppShell title="Credits" activeNav="credits">
      <main className="credits-page">
        <header className="credits-hero">
          <p className="credits-kicker">Wallet and billing</p>
          <h1>Track credits and feature costs</h1>
          <p>
            Monitor your current balance, transaction activity, and the credit cost of each premium action.
          </p>
        </header>

        {error && (
          <div className="credits-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={refresh}>Retry</button>
          </div>
        )}

        <section className="credits-summary" aria-label="Credits summary">
          <article>
            <h2>Current balance</h2>
            <p className="summary-number">{isLoading ? 'Loading...' : numberOrFallback(creditsBalance)}</p>
          </article>

          <article>
            <h2>Total transactions</h2>
            <p className="summary-number">{isLoading ? 'Loading...' : numberOrFallback(totalTransactions, '0')}</p>
          </article>
        </section>

        <section className="credits-panel" aria-label="Feature costs">
          <div className="credits-panel__head">
            <h2>Feature cost table</h2>
          </div>

          {isLoading && <p className="credits-muted">Loading feature costs...</p>}
          {!isLoading && featureCosts.length === 0 && <p className="credits-muted">No feature costs available yet.</p>}

          {!isLoading && featureCosts.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Cost</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {featureCosts.map((row, index) => (
                    <tr key={`${row?.feature || row?.name || 'feature'}_${index}`}>
                      <td>{row?.feature || row?.name || 'Unknown feature'}</td>
                      <td>{numberOrFallback(Number(row?.credits_cost ?? row?.cost ?? row?.credits), 'N/A')}</td>
                      <td>{row?.unit || row?.per || 'per action'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="credits-panel" aria-label="Transaction ledger">
          <div className="credits-panel__head">
            <h2>Transaction ledger</h2>
            <button type="button" onClick={refresh} disabled={isLoading || isPageLoading}>Refresh</button>
          </div>

          {isLoading && <p className="credits-muted">Loading transactions...</p>}
          {!isLoading && transactions.length === 0 && <p className="credits-muted">No transactions found.</p>}

          {!isLoading && transactions.length > 0 && (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Balance after</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={`${tx?.id || tx?.transaction_id || 'tx'}_${index}`}>
                        <td>{tx?.created_at ? new Date(tx.created_at).toLocaleString() : 'Unknown'}</td>
                        <td>{tx?.type || tx?.category || 'n/a'}</td>
                        <td>{tx?.description || tx?.reason || '—'}</td>
                        <td>{moneyOrFallback(tx?.amount)}</td>
                        <td>{numberOrFallback(Number(tx?.balance_after ?? tx?.balance), 'N/A')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="credits-pagination">
                <button
                  type="button"
                  onClick={() => loadTransactionsPage({ nextLimit: limit, nextOffset: Math.max(offset - limit, 0), withLoader: true })}
                  disabled={!canGoBack || isPageLoading}
                >
                  Previous
                </button>
                <span>
                  Showing {transactions.length} of {totalTransactions}
                </span>
                <button
                  type="button"
                  onClick={() => loadTransactionsPage({ nextLimit: limit, nextOffset: offset + limit, withLoader: true })}
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
