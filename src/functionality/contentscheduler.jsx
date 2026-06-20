import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './contentscheduler.css';

/* ══════════════════════════════════════════
   CONSTANTS & DATA
══════════════════════════════════════════ */

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const TYPE_LABELS  = { article:'Article', short:'Short post', image:'Image', poll:'Poll', video:'Video' };
const TYPE_CLASSES = { article:'type-pill--article', short:'type-pill--short', image:'type-pill--image', poll:'type-pill--poll', video:'type-pill--video' };

const AI_IDEAS = [
  `3 LinkedIn habits that boosted my profile views by 340% in 30 days — and none of them involve posting every day.\n\nThread below 👇`,
  `Unpopular opinion: your LinkedIn headline is hurting your career.\n\nMost people use it to list their job title. The best professionals use it to communicate value.\n\nHere's the formula I give every client:`,
  `I analysed 100 viral LinkedIn posts last month. Here's what they all had in common:\n\n1. They opened with a bold statement\n2. They told a story\n3. They ended with a clear question\n\nSimple? Yes. But almost nobody does all three.`,
];

const INITIAL_POSTS = [
  { id:1,  text:'5 things I learned scaling LinkedIn from 0 to 10K followers in 90 days',           type:'article', date:'2026-05-28', time:'09:00', status:'scheduled' },
  { id:2,  text:"What's your biggest challenge growing on LinkedIn right now?",                      type:'poll',    date:'2026-05-30', time:'12:00', status:'scheduled' },
  { id:3,  text:'Behind the scenes: how I structure my content week for maximum reach',              type:'image',   date:'2026-06-02', time:'08:30', status:'draft' },
  { id:4,  text:'The one LinkedIn headline mistake 90% of people make (and how to fix it)',         type:'article', date:'2026-05-20', time:'09:00', status:'published' },
  { id:5,  text:'3 content formats that consistently get 10x more impressions on LinkedIn',         type:'short',   date:'2026-05-22', time:'11:00', status:'published' },
  { id:6,  text:'Why your LinkedIn profile photo is costing you connections',                       type:'image',   date:'2026-05-14', time:'08:00', status:'published' },
  { id:7,  text:'My exact outreach message template — 47% acceptance rate',                         type:'short',   date:'2026-05-06', time:'09:30', status:'published' },
  { id:8,  text:'LinkedIn algorithm changes in 2026: what actually matters now',                    type:'article', date:'2026-05-10', time:'10:00', status:'published' },
  { id:9,  text:'Quick poll: which content type gets the most engagement for you?',                 type:'poll',    date:'2026-05-17', time:'13:00', status:'published' },
  { id:10, text:'Video breakdown: building a content system in 1 hour a week',                      type:'video',   date:'2026-06-05', time:'09:00', status:'scheduled' },
  { id:11, text:'Draft: thought leadership piece on AI and professional branding',                   type:'article', date:'2026-06-10', time:'09:00', status:'draft' },
  { id:12, text:'Draft: carousel post about connection building tactics',                           type:'image',   date:'2026-06-12', time:'10:00', status:'draft' },
];

