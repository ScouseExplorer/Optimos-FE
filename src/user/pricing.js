import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './pricing.css';
 
/* ─── DATA ─── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    desc: 'Everything you need to get started and test the waters.',
    popular: false,
    features: [
      { text: '1 LinkedIn profile audit',        included: true },
      { text: '5 AI-generated post ideas / month', included: true },
      { text: 'Basic engagement analytics',       included: true },
      { text: 'Community access',                 included: true },
      { text: 'Content calendar',                 included: false },
      { text: 'Connection outreach tools',        included: false },
      { text: 'Priority support',                 included: false },
    ],
    ctaLabel: 'Get started free',
    ctaRoute: '/aichat',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 23,
    desc: 'The full growth engine for professionals serious about LinkedIn.',
    popular: true,
    features: [
      { text: 'Unlimited profile audits',          included: true },
      { text: 'Unlimited AI post generation',      included: true },
      { text: 'Full content calendar',             included: true },
      { text: 'Connection outreach sequences',     included: true },
      { text: 'Advanced analytics dashboard',      included: true },
      { text: 'Priority email support',            included: true },
      { text: 'Dedicated account manager',         included: false },
    ],
    ctaLabel: 'Start Pro trial',
    ctaRoute: '/aichat',
  },
  {
    id: 'agency',
    name: 'Agency',
    monthlyPrice: 79,
    annualPrice: 63,
    desc: 'Multi-seat power for teams, agencies, and enterprise brands.',
    popular: false,
    features: [
      { text: 'Everything in Pro',          included: true },
      { text: 'Up to 10 team seats',        included: true },
      { text: 'White-label reporting',      included: true },
      { text: 'Dedicated account manager',  included: true },
      { text: 'Custom onboarding session',  included: true },
      { text: 'API access',                 included: true },
      { text: 'SLA & 24/7 support',         included: true },
    ],
    ctaLabel: 'Contact sales',
    ctaRoute: '/contact',
  },
];
 
const FAQS = [
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade at any time from your account settings. Changes take effect on your next billing cycle, and we\'ll prorate any difference.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes — the Pro plan comes with a 7-day free trial, no credit card required. The Agency plan includes a 14-day trial when you book a call with our team.',
  },
  {
    q: 'How does annual billing work?',
    a: 'Annual plans are billed as a single payment upfront. You save 20% compared to monthly billing, and your plan renews automatically each year unless you cancel.',
  },
  {
    q: 'What counts as a "team seat"?',
    a: 'Each seat represents one LinkedIn profile being managed inside Optimos. The Agency plan includes up to 10 seats. Need more? Contact us for a custom enterprise quote.',
  },
  {
    q: 'Do you offer discounts for nonprofits or students?',
    a: 'Yes. We offer 50% off the Pro plan for verified students and registered nonprofits. Reach out to contact@optimos.com with proof of eligibility.',
  },
];
 
/* ─── Sub-components ─── */
 
function Nav() {
 
}
 
function BillingToggle({ annual, onToggle }) {
  return (
    <div className="toggle-wrap">
      <span
        className={`toggle-label${!annual ? ' toggle-label--active' : ''}`}
        onClick={() => annual && onToggle()}
      >
        Monthly
      </span>
 
      <button
        className={`toggle-pill${annual ? ' toggle-pill--on' : ''}`}
        onClick={onToggle}
        aria-label="Toggle billing period"
      >
        <span className="toggle-thumb" />
      </button>
 
      <span
        className={`toggle-label${annual ? ' toggle-label--active' : ''}`}
        onClick={() => !annual && onToggle()}
      >
        Annual
      </span>
 
      <span className="save-badge">Save 20%</span>
    </div>
  );
}
 
function PlanCard({ plan, annual }) {
  const navigate = useNavigate();
  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const period = annual ? '/ year' : '/ month';
  const isFree = plan.id === 'free';
 
  return (
    <div className={`plan plan--${plan.id}`}>
      {plan.popular && <span className="popular-badge">Most popular</span>}
 
      <div className="plan__name">{plan.name}</div>
 
      <div className="plan__price">
        {!isFree && <span className="price__currency">£</span>}
        <span className={`price__amount price__amount--${plan.id}`}>
          {isFree ? '£0' : price}
        </span>
        {!isFree && <span className="price__period">{period}</span>}
      </div>
 
      <p className="plan__desc">{plan.desc}</p>
 
      <div className="plan__divider" />
 
      <ul className="features">
        {plan.features.map(({ text, included }) => (
          <li key={text} className="feature">
            <span className={`feature__tick tick--${plan.id}${!included ? ' tick--dim' : ''}`}>
              {included ? '✓' : '—'}
            </span>
            <span className={`feature__text${!included ? ' feature__text--dim' : ''}`}>
              {text}
            </span>
          </li>
        ))}
      </ul>
 
      <button
        className={`plan__cta cta--${plan.id}`}
        onClick={() => navigate(plan.ctaRoute)}
      >
        {plan.ctaLabel}
      </button>
    </div>
  );
}
 
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item${open ? ' faq-item--open' : ''}`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="faq-item__question">
        {q}
        <span className="faq-item__arrow">+</span>
      </div>
      <div className="faq-item__answer">{a}</div>
    </div>
  );
}
 
/* ─── Main page ─── */
export default function Pricing() {
  const [annual, setAnnual] = useState(false);
 
  return (
    <>
      <Nav />
 
      <div className="page">
 
        {/* HERO */}
        <div className="pricing-hero">
          <span className="section__tag">Simple, transparent pricing</span>
          <h1 className="pricing-hero__title">
            PICK YOUR <span>PLAN</span>
          </h1>
          <p className="pricing-hero__desc">
            No hidden fees, no lock-in. Choose the tier that fits where you
            are today — upgrade anytime.
          </p>
          <BillingToggle annual={annual} onToggle={() => setAnnual(a => !a)} />
        </div>
 
        {/* PLANS */}
        <div className="plans">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} annual={annual} />
          ))}
        </div>
 
        {/* GUARANTEE */}
        <div className="guarantee">
          <div className="guarantee__icon">🛡</div>
          <h3 className="guarantee__title">14-DAY MONEY-BACK GUARANTEE</h3>
          <p className="guarantee__desc">
            Not satisfied in your first two weeks? We'll refund you in full,
            no questions asked.
          </p>
        </div>
 
        {/* FAQ */}
        <div className="faq-section">
          <div className="faq-inner">
            <h2 className="faq__title">COMMON QUESTIONS</h2>
            {FAQS.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
 
      </div>
 
      {/* FOOTER */}
      <footer className="footer">
        <span className="footer__logo">lynxstrat</span>
        <p>© 2026 Optimos. All rights reserved.</p>
        <nav className="footer__links">
          {['Privacy', 'Terms', 'Blog', 'Contact'].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
        </nav>
      </footer>
    </>
  );
}