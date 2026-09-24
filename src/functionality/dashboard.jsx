import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './dashboard.css';
import InternalAppShell from '../layout/InternalAppShell.jsx';

Chart.register(...registerables);

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const REACH_DATA = {
  '7d': {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    data:   [3200, 4100, 3800, 5200, 6100, 4800, 5900],
  },
  '30d': {
    labels: ['Apr 1','Apr 5','Apr 10','Apr 15','Apr 20','Apr 25','Apr 27'],
    data:   [18000, 24000, 21000, 35000, 42000, 38000, 52000],
  },
  '90d': {
    labels: ['Feb','Mar','Apr'],
    data:   [60000, 95000, 128000],
  },
};

const MIX_DATA = {
  labels: ['Articles','Short posts','Images','Polls'],
  data:   [42, 35, 15, 8],
  colors: ['#9b5de5','#00f5d4','#f72585','#ffbe0b'],
};

const STAT_CARDS = [
  { label:'Profile Views',    value:'4,821', change:'+34%', dir:'up',   color:'cyan',   suffix:'vs last month' },
  { label:'Post Impressions', value:'128K',  change:'+61%', dir:'up',   color:'violet', suffix:'vs last month' },
  { label:'New Connections',  value:'247',   change:'+18%', dir:'up',   color:'pink',   suffix:'vs last month' },
  { label:'Engagement Rate',  value:'6.4%',  change:'-2%',  dir:'down', color:'amber',  suffix:'vs last month' },
];

const POSTS = [
  { day:'28', mon:'APR', color:'cyan',   type:'article', typeLabel:'Article', text:'5 things I learned scaling my LinkedIn from 0 to 10K followers in 90 days', status:'09:00 AM · Scheduled' },
  { day:'30', mon:'APR', color:'violet', type:'poll',    typeLabel:'Poll',    text:"What's your biggest challenge growing on LinkedIn right now?",               status:'12:00 PM · Scheduled' },
  { day:'02', mon:'MAY', color:'pink',   type:'image',   typeLabel:'Image',   text:'Behind the scenes: how I structure my content week for maximum reach',       status:'08:30 AM · Draft' },
];

const SCORE_ROWS = [
  { label:'Headline',     pct:95, color:'var(--cyan)' },
  { label:'About section',pct:80, color:'var(--violet)' },
  { label:'Experience',   pct:70, color:'var(--amber)' },
  { label:'Skills & recs',pct:55, color:'var(--pink)' },
];

const SUGGESTIONS = [
  { icon:'💡', iconBg:'rgba(255,190,11,.12)', iconBorder:'rgba(255,190,11,.25)', title:'Add 5 more skills',  desc:'Profiles with 10+ skills get 4× more views' },
  { icon:'✨', iconBg:'rgba(0,245,212,.10)',  iconBorder:'rgba(0,245,212,.25)',  title:'Rewrite your About', desc:'Yours is too short — aim for 250+ words' },
];

/* ══════════════════════════════════════════
   REACH CHART HOOK
══════════════════════════════════════════ */

function useReachChart(canvasRef, period) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const { labels, data } = REACH_DATA[period];

    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, 'rgba(155,93,229,0.35)');
    grad.addColorStop(1, 'rgba(155,93,229,0)');

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Reach',
          data,
          borderColor: '#9b5de5',
          borderWidth: 2,
          pointBackgroundColor: '#9b5de5',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: grad,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(6,6,15,0.9)',
            borderColor: 'rgba(155,93,229,0.4)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            callbacks: {
              label: ctx => ` ${ctx.parsed.y.toLocaleString()} impressions`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: 'rgba(255,255,255,0.4)',
              font: { size: 11 },
              callback: v => v >= 1000 ? Math.round(v / 1000) + 'K' : v,
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [period, canvasRef]);
}

/* ══════════════════════════════════════════
   DONUT CHART HOOK
══════════════════════════════════════════ */

function useDonutChart(canvasRef) {
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: MIX_DATA.labels,
        datasets: [{
          data: MIX_DATA.data,
          backgroundColor: MIX_DATA.colors,
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(6,6,15,0.9)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
          },
        },
      },
    });
    return () => chart.destroy();
  }, [canvasRef]);
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

