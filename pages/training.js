import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('training_sessions').select('*').order('date', { ascending: false })
  return { props: { sessions: data || [] } }
}

const IC = { Low: { bg: '#1A4731', text: '#4ADE80' }, Medium: { bg: '#3D3000', text: '#FCD34D' }, High: { bg: '#4A1515', text: '#F87171' } }

export default function Training({ sessions }) {
  const totalMins = sessions.reduce((s, t) => s + (t.duration_minutes || 0), 0)
  const totalHours = Math.round(totalMins / 60)
  const avgDur = sessions.length > 0 ? Math.round(totalMins / sessions.length) : 0

  const focusMap = {}
  sessions.forEach(s => { if (!focusMap[s.focus_area]) focusMap[s.focus_area] = 0; focusMap[s.focus_area]++ })
  const topFocus = Object.entries(focusMap).sort((a, b) => b[1] - a[1])

  return (
    <Layout title="Training">
      <div className="page-header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>The Grind</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.03em', color: 'white', lineHeight: 0.9 }}>Training Log</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: '2.5rem' }}>
          {[{ v: sessions.length, l: 'Sessions' }, { v: `${totalHours}h`, l: 'Hours' }, { v: `${avgDur}m`, l: 'Avg Duration' }].map(s => (
            <div key={s.l} className="stat-block">
              <div className="stat-num">{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Focus breakdown */}
        {topFocus.length > 0 && (
          <div style={{ background: '#0A0A0A', border: '1px solid rgba(201,168,76,0.15)', padding: '2rem', marginBottom: '2.5rem' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Focus Areas</div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'white', letterSpacing: '0.03em', marginBottom: '1.5rem' }}>Where I Train Most</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {topFocus.map(([area, count]) => {
                const pct = Math.round((count / sessions.length) * 100)
                return (
                  <div key={area}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white' }}>{area}</span>
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>{count} sessions · {pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #E8C96B, #C9A84C)', borderRadius: 2, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Session list */}
        <div>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.03em', marginBottom: '1rem' }}>All Sessions</h3>
          {sessions.length === 0 ? (
            <p style={{ color: '#6B6B6B', textAlign: 'center', padding: '3rem' }}>No sessions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sessions.map(s => {
                const ic = IC[s.intensity] || IC.Medium
                return (
                  <div key={s.id} style={{ background: 'white', border: '1px solid #E8E0D0', borderLeft: `3px solid ${ic.text}`, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <div style={{ minWidth: 74 }}>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700 }}>{format(new Date(s.date), 'MMM d')}</div>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, color: '#C9A84C' }}>{format(new Date(s.date), 'yyyy')}</div>
                    </div>
                    <span style={{ background: ic.bg, color: ic.text, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 2, letterSpacing: '0.1em', flexShrink: 0 }}>
                      {s.intensity}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{s.focus_area}</div>
                      {s.drills && <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, color: '#6B6B6B', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>{s.drills}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: '#C9A84C', letterSpacing: '0.04em' }}>{s.duration_minutes}m</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
