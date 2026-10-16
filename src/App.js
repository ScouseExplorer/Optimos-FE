import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ChatApp from './functionality/aichat.jsx';
import Functionality from './functionality/funchome.jsx';
import Pricing from './user/pricing.js';
import Dashboard from './functionality/dashboard.jsx';
import Settings from './functionality/settings.jsx';
import ContentScheduler from './functionality/contentscheduler.jsx';
import Onboarding from './functionality/onboarding.jsx';
import SubscriptionPage from './functionality/subscription.jsx';
import CreditsPage from './functionality/credits.jsx';
import UsagePage from './functionality/usage.jsx';
import ExperiencesPage from './functionality/experiences.jsx';
import OpinionsPage from './functionality/opinions.jsx';
import PostsPage from './functionality/posts.jsx';
import AdminDashboard from'./admin/admindashboard.jsx';
import Login from './Login/Login.jsx';
import CreateAccount from './Login/createaccount.jsx';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import NotAuthorized from './auth/NotAuthorized.jsx';
import { apiClient } from './api/client';
 
/* ─── Nav ─── */
function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const jumpTo = sectionId => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate(`/?section=${sectionId}`);
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav__logo">
        <span>Optimos</span>
      </Link>
      <ul className="nav__links">
        <li><button type="button" onClick={() => jumpTo('services')}>Services</button></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><button type="button" onClick={() => jumpTo('why')}>Why us</button></li>
        <li><button type="button" onClick={() => jumpTo('contact')}>Contact</button></li>
        <li><Link to="/onboarding">Onboarding</Link></li>
        <li>
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="nav__cta">
            {isAuthenticated ? 'Open app' : 'Get started'}
          </Link>
        </li>
        {isAdmin && <li><Link to="/admin">Admin</Link></li>}
        {isAuthenticated && (
          <li>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
 
/* ─── Marquee ─── */
const MARQUEE_ITEMS = [
  'Profile Optimization','Content Strategy','Connection Building',
  'Analytics','AI-Powered Insights','Engagement Tracking','Brand Growth',
];
 
function Marquee() {
  // doubled for seamless loop
  const items = [...MARQUEE_ITEMS, '·', ...MARQUEE_ITEMS, '·',
                 ...MARQUEE_ITEMS, '·', ...MARQUEE_ITEMS, '·'];
  return (
    <div className="marquee">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i} className={item === '·' ? 'dot' : ''}>{item}</span>
        ))}
      </div>
    </div>
  );
}
 
/* ─── Services ─── */
const SERVICES = [
  { color: 'violet', icon: '⚡', title: 'Profile Optimization',
    desc: 'We audit and rewrite your profile to convert visitors into connections — headline, about, experience, the lot.' },
  { color: 'cyan',   icon: '✍️', title: 'Content Strategy',
    desc: 'AI-assisted post calendars, hooks, and formats tailored to your niche and audience behaviour.' },
  { color: 'pink',   icon: '🔗', title: 'Connection Building',
    desc: 'Targeted outreach sequences that grow your network with the right people, not just anyone.' },
  { color: 'amber',  icon: '📊', title: 'Analytics & Reporting',
    desc: "Clear dashboards that tell you what's working, what's not, and exactly what to do next week." },
];
 