function StatCards() {
  return (
    <div className="stat-grid">
      {STAT_CARDS.map(({ label, value, change, dir, color, suffix }) => (
        <div key={label} className={`stat-card stat-card--${color}`}>
          <div className="stat-card__label">{label}</div>
          <div className={`stat-card__value stat-card__value--${color}`}>{value}</div>
          <div className="stat-card__change">
            <span className={`change--${dir}`}>{change}</span>
            <span className="change__period">{suffix}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReachChart() {
  const [period, setPeriod] = useState('30d');
  const canvasRef = useRef(null);
  useReachChart(canvasRef, period);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">Reach over time</span>
        <div className="period-toggle">
          {['7d','30d','90d'].map(p => (
            <button
              key={p}
              className={`period-btn${period === p ? ' period-btn--active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-canvas-wrap">
        <canvas
          ref={canvasRef}
          id="reachChart"
          role="img"
          aria-label="Line chart showing LinkedIn reach over the selected time period"
        >
          Reach data over selected period.
        </canvas>
      </div>
    </div>
  );
}

function ContentMixChart() {
  const canvasRef = useRef(null);
  useDonutChart(canvasRef);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">Content mix</span>
      </div>
      <div style={{ position: 'relative', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          id="mixChart"
          role="img"
          aria-label="Doughnut chart showing content type breakdown: 42% articles, 35% short posts, 15% images, 8% polls"
        >
          Content mix: 42% articles, 35% short posts, 15% images, 8% polls.
        </canvas>
      </div>
      <div className="donut-legend">
        {MIX_DATA.labels.map((label, i) => (
          <div key={label} className="legend-row">
            <div className="legend-dot-wrap">
              <div className="legend-dot" style={{ background: MIX_DATA.colors[i] }} />
              {label}
            </div>
            <span className="legend-val">{MIX_DATA.data[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingPosts() {
  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">Upcoming posts</span>
        <button className="see-all">See all →</button>
      </div>

      {POSTS.map(({ day, mon, color, type, typeLabel, text, status }) => (
        <div key={`${day}-${mon}`} className="post-item">
          <div className={`post-day post-day--${color}`}>
            <span className="post-day__num">{day}</span>
            <span className="post-day__mon">{mon}</span>
          </div>
          <div className="post-content">
            <div className="post-text">{text}</div>
            <div className="post-meta">
              <span className={`post-type post-type--${type}`}>{typeLabel}</span>
              <span className="post-status">{status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileScore() {
  const SCORE = 83;
  // SVG ring: r=30, circumference=188.5
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (SCORE / 100) * circumference;

  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">Profile strength</span>
        <span style={{ fontSize: '.72rem', color: 'var(--muted)' }}>Pro plan</span>
      </div>

      <div className="score-ring-wrap">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9b5de5" />
              <stop offset="100%" stopColor="#00f5d4" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7" />
          <circle
            cx="36" cy="36" r="30" fill="none"
            stroke="url(#scoreGrad)" strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
          />
        </svg>
        <div className="score-label-block">
          <div className="score-big">{SCORE}</div>
          <div className="score-desc">Good — a few tweaks will push you to Expert level.</div>
        </div>
      </div>

      <div className="score-items">
        {SCORE_ROWS.map(({ label, pct, color }) => (
          <div key={label} className="score-row">
            <span className="score-row__label">{label}</span>
            <div className="score-row__track">
              <div className="score-row__fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="score-row__pct">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="suggestions-header">AI suggestions</div>

      {SUGGESTIONS.map(({ icon, iconBg, iconBorder, title, desc }) => (
        <div key={title} className="suggest-item">
          <div
            className="suggest-item__icon"
            style={{ background: iconBg, border: `1px solid ${iconBorder}`, fontSize: 14 }}
          >
            {icon}
          </div>
          <div className="suggest-item__body">
            <div className="suggest-item__title">{title}</div>
            <div className="suggest-item__desc">{desc}</div>
          </div>
          <button className="suggest-item__btn">Fix</button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT DASHBOARD PAGE
══════════════════════════════════════════ */

export default function Dashboard() {
  return (
    <InternalAppShell title="Dashboard" activeNav="dashboard">
      <main className="dashboard-main">
        <div className="greeting">
          <h1 className="greeting__title">
            GOOD MORNING, <span>ALEX</span>
          </h1>
          <p className="greeting__sub">Here's your LinkedIn performance for the last 30 days.</p>
        </div>

        <StatCards />

        <div className="charts-row">
          <ReachChart />
          <ContentMixChart />
        </div>

        <div className="bottom-row">
          <UpcomingPosts />
          <ProfileScore />
        </div>
      </main>
    </InternalAppShell>
  );
}