/* ══════════════════════════════════════════
   TOAST HOOK
══════════════════════════════════════════ */

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback(msg => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, hiding: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 280);
    }, 2800);
  }, []);
  return { toasts, showToast };
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.hiding ? ' toast--hiding' : ''}`}>
          <span className="toast__icon">✓</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   SVG ICONS (inline, reused across pages)
══════════════════════════════════════════ */

const Icon = {
  grid:     <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:     <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  edit:     <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  chart:    <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  users:    <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  radio:    <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  calendar: <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  settings: <svg className="nav-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  arrowR:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
};

/* ══════════════════════════════════════════
   TOP NAV
══════════════════════════════════════════ */

function TopNav() {
  return (
    <div className="topnav">
      <span className="topnav__logo">lynx<span>strat</span></span>
      <div className="topnav__right">
        <div className="notif-btn">{Icon.bell}<span className="notif-btn__dot"/></div>
        <div className="avatar">AM</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      {[
        { icon:'grid',  label:'Dashboard',  route:'/dashboard' },
        { icon:'user',  label:'Profile',    route:'/profile' },
        { icon:'edit',  label:'Content',    route:'/content', active:true, badge:3 },
        { icon:'chart', label:'Analytics',  route:'/analytics' },
        { icon:'users', label:'Connections',route:'/connections' },
      ].map(({ icon, label, route, active, badge }) => (
        <button key={label} className={`nav-item${active ? ' nav-item--active' : ''}`} onClick={() => navigate(route)}>
          {Icon[icon]}{label}
          {badge && <span className="nav-item__badge">{badge}</span>}
        </button>
      ))}

      <div className="sidebar__section">Tools</div>
      {[
        { icon:'radio',    label:'AI Chat',   route:'/aichat' },
        { icon:'calendar', label:'Scheduler', route:'/content', active:true },
      ].map(({ icon, label, route, active }) => (
        <button key={label} className={`nav-item${active ? ' nav-item--active' : ''}`} onClick={() => navigate(route)}>
          {Icon[icon]}{label}
        </button>
      ))}

      <div className="sidebar__section">Account</div>
      <button className="nav-item" onClick={() => navigate('/settings')}>
        {Icon.settings}Settings
      </button>
    </aside>
  );
}

/* ══════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════ */

function Calendar({ year, month, posts, onDayClick, onPostClick, onMonthChange }) {
  const today = new Date();

  const firstDay  = new Date(year, month, 1);
  let startDow    = firstDay.getDay();
  startDow        = startDow === 0 ? 6 : startDow - 1;
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false });
  for (let d = 1; d <= daysInMon; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.filter(c => !c.cur).length - startDow + 1, cur: false });
  }

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="calendar-card">
      <div className="cal-header">
        <span className="cal-header__month">{MONTH_NAMES[month]} {year}</span>
        <div className="cal-nav">
          <button className="cal-nav__btn" onClick={() => onMonthChange(-1)}>‹</button>
          <button className="cal-nav__btn" onClick={() => onMonthChange(1)}>›</button>
        </div>
      </div>

      <div className="cal-days-header">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map(({ day, cur }, idx) => {
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const isToday = cur && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const dayPosts = cur ? posts.filter(p => p.date === dateStr) : [];

          return (
            <div
              key={idx}
              className={`cal-cell${!cur ? ' cal-cell--other-month' : ''}${isToday ? ' cal-cell--today' : ''}`}
              onClick={() => cur && onDayClick(dateStr)}
            >
              <div className="cal-cell__num">{day}</div>
              {dayPosts.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  className={`cal-post cal-post--${p.status}`}
                  onClick={e => { e.stopPropagation(); onPostClick(p); }}
                >
                  {p.text}
                </div>
              ))}
              {dayPosts.length > 2 && (
                <div style={{ fontSize: '.6rem', color: 'var(--muted)', paddingLeft: '.35rem' }}>
                  +{dayPosts.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   POST QUEUE
══════════════════════════════════════════ */

function PostQueue({ posts, filter, onFilterChange, onEdit, onDelete }) {
  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter);
  const sorted   = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  const fmtDate = dateStr => {
    const d = new Date(dateStr + 'T12:00:00');
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
  };

  return (
    <div className="queue-panel">
      <div className="queue-header">
        <span className="queue-title">Post queue</span>
        <div className="queue-filter">
          {['all','scheduled','draft'].map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' filter-btn--active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="queue-list">
        {sorted.length === 0 && (
          <div style={{ textAlign:'center', padding:'2rem', color:'var(--muted)', fontSize:'.82rem' }}>
            No posts in this filter
          </div>
        )}
        {sorted.map(p => (
          <div key={p.id} className="queue-item" onClick={() => onEdit(p)}>
            <div className="queue-item__top">
              <div className="queue-item__text">{p.text}</div>
              <span className={`queue-status queue-status--${p.status}`}>{p.status}</span>
            </div>
            <div className="queue-item__meta">
              <div className="queue-meta-left">
                <span className={`type-pill ${TYPE_CLASSES[p.type]}`}>{TYPE_LABELS[p.type]}</span>
                <span className="queue-date">{fmtDate(p.date)} · {p.time}</span>
              </div>
              <div className="queue-actions" onClick={e => e.stopPropagation()}>
                <button className="qa-btn" title="Edit"   onClick={() => onEdit(p)}>✏</button>
                <button className="qa-btn" title="Delete" onClick={() => onDelete(p.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMPOSE MODAL
══════════════════════════════════════════ */

const EMPTY_FORM = { text:'', type:'article', date:'2026-05-28', time:'09:00', status:'scheduled' };

function ComposeModal({ isOpen, initial, onClose, onSave }) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [charCount, setCharCount] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      const next = initial
        ? { text: initial.text||'', type: initial.type||'article', date: initial.date||'2026-05-28', time: initial.time||'09:00', status: initial.status||'scheduled' }
        : EMPTY_FORM;
      setForm(next);
      setCharCount((next.text||'').length);
    }
  }, [isOpen, initial]);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleTextChange = e => {
    setForm(prev => ({ ...prev, text: e.target.value }));
    setCharCount(e.target.value.length);
  };

  const generateAI = () => {
    const idea = AI_IDEAS[Math.floor(Math.random() * AI_IDEAS.length)];
    setForm(prev => ({ ...prev, text: idea }));
    setCharCount(idea.length);
  };

  const countClass = charCount > 2500 ? ' char-count--warn' : charCount > 50 ? ' char-count--good' : '';

  const TYPES = [
    { key:'article', label:'📄 Article' },
    { key:'short',   label:'✍️ Short post' },
    { key:'image',   label:'🖼️ Image' },
    { key:'poll',    label:'📊 Poll' },
    { key:'video',   label:'🎬 Video' },
  ];

  return (
    <div
      className={`modal-overlay${isOpen ? ' modal-overlay--open' : ''}`}
      onClick={e => e.target.classList.contains('modal-overlay') && onClose()}
    >
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">NEW <span>POST</span></span>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <div className="modal__body">
          {/* AI generate */}
          <div className="ai-bar" onClick={generateAI}>
            <span className="ai-bar__icon">✨</span>
            <span className="ai-bar__text">Generate post idea with AI</span>
            {Icon.arrowR}
          </div>

          {/* Post type */}
          <div>
            <label className="form-label">Post type</label>
            <div className="type-selector">
              {TYPES.map(({ key, label }) => (
                <button
                  key={key}
                  className={`type-opt${form.type === key ? ' type-opt--selected' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, type: key }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="form-label">Content</label>
            <textarea
              className="form-input"
              rows={5}
              maxLength={3000}
              placeholder="Write your post here... or hit ✨ above to generate one."
              value={form.text}
              onChange={handleTextChange}
            />
            <div className="char-row">
              <span className={`char-count${countClass}`}>{charCount} / 3000</span>
              <span style={{ fontSize:'.72rem', color:'var(--muted)' }}>LinkedIn max: 3,000</span>
            </div>
          </div>

          {/* Date & time */}
          <div className="form-row">
            <div>
              <label className="form-label">Schedule date</label>
              <input className="form-input" type="date" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={form.time} onChange={set('time')} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={set('status')}>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Save as draft</option>
            </select>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-grad" onClick={() => onSave(form)}>
            {form.status === 'draft' ? 'Save draft' : 'Schedule post'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════ */

export default function ContentScheduler() {
  const { toasts, showToast } = useToasts();

  const [posts, setPosts]         = useState(INITIAL_POSTS);
  const [year,  setYear]          = useState(2026);
  const [month, setMonth]         = useState(4); // May (0-indexed)
  const [view,  setView]          = useState('month');
  const [filter, setFilter]       = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost]   = useState(null);

  const changeMonth = delta => {
    setMonth(prev => {
      let m = prev + delta;
      if (m > 11) { setYear(y => y + 1); return 0; }
      if (m < 0)  { setYear(y => y - 1); return 11; }
      return m;
    });
  };

  const openCompose = (post = null) => { setEditPost(post); setModalOpen(true); };
  const closeModal  = () => { setModalOpen(false); setEditPost(null); };

  const savePost = form => {
    if (!form.text.trim()) { showToast('Please add some content first'); return; }
    if (editPost?.id) {
      setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...form } : p));
      showToast('Post updated successfully');
    } else {
      setPosts(prev => [...prev, { ...form, id: Date.now() }]);
      showToast(form.status === 'draft' ? 'Draft saved' : 'Post scheduled successfully');
    }
    closeModal();
  };

  const deletePost = id => {
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('Post deleted');
  };

  const scheduled = posts.filter(p => p.status === 'scheduled').length;
  const drafts    = posts.filter(p => p.status === 'draft').length;
  const published = posts.filter(p => p.status === 'published').length;

  return (
    <>
      <ToastContainer toasts={toasts} />
      <TopNav />

      <div className="shell">
        <Sidebar />

        <main className="main">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-header__title">CONTENT <span>SCHEDULER</span></h1>
              <p className="page-header__sub">Plan, write and schedule your LinkedIn posts in one place.</p>
            </div>
            <div className="page-header__actions">
              <div className="view-toggle">
                {['month','week','list'].map(v => (
                  <button
                    key={v}
                    className={`view-btn${view === v ? ' view-btn--active' : ''}`}
                    onClick={() => { setView(v); showToast(`Switched to ${v} view`); }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <button className="btn-grad" onClick={() => openCompose()}>+ New post</button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-mini">
              <div className="stat-mini__label">Scheduled</div>
              <div className="stat-mini__val" style={{ color:'var(--violet)' }}>{scheduled}</div>
              <div className="stat-mini__sub">posts this month</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini__label">Drafts</div>
              <div className="stat-mini__val" style={{ color:'var(--amber)' }}>{drafts}</div>
              <div className="stat-mini__sub">waiting to finish</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini__label">Published</div>
              <div className="stat-mini__val" style={{ color:'var(--green)' }}>{published}</div>
              <div className="stat-mini__sub">this month</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini__label">Best time</div>
              <div className="stat-mini__val" style={{ color:'var(--cyan)' }}>9am</div>
              <div className="stat-mini__sub">Tue &amp; Thu for reach</div>
            </div>
          </div>

          {/* Calendar + queue */}
          <div className="content-grid">
            <Calendar
              year={year}
              month={month}
              posts={posts}
              onDayClick={date => openCompose({ date })}
              onPostClick={post => openCompose(post)}
              onMonthChange={changeMonth}
            />
            <PostQueue
              posts={posts}
              filter={filter}
              onFilterChange={setFilter}
              onEdit={openCompose}
              onDelete={deletePost}
            />
          </div>
        </main>
      </div>

      <ComposeModal
        isOpen={modalOpen}
        initial={editPost}
        onClose={closeModal}
        onSave={savePost}
      />
    </>
  );
}