import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const [m, t, a, h] = await Promise.all([
        fetch('/api/matches').then(r => r.json()),
        fetch('/api/training').then(r => r.json()),
        fetch('/api/achievements').then(r => r.json()),
        fetch('/api/highlights').then(r => r.json()),
      ])
      const matches = Array.isArray(m) ? m : []
      const training = Array.isArray(t) ? t : []
      setStats({
        matches: matches.length,
        goals: matches.reduce((s, x) => s + (x.goals || 0), 0),
        assists: matches.reduce((s, x) => s + (x.assists || 0), 0),
        training: training.length,
        achievements: Array.isArray(a) ? a.length : 0,
        highlights: Array.isArray(h) ? h.length : 0,
        trainingHours: Math.round(training.reduce((s, t) => s + (t.duration_minutes || 0), 0) / 60),
      })
    }
    load()
  }, [])

  const quickActions = [
    { href: '/admin/add-match', label: 'Add Match', icon: '⚽', desc: 'Log a new match result' },
    { href: '/admin/add-training', label: 'Log Training', icon: '🏃', desc: 'Record a training session' },
    { href: '/admin/add-achievement', label: 'Add Achievement', icon: '🏆', desc: 'Add a trophy or award' },
    { href: '/admin/add-highlight', label: 'Add Highlight', icon: '🎬', desc: 'Upload a video or photo' },
  ]

  return (
    <AdminLayout title="Dashboard">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Welcome back</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
        {stats ? [
          { value: stats.matches, label: 'Matches' },
          { value: stats.goals, label: 'Goals' },
          { value: stats.assists, label: 'Assists' },
          { value: stats.training, label: 'Sessions' },
          { value: `${stats.trainingHours}h`, label: 'Training' },
          { value: stats.achievements, label: 'Awards' },
          { value: stats.highlights, label: 'Highlights' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white',
            border: '1px solid #E8E0D0',
            borderTop: '2px solid #C9A84C',
            borderRadius: 12,
            padding: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, color: '#C9A84C' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', color: '#6B6B6B', fontSize: 14, padding: '1rem' }}>Loading...</div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: '1px solid #E8E0D0',
                borderRadius: 12,
                padding: '1.25rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E0D0'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{action.label}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View site link */}
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Your portfolio is live</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>Public can view your achievements and stats</div>
        </div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button className="btn-gold" style={{ padding: '8px 16px', fontSize: 12 }}>View Site ↗</button>
        </Link>
      </div>
    </AdminLayout>
  )
}
