import React, { useEffect, useRef, useState } from "react";
import "./admindashboard.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    users:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    revenue:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    trending:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    activity:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    shield:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    ban:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    creditCard:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    megaphone:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
    arrowUp:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l10-10M7 7h10v10"/></svg>,
    arrowDown:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7l10 10M17 7v10H7"/></svg>,
    settings:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    bell:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    search:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chevronRight:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
    check:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>,
    x:           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    more:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    server:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
    cpu:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
    database:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    zap:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    userCheck:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
    logout:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    home:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    warning:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  return <span className="nav-icon">{icons[name] || null}</span>;
};

// ── Mini bar chart (canvas) ───────────────────────────────────────────────────
const MiniBar = ({ data, color }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const max = Math.max(...data);
    const barW = (w - (data.length - 1) * 3) / data.length;
    ctx.clearRect(0, 0, w, h);
    data.forEach((v, i) => {
      const bh = (v / max) * h;
      const x = i * (barW + 3);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + "cc");
      grad.addColorStop(1, color + "33");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, h - bh, barW, bh, 2);
      ctx.fill();
    });
  }, [data, color]);
  return <canvas ref={ref} width={80} height={32} className="mini-bar" />;
};

// ── Revenue chart (Chart.js) ──────────────────────────────────────────────────
const RevenueChart = () => {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    const build = () => {
      if (!ref.current) return;
      if (chartRef.current) chartRef.current.destroy();
      const ctx = ref.current.getContext("2d");
      const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
      const mrr =    [8200, 9100, 10400, 11200, 13800, 15100, 17340];
      const churn =  [320,  410,  280,   390,   250,   310,   180];
      const mkG = (c1, c2) => { const g = ctx.createLinearGradient(0,0,0,280); g.addColorStop(0,c1); g.addColorStop(1,c2); return g; };
      chartRef.current = new window.Chart(ctx, {
        data: {
          labels,
          datasets: [
            {
              type: "bar",
              label: "MRR (£)",
              data: mrr,
              backgroundColor: mkG("rgba(0,245,212,0.5)","rgba(0,245,212,0.05)"),
              borderColor: "rgba(0,245,212,0.8)",
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: "y",
            },
            {
              type: "line",
              label: "Churn (users)",
              data: churn,
              borderColor: "#f72585",
              backgroundColor: "rgba(247,37,133,0.08)",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "#f72585",
              pointBorderColor: "#06060f",
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { labels: { color: "#8888aa", font: { family: "DM Sans", size: 12 }, boxWidth: 12, boxHeight: 12, useBorderRadius: true, borderRadius: 3, padding: 20 } },
            tooltip: { backgroundColor: "#0d0d1f", borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, titleColor: "#e8e8f0", bodyColor: "#8888aa", padding: 12, cornerRadius: 8 },
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#55556a", font: { family: "DM Sans", size: 12 } } },
            y: { position: "left",  grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#55556a", font: { family: "DM Sans", size: 12 }, callback: v => "£" + (v/1000).toFixed(0) + "k" } },
            y1:{ position: "right", grid: { drawOnChartArea: false }, ticks: { color: "#55556a", font: { family: "DM Sans", size: 12 } } },
          },
        },
      });
    };
    if (window.Chart) { build(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    s.onload = build;
    document.head.appendChild(s);
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);
  return <canvas ref={ref} />;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total users",      value: "12,847", delta: "+9.2%",  positive: true,  icon: "users",      accent: "cyan",   bar: [80,95,110,98,130,142,155], barColor: "#00f5d4" },
  { label: "MRR",              value: "£17,340", delta: "+14.8%", positive: true,  icon: "revenue",    accent: "violet", bar: [82,91,104,112,138,151,173], barColor: "#9b5de5" },
  { label: "Active sessions",  value: "3,291",  delta: "+5.1%",  positive: true,  icon: "activity",   accent: "pink",   bar: [210,240,195,280,310,265,330], barColor: "#f72585" },
  { label: "Churned this mo.", value: "180",    delta: "-42%",   positive: true,  icon: "trending",   accent: "amber",  bar: [32,41,28,39,25,31,18], barColor: "#ffbe0b" },
];

const USERS = [
  { initials:"JK", name:"Jamie Kim",    email:"jamie@stripe.com",   plan:"Pro",   status:"active",    joined:"12 Jun 26", revenue:"£87" },
  { initials:"RP", name:"Riya Patel",   email:"riya@finscale.io",   plan:"Scale", status:"active",    joined:"08 Jun 26", revenue:"£149" },
  { initials:"ML", name:"Marcus Lee",   email:"m.lee@apex.vc",      plan:"Pro",   status:"suspended", joined:"01 Jun 26", revenue:"£0" },
  { initials:"SC", name:"Sara Chen",    email:"sara@growco.com",    plan:"Free",  status:"active",    joined:"28 May 26", revenue:"£0" },
  { initials:"TW", name:"Tom Walsh",    email:"tom@consultly.co",   plan:"Pro",   status:"active",    joined:"22 May 26", revenue:"£87" },
  { initials:"AN", name:"Aisha Nkosi",  email:"aisha@nkosi.dev",    plan:"Scale", status:"active",    joined:"15 May 26", revenue:"£149" },
];

const ALERTS = [
  { type: "warning", text: "Payment failure for marcus.lee@apex.vc — 3rd attempt", time: "2m ago" },
  { type: "info",    text: "New Scale plan signup: aisha@nkosi.dev", time: "14m ago" },
  { type: "danger",  text: "API rate limit hit — LinkedIn OAuth endpoint", time: "31m ago" },
  { type: "success", text: "Scheduled maintenance completed successfully", time: "1h ago" },
  { type: "warning", text: "Unusual login: tom@consultly.co from new device (Lagos, NG)", time: "2h ago" },
];

const HEALTH = [
  { label: "API latency",  value: "84ms",  pct: 84,  accent: "cyan",   icon: "zap" },
  { label: "CPU usage",    value: "41%",   pct: 41,  accent: "violet", icon: "cpu" },
  { label: "DB load",      value: "28%",   pct: 28,  accent: "pink",   icon: "database" },
  { label: "Uptime",       value: "99.98%",pct: 99,  accent: "amber",  icon: "server" },
];

const NAV = [
  { id:"home",       label:"Overview",     icon:"home" },
  { id:"users",      label:"Users",        icon:"users" },
  { id:"revenue",    label:"Revenue",      icon:"revenue" },
  { id:"health",     label:"Platform",     icon:"server" },
  { id:"security",   label:"Security",     icon:"shield" },
  { id:"announce",   label:"Announce",     icon:"megaphone" },
  { id:"settings",   label:"Settings",     icon:"settings" },
];

const PLAN_COLORS = { Pro: "violet", Scale: "cyan", Free: "muted" };
const STATUS_COLORS = { active: "green", suspended: "red" };

// ── Broadcast modal ───────────────────────────────────────────────────────────
const BroadcastModal = ({ onClose }) => {
  const [msg, setMsg] = useState("");
  const [audience, setAudience] = useState("all");
  const [sent, setSent] = useState(false);
  const handleSend = () => { if (!msg.trim()) return; setSent(true); setTimeout(onClose, 1400); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Broadcast announcement</h2>
          <button className="modal__close" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal__body">
          <div className="field">
            <label className="field__label">Audience</label>
            <select className="input" value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="all">All users (12,847)</option>
              <option value="pro">Pro plan only (8,210)</option>
              <option value="scale">Scale plan only (1,430)</option>
              <option value="free">Free plan only (3,207)</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label">Message</label>
            <textarea className="input input--textarea" rows={4} placeholder="Write your announcement…" value={msg} onChange={e => setMsg(e.target.value)} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className={`btn btn--primary ${sent ? "btn--sent" : ""}`} onClick={handleSend} disabled={!msg.trim()}>
            {sent ? <><Icon name="check" /> Sent!</> : <><Icon name="megaphone" /> Send broadcast</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── User action menu ──────────────────────────────────────────────────────────
const UserMenu = ({ user, onClose }) => {
  const actions = [
    { label: "Upgrade plan",   icon: "userCheck", accent: "cyan" },
    { label: "Issue refund",   icon: "creditCard", accent: "violet" },
    { label: user.status === "active" ? "Suspend account" : "Reinstate account", icon: "ban", accent: "danger" },
  ];
  return (
    <div className="user-menu">
      {actions.map(a => (
        <button key={a.label} className={`user-menu__item user-menu__item--${a.accent}`} onClick={onClose}>
          <Icon name={a.icon} />{a.label}
        </button>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// AdminDashboard
// ════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [range, setRange] = useState("7d");

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <span className="logo-mark">LX</span>
          <div className="sidebar__logo-text">
            <span className="logo-name">lynxstrat</span>
            <span className="admin-badge">ADMIN</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          {NAV.map(item => (
            <button key={item.id}
              className={`sidebar__link ${activeNav === item.id ? "sidebar__link--active" : ""}`}
              onClick={() => setActiveNav(item.id)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="sidebar__avatar">SA</div>
          <div className="sidebar__user">
            <span className="sidebar__user-name">Super Admin</span>
            <span className="sidebar__user-role">Full access</span>
          </div>
          <button className="sidebar__logout"><Icon name="logout" /></button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="main-area">

        {/* Top nav */}
        <header className="topnav">
          <div className="topnav__left">
            <h1 className="topnav__title">Admin overview</h1>
            <span className="topnav__date">Sunday, 5 July 2026</span>
          </div>
          <div className="topnav__right">
            <button className="btn btn--primary btn--sm btn--pink" onClick={() => setShowBroadcast(true)}>
              <Icon name="megaphone" /> Broadcast
            </button>
            <button className="topnav__icon-btn">
              <Icon name="bell" />
              <span className="notif-dot" />
            </button>
            <button className="topnav__avatar">SA</button>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">

          {/* ── Stat cards ──────────────────────────────────────── */}
          <div className="stat-grid">
            {STATS.map(s => (
              <div key={s.label} className={`stat-card stat-card--${s.accent}`}>
                <div className="stat-card__top">
                  <div className="stat-card__meta">
                    <span className={`stat-icon stat-icon--${s.accent}`}><Icon name={s.icon} /></span>
                    <span className="stat-card__label">{s.label}</span>
                  </div>
                  <span className={`stat-delta ${s.positive ? "stat-delta--up" : "stat-delta--down"}`}>
                    <Icon name={s.positive ? "arrowUp" : "arrowDown"} />{s.delta}
                  </span>
                </div>
                <div className="stat-card__bottom">
                  <span className="stat-card__value">{s.value}</span>
                  <MiniBar data={s.bar} color={s.barColor} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Mid row: Revenue chart + Alerts ─────────────────── */}
          <div className="mid-row">
            <div className="card chart-card">
              <div className="card__header">
                <div>
                  <h2 className="card__title">Revenue & churn</h2>
                  <p className="card__sub">MRR growth vs monthly churn</p>
                </div>
                <div className="range-tabs">
                  {["7d","30d","90d"].map(r => (
                    <button key={r} className={`range-tab ${range===r?"range-tab--active":""}`} onClick={()=>setRange(r)}>{r}</button>
                  ))}
                </div>
              </div>
              <div className="chart-wrap"><RevenueChart /></div>
            </div>

            <div className="card alerts-card">
              <div className="card__header">
                <div>
                  <h2 className="card__title">System alerts</h2>
                  <p className="card__sub">Last 24 hours</p>
                </div>
                <span className="alert-count">5</span>
              </div>
              <div className="alerts-list">
                {ALERTS.map((a,i) => (
                  <div key={i} className={`alert-row alert-row--${a.type}`}>
                    <span className={`alert-pip alert-pip--${a.type}`} />
                    <div className="alert-row__body">
                      <p className="alert-row__text">{a.text}</p>
                      <span className="alert-row__time">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-full">View all alerts <Icon name="chevronRight" /></button>
            </div>
          </div>

          {/* ── Platform health ──────────────────────────────────── */}
          <div className="card health-card">
            <div className="card__header">
              <div>
                <h2 className="card__title">Platform health</h2>
                <p className="card__sub">Live infrastructure metrics</p>
              </div>
              <span className="health-status"><span className="status-dot status-dot--green"/>All systems operational</span>
            </div>
            <div className="health-grid">
              {HEALTH.map(h => (
                <div key={h.label} className={`health-item health-item--${h.accent}`}>
                  <div className="health-item__top">
                    <span className={`health-icon health-icon--${h.accent}`}><Icon name={h.icon} /></span>
                    <div>
                      <span className="health-item__label">{h.label}</span>
                      <span className="health-item__value">{h.value}</span>
                    </div>
                  </div>
                  <div className="health-bar-track">
                    <div className={`health-bar-fill health-bar-fill--${h.accent}`} style={{ width: `${h.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── User table ───────────────────────────────────────── */}
          <div className="card users-card">
            <div className="card__header">
              <div>
                <h2 className="card__title">User management</h2>
                <p className="card__sub">12,847 total accounts</p>
              </div>
              <div className="table-controls">
                <div className="search-wrap">
                  <Icon name="search" />
                  <input
                    className="search-input"
                    placeholder="Search users…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn--ghost btn--sm">Export CSV</button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Revenue</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={i} className="user-row">
                      <td>
                        <div className="user-cell">
                          <div className={`user-avatar user-avatar--${["cyan","violet","pink","amber","cyan","violet"][i]}`}>{u.initials}</div>
                          <div className="user-cell__info">
                            <span className="user-cell__name">{u.name}</span>
                            <span className="user-cell__email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`plan-badge plan-badge--${PLAN_COLORS[u.plan]}`}>{u.plan}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${STATUS_COLORS[u.status]}`}>
                          <span className={`status-dot status-dot--${STATUS_COLORS[u.status]}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="td-muted">{u.joined}</td>
                      <td className="td-revenue">{u.revenue}</td>
                      <td className="td-actions">
                        <div className="action-wrap">
                          <button className="action-more" onClick={() => setOpenMenu(openMenu === i ? null : i)}>
                            <Icon name="more" />
                          </button>
                          {openMenu === i && <UserMenu user={u} onClose={() => setOpenMenu(null)} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span className="table-footer__info">Showing {filtered.length} of 12,847 users</span>
              <div className="pagination">
                <button className="page-btn" disabled>‹</button>
                <button className="page-btn page-btn--active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-ellipsis">…</span>
                <button className="page-btn">214</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>

          {/* ── Quick actions row ────────────────────────────────── */}
          <div className="quick-row">
            {[
              { label: "Suspend user",        icon: "ban",        accent: "danger",  desc: "Disable account access" },
              { label: "Upgrade plan",         icon: "userCheck",  accent: "cyan",    desc: "Change user subscription" },
              { label: "Issue refund",         icon: "creditCard", accent: "violet",  desc: "Process manual refund" },
              { label: "Broadcast message",    icon: "megaphone",  accent: "pink",    desc: "Notify all or subset of users", action: () => setShowBroadcast(true) },
            ].map(a => (
              <button key={a.label} className={`quick-action quick-action--${a.accent}`} onClick={a.action}>
                <span className={`quick-action__icon quick-action__icon--${a.accent}`}><Icon name={a.icon} /></span>
                <div className="quick-action__text">
                  <span className="quick-action__label">{a.label}</span>
                  <span className="quick-action__desc">{a.desc}</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
    </div>
  );
}