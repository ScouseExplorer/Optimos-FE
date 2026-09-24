import React from 'react';
import { useNavigate } from 'react-router-dom';
import './onboarding.css';

const initialSteps = [
  { title: 'Connect LinkedIn', description: 'Sync your profile and let Optimos understand your audience.', done: false, accent: 'cyan' },
  { title: 'Set your focus', description: 'Choose brand growth, lead generation, or thought leadership.', done: false, accent: 'violet' },
  { title: 'Launch your first post', description: 'Use the scheduler to publish a strong opening post.', done: false, accent: 'pink' },
];

const quickActions = [
  { title: 'Open AI assistant', detail: 'Generate positioning copy and post ideas in minutes.', path: '/aichat', badge: 'Fastest start' },
  { title: 'View dashboard', detail: 'Track growth, reach, and engagement from one place.', path: '/dashboard', badge: 'Live insights' },
  { title: 'Schedule content', detail: 'Plan your next batch of posts without the scramble.', path: '/contentscheduler', badge: 'Smart timing' },
];

const highlights = [
  'Profile optimization in under 10 minutes',
  'AI-generated hooks and content direction',
  'Weekly momentum tracking and reporting',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const steps = initialSteps;
  const completedCount = steps.filter((step) => step.done).length;

  return (
    <div className="onboarding-page">
      <div className="onboarding-shell">
        <header className="onboarding-hero">
          <div className="onboarding-hero__content">
            <span className="onboarding-pill">New here? Start here</span>
            <h1>Welcome to your growth setup</h1>
            <p>
              In a few minutes, you can turn your profile into a smarter, more active presence with content,
              reach, and momentum built in.
            </p>

            <div className="onboarding-actions">
              <button className="btn-grad" onClick={() => navigate('/aichat')}>
                Launch AI assistant
              </button>
              <button className="btn-outline" onClick={() => navigate('/contentscheduler')}>
                Plan first post
              </button>
            </div>

            <div className="onboarding-highlights">
              {highlights.map((item) => (
                <div key={item} className="onboarding-highlight-item">{item}</div>
              ))}
            </div>
          </div>

          <div className="onboarding-card onboarding-card--highlight">
            <div className="onboarding-progress">
              <div className="onboarding-progress__bar">
                <span style={{ width: `${(completedCount / steps.length) * 100}%` }} />
              </div>
              <p>{completedCount} of {steps.length} steps completed</p>
            </div>

            <ul className="onboarding-checklist">
              {steps.map((step) => (
                <li key={step.title} className={`${step.done ? 'is-complete' : ''} onboarding-step--${step.accent}`}>
                  <span className="check-pill">{step.done ? '✓' : '•'}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section className="onboarding-grid">
          <article className="onboarding-card">
            <div className="onboarding-card__header">
              <div>
                <p className="onboarding-eyebrow">Your next move</p>
                <h2>Pick your first win</h2>
              </div>
            </div>
            <div className="onboarding-tiles">
              {quickActions.map((action) => (
                <button key={action.title} className="onboarding-tile" onClick={() => navigate(action.path)}>
                  <span className="onboarding-tile__badge">{action.badge}</span>
                  <strong>{action.title}</strong>
                  <span>{action.detail}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="onboarding-card">
            <div className="onboarding-card__header">
              <div>
                <p className="onboarding-eyebrow">Why this works</p>
                <h2>Built for momentum</h2>
              </div>
            </div>
            <ul className="onboarding-feature-list">
              <li>Turn profile edits into a stronger first impression.</li>
              <li>Use AI to create content that sounds like you, not a template.</li>
              <li>Keep your schedule full so your growth stays consistent.</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
