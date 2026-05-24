import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { demoUser } from '@markec/mototrack-platform.hooks.use-auth';
import { ProtectedRoute } from './protected-route.js';

// ─── Shared layout helpers ────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
};

const dashboardStyle: React.CSSProperties = {
  padding: '40px 32px',
  maxWidth: '960px',
  margin: '0 auto',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '8px',
  marginTop: 0,
};

const headingStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '28px',
  fontWeight: 800,
  color: '#f1f5f9',
  letterSpacing: '-0.03em',
};

const subStyle: React.CSSProperties = {
  margin: '0 0 40px',
  fontSize: '15px',
  color: '#94a3b8',
  lineHeight: 1.6,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '16px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: '#64748b',
  marginBottom: '8px',
};

const cardValueStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 800,
  color: '#f1f5f9',
  letterSpacing: '-0.03em',
};

const cardAccentStyle: React.CSSProperties = {
  ...cardValueStyle,
  color: '#f97316',
};

// ─── Mock Dashboard Content ───────────────────────────────────────────────────

function MockDashboard() {
  const stats = [
    { label: 'Total Rides', value: '142', accent: false },
    { label: 'Total Distance', value: '8,430 km', accent: false },
    { label: 'Top Speed', value: '247 km/h', accent: true },
    { label: 'Rider Level', value: 'Level 8', accent: true },
  ];

  return (
    <div style={dashboardStyle}>
      <p style={labelStyle}>Rider Dashboard</p>
      <h1 style={headingStyle}>Welcome back, Markec 🏍️</h1>
      <p style={subStyle}>
        You&apos;re authenticated and authorized. Here&apos;s your riding overview.
      </p>
      <div style={gridStyle}>
        {stats.map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div style={cardLabelStyle}>{stat.label}</div>
            <div style={stat.accent ? cardAccentStyle : cardValueStyle}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mock Admin Panel Content ─────────────────────────────────────────────────

function MockAdminPanel() {
  const rows = [
    { name: 'Markec', role: 'admin', status: 'Active', points: 5430 },
    { name: 'Carlos Ruiz', role: 'rider', status: 'Active', points: 3210 },
    { name: 'Luka Horvat', role: 'rider', status: 'Suspended', points: 1890 },
  ];

  return (
    <div style={dashboardStyle}>
      <p style={labelStyle}>Admin Panel</p>
      <h1 style={headingStyle}>User Management</h1>
      <p style={subStyle}>
        Only users with the <strong style={{ color: '#f97316' }}>admin</strong> role can access this section.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {rows.map((row) => (
          <div
            key={row.name}
            style={{
              ...cardStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{row.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {row.points.toLocaleString()} pts
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: row.role === 'admin' ? 'rgba(249,115,22,0.15)' : 'rgba(100,116,139,0.15)',
                  color: row.role === 'admin' ? '#f97316' : '#94a3b8',
                  border: `1px solid ${row.role === 'admin' ? 'rgba(249,115,22,0.3)' : 'rgba(100,116,139,0.2)'}`,
                }}
              >
                {row.role}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: row.status === 'Active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  color: row.status === 'Active' ? '#22c55e' : '#ef4444',
                  border: `1px solid ${row.status === 'Active' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                }}
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Authenticated — user is logged in, protected content is rendered.
 * Uses mockUser to bypass GraphQL auth and show the dashboard directly.
 */
export const AuthenticatedRider = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <ProtectedRoute redirectTo="/login" mockUser={demoUser}>
          <MockDashboard />
        </ProtectedRoute>
      </div>
    </MockProvider>
  );
};

/**
 * AdminOnly — route restricted to users with the 'admin' role.
 * An admin variant of the demo user is passed to show the panel.
 */
export const AdminOnlyRoute = () => {
  const adminUser = { ...demoUser, role: 'admin' } as typeof demoUser;

  return (
    <MockProvider>
      <div style={pageStyle}>
        <ProtectedRoute redirectTo="/login" allowedRoles={['admin']} mockUser={adminUser}>
          <MockAdminPanel />
        </ProtectedRoute>
      </div>
    </MockProvider>
  );
};

/**
 * LoadingOverlay — visual preview of the spinner overlay shown while auth resolves.
 * Rendered as a static composition so the overlay is always visible.
 */
export const LoadingOverlay = () => {
  return (
    <MockProvider>
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#020617' }}>
        {/* Blurred background to simulate page content behind the overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '32px',
            filter: 'blur(4px)',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                height: '120px',
                border: '1px solid rgba(148,163,184,0.12)',
              }}
            />
          ))}
        </div>

        {/* Static overlay card — mirrors what ProtectedRoute renders while isLoading */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              padding: '40px 48px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'rgba(249,115,22,0.12)',
                borderRadius: '9999px',
                border: '1px solid rgba(249,115,22,0.25)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f97316',
                  boxShadow: '0 0 6px rgba(249,115,22,0.8)',
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#f97316',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                PROTECTED ROUTE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '4px solid rgba(148,163,184,0.12)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '4px solid transparent',
                    borderTopColor: '#f97316',
                    borderRightColor: '#f97316',
                  }}
                />
              </div>
              <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 500 }}>
                Verifying your credentials...
              </span>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
