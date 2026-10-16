import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../api/adminService';
import { useAuth } from '../auth/AuthContext';
import './admindashboard.css';

const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMaybeNumber = value => {
  const parsed = toNumber(value);
  return parsed === null ? 'N/A' : parsed.toLocaleString();
};

function NotAuthorizedBlock() {
  return (
    <div className="admin-page__blocked" role="alert">
      <h2>Admin Access Required</h2>
      <p>Your account is authenticated, but does not have admin permissions.</p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatStats, setChatStats] = useState(null);
  const [days, setDays] = useState(7);

  const [adjustPayload, setAdjustPayload] = useState({
    user_id: '',
    amount: '',
    reason: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleForbidden = useCallback(() => {
    navigate('/not-authorized', { replace: true });
  }, [navigate]);

  const loadAdminData = useCallback(async (chatDays = days) => {
    setIsLoading(true);
    setError('');

    try {
      const [nextStats, nextUsers, nextChatStats] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getChatStats(chatDays),
      ]);

      setStats(nextStats);
      setUsers(nextUsers);
      setChatStats(nextChatStats);
    } catch (loadError) {
      if (loadError?.status === 403) {
        handleForbidden();
        return;
      }
      setError(loadError?.message || 'Unable to load admin data right now.');
    } finally {
      setIsLoading(false);
    }
  }, [days, handleForbidden]);

  useEffect(() => {
    loadAdminData(days);
  }, [days, loadAdminData]);

  const onAdjustField = (field, value) => {
    setAdjustPayload(previous => ({
      ...previous,
      [field]: value,
    }));
  };

  const onSubmitAdjustment = async event => {
    event.preventDefault();
    setError('');
    setInfo('');

    const numericAmount = Number(adjustPayload.amount);
    if (!adjustPayload.user_id.trim() || !Number.isFinite(numericAmount) || !adjustPayload.reason.trim()) {
      setError('Provide user_id, numeric amount, and reason before submitting.');
      return;
    }

    setIsAdjusting(true);

    try {
      await adminService.adjustCredits({
        user_id: adjustPayload.user_id.trim(),
        amount: numericAmount,
        reason: adjustPayload.reason.trim(),
      });

      setInfo('Credit adjustment submitted successfully.');
      setAdjustPayload({ user_id: '', amount: '', reason: '' });
      await loadAdminData(days);
    } catch (adjustError) {
      if (adjustError?.status === 403) {
        handleForbidden();
        return;
      }
      setError(adjustError?.message || 'Unable to submit credit adjustment.');
    } finally {
      setIsAdjusting(false);
    }
  };

  const summaryCards = useMemo(() => {
    return [
      {
        label: 'Total users',
        value: formatMaybeNumber(stats?.total_users || stats?.users_total || stats?.users_count),
      },
      {
        label: 'Total chats',
        value: formatMaybeNumber(chatStats?.total_chats || chatStats?.chats_total),
      },
      {
        label: 'Avg chats/day',
        value: formatMaybeNumber(chatStats?.avg_chats_per_day || chatStats?.average_chats_per_day),
      },
      {
        label: 'Credits adjusted',
        value: formatMaybeNumber(stats?.credits_adjusted || stats?.total_credits_adjusted),
      },
    ];
  }, [chatStats?.avg_chats_per_day, chatStats?.average_chats_per_day, chatStats?.chats_total, chatStats?.total_chats, stats?.credits_adjusted, stats?.total_credits_adjusted, stats?.total_users, stats?.users_count, stats?.users_total]);

  if (!isAdmin) {
    return <NotAuthorizedBlock />;
  }

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__kicker">Admin console</p>
          <h1>Platform control center</h1>
          <p>
            Signed in as {user?.email || user?.username || 'admin user'}. Manage system stats, users, and credit adjustments.
          </p>
        </div>
        <div className="admin-page__header-actions">
          <label htmlFor="chatDays">Chat stats window</label>
          <select
            id="chatDays"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
          <button type="button" onClick={() => loadAdminData(days)} disabled={isLoading || isAdjusting}>Refresh</button>
        </div>
      </header>

      {(error || info) && (
        <div className={`admin-page__banner${error ? ' admin-page__banner--error' : ''}`} role="alert">
          {error || info}
        </div>
      )}

      <section className="admin-page__summary" aria-label="Admin summary cards">
        {summaryCards.map(card => (
          <article key={card.label}>
            <h2>{card.label}</h2>
            <p>{isLoading ? 'Loading...' : card.value}</p>
          </article>
        ))}
      </section>

      <section className="admin-page__grid" aria-label="Admin details">
        <article className="admin-page__panel">
          <div className="admin-page__panel-head">
            <h2>Users</h2>
            <span>{users.length} loaded</span>
          </div>

          {isLoading && <p className="admin-page__muted">Loading users...</p>}
          {!isLoading && users.length === 0 && <p className="admin-page__muted">No users returned by API.</p>}

          {!isLoading && users.length > 0 && (
            <div className="admin-page__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((entry, index) => (
                    <tr key={`${entry?.id || entry?.user_id || 'user'}_${index}`}>
                      <td>{entry?.id || entry?.user_id || 'n/a'}</td>
                      <td>{entry?.email || 'n/a'}</td>
                      <td>{entry?.username || 'n/a'}</td>
                      <td>{entry?.role || (Array.isArray(entry?.roles) ? entry.roles.join(', ') : 'n/a')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="admin-page__panel">
          <div className="admin-page__panel-head">
            <h2>Chat stats details</h2>
            <span>{days} day window</span>
          </div>

          {isLoading && <p className="admin-page__muted">Loading chat stats...</p>}
          {!isLoading && (
            <pre className="admin-page__json">{JSON.stringify(chatStats || {}, null, 2)}</pre>
          )}
        </article>
      </section>

      <section className="admin-page__panel" aria-label="Credit adjustments">
        <div className="admin-page__panel-head">
          <h2>Adjust user credits</h2>
          <span>POST /api/credits/admin/adjust</span>
        </div>

        <form className="admin-page__form" onSubmit={onSubmitAdjustment}>
          <label>
            User ID
            <input
              type="text"
              value={adjustPayload.user_id}
              onChange={(event) => onAdjustField('user_id', event.target.value)}
              placeholder="user_123"
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              value={adjustPayload.amount}
              onChange={(event) => onAdjustField('amount', event.target.value)}
              placeholder="50"
            />
          </label>

          <label>
            Reason
            <input
              type="text"
              value={adjustPayload.reason}
              onChange={(event) => onAdjustField('reason', event.target.value)}
              placeholder="Manual correction"
            />
          </label>

          <button type="submit" disabled={isAdjusting || isLoading}>
            {isAdjusting ? 'Submitting...' : 'Submit adjustment'}
          </button>
        </form>
      </section>
    </main>
  );
}