/* ─── Home page ─── */
function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.search]);
 
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
 
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          LinkedIn Growth Platform
        </div>
 
        <h1 className="hero__title">
          GROW YOUR<br />
          <span className="t-cyan">LINKED</span>
          <span className="t-grad">IN</span><br />
          INFLUENCE
        </h1>
 
        <p className="hero__sub">
          Optimos turns your profile into a growth engine — smarter content,
          deeper reach, real connections that matter.
        </p>
 
        <div className="hero__actions">
          <button className="btn-grad" onClick={() => navigate('/aichat')}>
            Start for free
          </button>
          <button className="btn-outline" onClick={() => navigate('/funchome')}>
            See features →
          </button>
        </div>
 
        <div className="hero__stats">
          <div className="stat">
            <div className="stat__num stat__num--cyan">12K+</div>
            <div className="stat__label">Professionals</div>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <div className="stat__num stat__num--grad">340%</div>
            <div className="stat__label">Avg reach growth</div>
          </div>
          <div className="stat__divider" />
          <div className="stat">
            <div className="stat__num stat__num--amber">4.9★</div>
            <div className="stat__label">User rating</div>
          </div>
        </div>
      </section>
 
      <Marquee />
 
      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-inner">
          <div className="section__tag">What we do</div>
          <h2 className="section__title">EVERYTHING YOU NEED<br />TO STAND OUT</h2>
          <p className="section__desc">
            A full toolkit designed around how LinkedIn actually works —
            not how you assume it does.
          </p>
 
          <div className="services-grid">
            {SERVICES.map(({ color, icon, title, desc }) => (
              <div key={title} className={`card card--${color}`}>
                <div className={`icon-box icon-box--${color}`}>{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* WHY */}
      <section className="section section--alt" id="why">
        <div className="section-inner">
          <div className="why-split">
 
            {/* floating dashboard cards */}
            <div className="why-visual">
              <div className="float-card float-card--a">
                <div className="mini-tag">Avg. engagement lift</div>
                <div className="big-num big-num--cyan">+340%</div>
                <div className="bar-list">
                  {[
                    ['Post impressions', '88%', 'violet'],
                    ['Profile views',    '72%', 'cyan'],
                    ['Connection rate',  '60%', 'amber'],
                  ].map(([label, w, c]) => (
                    <div key={label}>
                      <div className="bar-name">{label}</div>
                      <div className="bar-track">
                        <div className={`bar-fill bar-fill--${c}`} style={{ width: w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="float-card float-card--b">
                <div className="mini-tag">Users onboarded</div>
                <div className="big-num">12,450</div>
                <div className="trend">↑ 38% this quarter</div>
              </div>
            </div>
 
            {/* copy */}
            <div>
              <div className="section__tag">Why Optimos</div>
              <h2 className="section__title">BUILT FOR<br />REAL GROWTH</h2>
              <p className="section__desc">
                No vanity metrics. No fluff. Just strategies that move the
                needle on reach, relevance, and revenue.
              </p>
 
              <div className="why-checks">
                {[
                  { box: 'cyan',   title: 'Competitive pricing',         desc: 'Agency-level strategy without the agency price tag — plans that scale with you.' },
                  { box: 'violet', title: 'Overnight brand impact',       desc: 'Measurable improvements in your first week — profile views, post reach, inbound messages.' },
                  { box: 'pink',   title: 'Expanded reach, on autopilot', desc: "AI-powered scheduling and targeting means you grow even when you're not actively posting." },
                ].map(({ box, title, desc }) => (
                  <div key={title} className="why-item">
                    <div className={`check-box check-box--${box}`}>✓</div>
                    <div className="why-text">
                      <h4>{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <div className="section__tag" style={{ marginBottom: '1rem' }}>Ready to grow?</div>
          <h2>
            START BUILDING YOUR<br />
            <span>PRESENCE TODAY</span>
          </h2>
          <p>
            Join thousands of professionals who've already transformed
            their LinkedIn with Optimos.
          </p>
          <div className="cta-btns">
            <button className="btn-grad btn-lg" onClick={() => navigate('/aichat')}>
              Get started free
            </button>
            <a href="mailto:contact@optimos.com" className="btn-outline btn-lg"
               style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              Contact us
            </a>
          </div>
          <p className="fine">No credit card required · Cancel anytime</p>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="footer">
        <span className="footer__logo">lynxstrat</span>
        <p>© 2026 Optimos. All rights reserved.</p>
        <nav className="footer__links">
          {['Privacy', 'Terms', 'Blog', 'About'].map(l => (
            <button key={l} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'none', fontSize: 'inherit' }}>{l}</button>
          ))}
        </nav>
      </footer>
    </>
  );
}
 
/* ─── Contact page ─── */
function Contact() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '6rem 2rem', position: 'relative', zIndex: 1,
    }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: '3rem' }}>
        <h2 className="section__title" style={{ fontSize: '3rem' }}>GET IN TOUCH</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.65 }}>
          We'd love to hear from you. Reach out and we'll respond within 24 hours.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <a href="mailto:contact@optimos.com"
             style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>
            contact@optimos.com
          </a>
          <span style={{ color: 'var(--muted)' }}>+1 (123) 456-7890</span>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__card">
        <h1>404</h1>
        <p>The page you requested does not exist.</p>
        <button className="btn-grad" onClick={() => navigate('/')}>Go home</button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [rateLimitNotice, setRateLimitNotice] = useState(null);
  const isMarketingRoute = ['/', '/pricing', '/contact', '/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const unsubscribe = apiClient.rateLimit.subscribe((context) => {
      if (!context || Number(context.status) !== 429) {
        return;
      }

      const cooldownMs = Number(context.cooldownMs) > 0 ? Number(context.cooldownMs) : 5000;
      const retryInSeconds = Math.ceil(cooldownMs / 1000);

      setRateLimitNotice({
        message: `Rate limit reached. Retry in ${retryInSeconds}s.`,
        requestId: context.requestId || null,
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!rateLimitNotice) return;

    const timeout = setTimeout(() => {
      setRateLimitNotice(null);
    }, 7000);

    return () => clearTimeout(timeout);
  }, [rateLimitNotice]);

  return (
    <>
      {rateLimitNotice && (
        <div className="rate-limit-banner" role="alert">
          <span>{rateLimitNotice.message}</span>
          {rateLimitNotice.requestId && <span className="rate-limit-banner__id">Request ID: {rateLimitNotice.requestId}</span>}
        </div>
      )}
      {isMarketingRoute && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CreateAccount />} />
        <Route path="/aichat" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
        <Route path="/funchome" element={<ProtectedRoute><Functionality /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/contentscheduler" element={<ProtectedRoute><ContentScheduler /></ProtectedRoute>} />
        <Route path="/content" element={<Navigate to="/contentscheduler" replace />} />
        <Route path="/scheduler" element={<Navigate to="/contentscheduler" replace />} />
        <Route path="/profile" element={<Navigate to="/funchome" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
        <Route path="/connections" element={<Navigate to="/funchome" replace />} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
        <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />
        <Route path="/usage" element={<ProtectedRoute><UsagePage /></ProtectedRoute>} />
        <Route path="/experiences" element={<ProtectedRoute><ExperiencesPage /></ProtectedRoute>} />
        <Route path="/opinions" element={<ProtectedRoute><OpinionsPage /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
 
/* ─── Root ─── */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
