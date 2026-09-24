import React from 'react';
import { useNavigate } from 'react-router-dom';
import './funchome.css';
import InternalAppShell from '../layout/InternalAppShell.jsx';

const MODULES = [
    {
        title: 'Performance Dashboard',
        description: 'Track profile reach, engagement, and growth trends in one place.',
        route: '/dashboard',
        badge: 'Live',
    },
    {
        title: 'Content Scheduler',
        description: 'Plan, draft, and schedule posts with queue controls and calendar view.',
        route: '/contentscheduler',
        badge: 'Core',
    },
    {
        title: 'AI Chat Assistant',
        description: 'Generate hooks, rewrite posts, and brainstorm strategy prompts quickly.',
        route: '/aichat',
        badge: 'Beta',
    },
    {
        title: 'Account Settings',
        description: 'Manage profile details, notifications, integrations, and security.',
        route: '/settings',
        badge: 'Admin',
    },
];

export default function Functionality() {
    const navigate = useNavigate();

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
                        <article key={module.title} className="funchome-card">
                            <div className="funchome-card__top">
                                <h2>{module.title}</h2>
                                <span>{module.badge}</span>
                            </div>
                            <p>{module.description}</p>
                            <button onClick={() => navigate(module.route)} className="funchome-card__cta">
                                Open module
                            </button>
                        </article>
                    ))}
                </section>
            </main>
        </InternalAppShell>
    );
}