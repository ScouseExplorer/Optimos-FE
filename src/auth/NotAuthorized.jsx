import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAuthorized() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#eef6ff' }}>
      <div style={{ width: 'min(540px, 100%)', background: '#fff', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '14px', padding: '1.4rem' }}>
        <p style={{ margin: 0, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: '.72rem' }}>
          Access denied
        </p>
        <h1 style={{ margin: '.6rem 0 .45rem', color: '#17325c' }}>You are not authorized for this page</h1>
        <p style={{ margin: 0, color: 'rgba(23, 50, 92, 0.74)', lineHeight: 1.55 }}>
          Your account is signed in, but it does not have the required admin role.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', border: '1px solid rgba(37, 99, 235, 0.35)', color: '#17325c', borderRadius: '10px', padding: '.5rem .75rem' }}>
            Back to dashboard
          </Link>
          <Link to="/" style={{ textDecoration: 'none', border: '1px solid rgba(37, 99, 235, 0.35)', color: '#17325c', borderRadius: '10px', padding: '.5rem .75rem' }}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
