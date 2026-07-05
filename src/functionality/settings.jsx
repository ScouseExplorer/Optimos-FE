import React, { useState } from "react";
import "./settings.css";

// ── Icons (inline SVG to keep zero-dependency) ──────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    content: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" />
      </svg>
    ),
    analytics: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 20h18M5 20V14m4 6V10m4 10V6m4 14v-4" />
      </svg>
    ),
    connections: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" />
        <path d="M8 12h4m2-4.5-3.5 3m3.5 4.5-3.5-3" />
      </svg>
    ),
    aichat: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 10h.01M12 10h.01M15 10h.01" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    scheduler: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    eyeOff: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    credit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    link: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
    zapier: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    slack: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
  };
  return <span className="nav-icon">{icons[name] || null}</span>;
};

// ── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, accent = "cyan" }) => (
  <button
    className={`toggle toggle--${accent} ${checked ? "toggle--on" : ""}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <span className="toggle__thumb" />
  </button>
);

// ── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, icon, label, accent, children }) => (
  <section className={`settings-section settings-section--${accent}`} id={id}>
    <div className="section-header">
      <span className={`section-icon section-icon--${accent}`}>
        <Icon name={icon} />
      </span>
      <h2 className="section-title">{label}</h2>
    </div>
    <div className="section-body">{children}</div>
  </section>
);

// ── Field row ────────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="field">
    <div className="field__label-group">
      <label className="field__label">{label}</label>
      {hint && <span className="field__hint">{hint}</span>}
    </div>
    <div className="field__control">{children}</div>
  </div>
);

// ── Notification row ─────────────────────────────────────────────────────────
const NotifRow = ({ label, hint, email, push, onEmailChange, onPushChange }) => (
  <div className="notif-row">
    <div className="notif-row__info">
      <span className="notif-row__label">{label}</span>
      {hint && <span className="notif-row__hint">{hint}</span>}
    </div>
    <div className="notif-row__toggles">
      <div className="notif-toggle-cell">
        <Toggle checked={email} onChange={onEmailChange} accent="cyan" />
      </div>
      <div className="notif-toggle-cell">
        <Toggle checked={push} onChange={onPushChange} accent="violet" />
      </div>
    </div>
  </div>
);

// ── Plan badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }) => (
  <span className={`plan-badge plan-badge--${plan.toLowerCase()}`}>{plan}</span>
);

// ── Integration card ─────────────────────────────────────────────────────────
const IntegrationCard = ({ icon, name, description, connected, onToggle }) => (
  <div className={`integration-card ${connected ? "integration-card--connected" : ""}`}>
    <span className="integration-card__icon">
      <Icon name={icon} />
    </span>
    <div className="integration-card__info">
      <span className="integration-card__name">{name}</span>
      <span className="integration-card__desc">{description}</span>
    </div>
    <button
      className={`integration-btn ${connected ? "integration-btn--disconnect" : "integration-btn--connect"}`}
      onClick={onToggle}
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Main Settings page
// ════════════════════════════════════════════════════════════════════════════
export default function Settings() {
  // ── Account state ──
  const [account, setAccount] = useState({
    fullName: "Alex Morgan",
    username: "alexmorgan",
    email: "alex@lynxstrat.io",
    bio: "LinkedIn growth strategist & founder. Building Optimos.",
    timezone: "Europe/London",
  });

  // ── Security state ──
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  // ── Notification state ──
  const [notifs, setNotifs] = useState({
    newFollower:    { email: true,  push: true  },
    connectionReq:  { email: true,  push: true  },
    postEngagement: { email: false, push: true  },
    aiInsights:     { email: true,  push: false },
    weeklyReport:   { email: true,  push: false },
    billing:        { email: true,  push: false },
    security:       { email: true,  push: true  },
  });

  const setNotif = (key, channel, val) =>
    setNotifs((prev) => ({ ...prev, [key]: { ...prev[key], [channel]: val } }));

  // ── Integrations state ──
  const [integrations, setIntegrations] = useState({
    linkedin: true,
    zapier: false,
    slack: false,
  });
  const toggleIntegration = (key) =>
    setIntegrations((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Danger state ──
  const [deleteInput, setDeleteInput] = useState("");

  const [activeNav] = useState("settings");

  const navItems = [
    { id: "dashboard",   label: "Dashboard"   },
    { id: "profile",     label: "Profile"     },
    { id: "content",     label: "Content"     },
    { id: "analytics",   label: "Analytics"   },
    { id: "connections", label: "Connections" },
    { id: "aichat",      label: "AI Chat"     },
    { id: "scheduler",   label: "Scheduler"   },
    { id: "settings",    label: "Settings"    },
  ];

  const settingsNav = [
    { href: "#account",       label: "Account"       },
    { href: "#security",      label: "Security"      },
    { href: "#notifications", label: "Notifications" },
    { href: "#billing",       label: "Billing"       },
    { href: "#integrations",  label: "Integrations"  },
    { href: "#danger",        label: "Danger Zone"   },
  ];

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <span className="logo-mark">LX</span>
          <span className="logo-name">lynxstrat</span>
        </div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`sidebar__link ${activeNav === item.id ? "sidebar__link--active" : ""}`}
            >
              <Icon name={item.id} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="sidebar__avatar">AM</div>
          <div className="sidebar__user">
            <span className="sidebar__user-name">Alex Morgan</span>
            <span className="sidebar__user-plan">Pro plan</span>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────── */}
      <div className="main-area">
        {/* Top nav */}
        <header className="topnav">
          <div className="topnav__left">
            <h1 className="topnav__title">Settings</h1>
          </div>
          <div className="topnav__right">
            <button className="topnav__avatar">AM</button>
          </div>
        </header>

        {/* Content */}
        <div className="settings-layout">
          {/* In-page nav */}
          <aside className="settings-subnav">
            <span className="settings-subnav__label">Jump to</span>
            {settingsNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`settings-subnav__link ${item.href === "#danger" ? "settings-subnav__link--danger" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </aside>

          {/* Sections */}
          <div className="settings-sections">

            {/* ── ACCOUNT ─────────────────────────────────────────── */}
            <Section id="account" icon="profile" label="Account" accent="cyan">
              <div className="avatar-row">
                <div className="avatar-preview">AM</div>
                <div className="avatar-actions">
                  <button className="btn btn--ghost btn--sm">Upload photo</button>
                  <button className="btn btn--text btn--sm">Remove</button>
                </div>
              </div>

              <div className="field-grid">
                <Field label="Full name">
                  <input
                    className="input"
                    value={account.fullName}
                    onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                  />
                </Field>
                <Field label="Username" hint="lynxstrat.io/@username">
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">@</span>
                    <input
                      className="input input--prefixed"
                      value={account.username}
                      onChange={(e) => setAccount({ ...account, username: e.target.value })}
                    />
                  </div>
                </Field>
                <Field label="Email address">
                  <input
                    className="input"
                    type="email"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  />
                </Field>
                <Field label="Timezone">
                  <select
                    className="input"
                    value={account.timezone}
                    onChange={(e) => setAccount({ ...account, timezone: e.target.value })}
                  >
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Asia/Singapore</option>
                    <option>Australia/Sydney</option>
                  </select>
                </Field>
              </div>

              <Field label="Bio" hint="Shown on your public profile">
                <textarea
                  className="input input--textarea"
                  rows={3}
                  value={account.bio}
                  onChange={(e) => setAccount({ ...account, bio: e.target.value })}
                />
              </Field>

              <div className="section-actions">
                <button className="btn btn--primary">Save changes</button>
                <button className="btn btn--ghost">Cancel</button>
              </div>
            </Section>

            {/* ── SECURITY ────────────────────────────────────────── */}
            <Section id="security" icon="shield" label="Security" accent="violet">
              <div className="subsection">
                <h3 className="subsection__title">Change password</h3>
                <div className="field-grid">
                  <Field label="Current password">
                    <div className="input-eye-wrap">
                      <input className="input" type={showCurrentPw ? "text" : "password"} placeholder="••••••••••" />
                      <button className="eye-btn" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                        <Icon name={showCurrentPw ? "eyeOff" : "eye"} />
                      </button>
                    </div>
                  </Field>
                  <Field label="New password" hint="Min 12 characters">
                    <div className="input-eye-wrap">
                      <input className="input" type={showNewPw ? "text" : "password"} placeholder="••••••••••" />
                      <button className="eye-btn" onClick={() => setShowNewPw(!showNewPw)}>
                        <Icon name={showNewPw ? "eyeOff" : "eye"} />
                      </button>
                    </div>
                  </Field>
                </div>
                <div className="section-actions">
                  <button className="btn btn--primary btn--violet">Update password</button>
                </div>
              </div>

              <div className="divider" />

              <div className="subsection">
                <h3 className="subsection__title">Two-factor authentication</h3>
                <div className="toggle-row">
                  <div className="toggle-row__info">
                    <span className="toggle-row__label">Authenticator app (TOTP)</span>
                    <span className="toggle-row__hint">Adds a second layer of protection at login</span>
                  </div>
                  <Toggle checked={mfaEnabled} onChange={setMfaEnabled} accent="violet" />
                </div>
                {mfaEnabled && (
                  <div className="mfa-status">
                    <span className="status-dot status-dot--green" />
                    2FA active — Google Authenticator linked
                  </div>
                )}
              </div>

              <div className="divider" />

              <div className="subsection">
                <h3 className="subsection__title">Active sessions</h3>
                <div className="session-card">
                  <div className="session-card__info">
                    <span className="session-card__device">MacBook Pro — Chrome 125</span>
                    <span className="session-card__meta">Glasgow, GB · Current session</span>
                  </div>
                  <span className="session-badge">Active</span>
                </div>
                <div className="session-card">
                  <div className="session-card__info">
                    <span className="session-card__device">iPhone 15 Pro — Safari</span>
                    <span className="session-card__meta">Glasgow, GB · 2 hours ago</span>
                  </div>
                  <button className="btn btn--ghost btn--sm btn--danger-ghost">Revoke</button>
                </div>
                <div className="toggle-row" style={{ marginTop: "1rem" }}>
                  <div className="toggle-row__info">
                    <span className="toggle-row__label">New sign-in alerts</span>
                    <span className="toggle-row__hint">Email me whenever a new session starts</span>
                  </div>
                  <Toggle checked={sessionAlerts} onChange={setSessionAlerts} accent="violet" />
                </div>
              </div>
            </Section>

            {/* ── NOTIFICATIONS ───────────────────────────────────── */}
            <Section id="notifications" icon="bell" label="Notifications" accent="pink">
              <div className="notif-header-row">
                <span />
                <div className="notif-col-labels">
                  <span>Email</span>
                  <span>Push</span>
                </div>
              </div>

              <div className="notif-group">
                <span className="notif-group__label">Activity</span>
                <NotifRow label="New follower" hint="Someone follows your LinkedIn"
                  email={notifs.newFollower.email} push={notifs.newFollower.push}
                  onEmailChange={(v) => setNotif("newFollower", "email", v)}
                  onPushChange={(v) => setNotif("newFollower", "push", v)} />
                <NotifRow label="Connection request" hint="Pending invites awaiting approval"
                  email={notifs.connectionReq.email} push={notifs.connectionReq.push}
                  onEmailChange={(v) => setNotif("connectionReq", "email", v)}
                  onPushChange={(v) => setNotif("connectionReq", "push", v)} />
                <NotifRow label="Post engagement" hint="Likes, comments and shares on your posts"
                  email={notifs.postEngagement.email} push={notifs.postEngagement.push}
                  onEmailChange={(v) => setNotif("postEngagement", "email", v)}
                  onPushChange={(v) => setNotif("postEngagement", "push", v)} />
              </div>

              <div className="notif-group">
                <span className="notif-group__label">Optimos</span>
                <NotifRow label="AI growth insights" hint="Weekly opportunities surfaced by Optimos"
                  email={notifs.aiInsights.email} push={notifs.aiInsights.push}
                  onEmailChange={(v) => setNotif("aiInsights", "email", v)}
                  onPushChange={(v) => setNotif("aiInsights", "push", v)} />
                <NotifRow label="Weekly performance report"
                  email={notifs.weeklyReport.email} push={notifs.weeklyReport.push}
                  onEmailChange={(v) => setNotif("weeklyReport", "email", v)}
                  onPushChange={(v) => setNotif("weeklyReport", "push", v)} />
              </div>

              <div className="notif-group">
                <span className="notif-group__label">Account</span>
                <NotifRow label="Billing updates" hint="Receipts, renewals, and payment issues"
                  email={notifs.billing.email} push={notifs.billing.push}
                  onEmailChange={(v) => setNotif("billing", "email", v)}
                  onPushChange={(v) => setNotif("billing", "push", v)} />
                <NotifRow label="Security alerts"
                  email={notifs.security.email} push={notifs.security.push}
                  onEmailChange={(v) => setNotif("security", "email", v)}
                  onPushChange={(v) => setNotif("security", "push", v)} />
              </div>

              <div className="section-actions">
                <button className="btn btn--primary btn--pink">Save preferences</button>
              </div>
            </Section>

            {/* ── BILLING ─────────────────────────────────────────── */}
            <Section id="billing" icon="credit" label="Billing" accent="amber">
              <div className="plan-card">
                <div className="plan-card__left">
                  <span className="plan-card__label">Current plan</span>
                  <div className="plan-card__name">
                    <PlanBadge plan="Pro" />
                    <span className="plan-card__price">£29<span>/mo</span></span>
                  </div>
                  <span className="plan-card__renew">Renews 26 July 2026</span>
                </div>
                <div className="plan-card__actions">
                  <button className="btn btn--primary btn--amber">Upgrade to Scale</button>
                  <button className="btn btn--ghost btn--sm">View all plans</button>
                </div>
              </div>

              <div className="plan-features">
                {[
                  "Unlimited AI content suggestions",
                  "Advanced analytics dashboard",
                  "Priority support",
                  "Up to 3 LinkedIn accounts",
                ].map((f) => (
                  <div key={f} className="plan-feature">
                    <span className="plan-feature__check"><Icon name="check" /></span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div className="subsection">
                <h3 className="subsection__title">Payment method</h3>
                <div className="payment-card">
                  <span className="payment-card__icon">💳</span>
                  <div className="payment-card__info">
                    <span className="payment-card__label">Visa ending 4242</span>
                    <span className="payment-card__meta">Expires 09/2028</span>
                  </div>
                  <button className="btn btn--ghost btn--sm">Replace</button>
                </div>
              </div>

              <div className="divider" />

              <div className="subsection">
                <h3 className="subsection__title">Billing history</h3>
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Description</th><th>Amount</th><th />
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "26 Jun 2026", desc: "Pro plan — monthly", amount: "£29.00" },
                      { date: "26 May 2026", desc: "Pro plan — monthly", amount: "£29.00" },
                      { date: "26 Apr 2026", desc: "Pro plan — monthly", amount: "£29.00" },
                    ].map((row) => (
                      <tr key={row.date}>
                        <td>{row.date}</td>
                        <td>{row.desc}</td>
                        <td className="billing-table__amount">{row.amount}</td>
                        <td><button className="btn btn--text btn--sm">PDF</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ── INTEGRATIONS ────────────────────────────────────── */}
            <Section id="integrations" icon="link" label="Integrations" accent="cyan">
              <p className="section-intro">Connect external tools to supercharge your Optimos workflow.</p>
              <div className="integrations-list">
                <IntegrationCard
                  icon="linkedin"
                  name="LinkedIn"
                  description="Sync profile data, schedule posts, and track engagement in real time"
                  connected={integrations.linkedin}
                  onToggle={() => toggleIntegration("linkedin")}
                />
                <IntegrationCard
                  icon="zapier"
                  name="Zapier"
                  description="Trigger Optimos actions from 6,000+ apps via automated workflows"
                  connected={integrations.zapier}
                  onToggle={() => toggleIntegration("zapier")}
                />
                <IntegrationCard
                  icon="slack"
                  name="Slack"
                  description="Receive growth alerts and weekly digests directly in your workspace"
                  connected={integrations.slack}
                  onToggle={() => toggleIntegration("slack")}
                />
              </div>
            </Section>

            {/* ── DANGER ZONE ─────────────────────────────────────── */}
            <Section id="danger" icon="warning" label="Danger Zone" accent="danger">
              <div className="danger-item">
                <div className="danger-item__info">
                  <span className="danger-item__title">Export all data</span>
                  <span className="danger-item__desc">Download a full archive of your account data, posts, and analytics as a ZIP file.</span>
                </div>
                <button className="btn btn--ghost">Export</button>
              </div>

              <div className="danger-item">
                <div className="danger-item__info">
                  <span className="danger-item__title">Pause account</span>
                  <span className="danger-item__desc">Suspend all AI scheduling and posting. Your data and billing continue unchanged.</span>
                </div>
                <button className="btn btn--ghost">Pause</button>
              </div>

              <div className="danger-item danger-item--delete">
                <div className="danger-item__info">
                  <span className="danger-item__title">Delete account</span>
                  <span className="danger-item__desc">
                    Permanently removes your account, all content, analytics, and billing data.
                    This cannot be undone.
                  </span>
                </div>
                <div className="delete-confirm">
                  <input
                    className="input input--danger"
                    placeholder={`Type "delete my account" to confirm`}
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                  />
                  <button
                    className="btn btn--danger"
                    disabled={deleteInput !== "delete my account"}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}