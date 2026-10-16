import React from 'react';
import { useNavigate } from 'react-router-dom';
import './funchome.css';
import InternalAppShell from '../layout/InternalAppShell.jsx';
import { useSubscriptionData } from '../subscription/useSubscriptionData';

const MODULES = [
    {
        title: 'Performance Dashboard',
        description: 'Track profile reach, engagement, and growth trends in one place.',
        route: '/dashboard',
        badge: 'Live',
        entitlementKey: 'advanced_analytics',
    },
    {
        title: 'Content Scheduler',
        description: 'Plan, draft, and schedule posts with queue controls and calendar view.',
        route: '/contentscheduler',
        badge: 'Core',
        entitlementKey: 'content_scheduler',
    },
    {
        title: 'AI Chat Assistant',
        description: 'Generate hooks, rewrite posts, and brainstorm strategy prompts quickly.',
        route: '/aichat',
        badge: 'Beta',
        entitlementKey: 'ai_chat',
    },
    {
        title: 'Account Settings',
        description: 'Manage profile details, notifications, integrations, and security.',
        route: '/settings',
        badge: 'Admin',
    },
    {
        title: 'Subscription & Entitlements',
        description: 'Check your tier, usage remaining, credits balance, and upgrade options.',
        route: '/subscription',
        badge: 'Plan',
    },
    {
        title: 'Credits Wallet',
        description: 'Track current credit balance, transaction ledger, and feature costs.',
        route: '/credits',
        badge: 'Billing',
    },
    {
        title: 'AI Usage Logs',
        description: 'Review generation status, token counts, and credits charged over time.',
        route: '/usage',
        badge: 'Logs',
    },
    {
        title: 'Experiences Manager',
        description: 'Create, edit, and remove your user-scoped experiences records.',
        route: '/experiences',
        badge: 'CRUD',
    },
    {
        title: 'Opinions Manager',
        description: 'Maintain your opinions dataset with paginated API-backed records.',
        route: '/opinions',
        badge: 'CRUD',
    },
    {
        title: 'Posts Manager',
        description: 'Manage posts directly through authenticated user post endpoints.',
        route: '/posts',
        badge: 'CRUD',
    },
];

export default function Functionality() {
    const navigate = useNavigate();
    const { canUseFeature, isLoading } = useSubscriptionData();

    return (
        <InternalAppShell title="Profile" activeNav="profile">
            <main className="funchome-page">
                <header className="funchome-hero">
                    <p className="funchome-kicker">Workspace</p>
                    <h1>Welcome to your Optimos app</h1>
                    <p>
                        Everything below is connected to real routes so you can move through the platform
                        as a product, not a static presentation.
                    </p>
                </header>

                <section className="funchome-grid" aria-label="App modules">
                    {MODULES.map(module => (
                        <article key={module.title} className={`funchome-card${module.entitlementKey && !isLoading && !canUseFeature(module.entitlementKey) ? ' funchome-card--locked' : ''}`}>
                            <div className="funchome-card__top">
                                <h2>{module.title}</h2>
                                <span>{module.entitlementKey && !isLoading && !canUseFeature(module.entitlementKey) ? 'Locked' : module.badge}</span>
                            </div>
                            <p>{module.description}</p>
                            <button
                                onClick={() => navigate(module.entitlementKey && !isLoading && !canUseFeature(module.entitlementKey) ? '/subscription' : module.route)}
                                className="funchome-card__cta"
                            >
                                {module.entitlementKey && !isLoading && !canUseFeature(module.entitlementKey) ? 'Upgrade plan' : 'Open module'}
                            </button>
                        </article>
                    ))}
                </section>
            </main>
        </InternalAppShell>
    );
}