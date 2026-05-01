import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('training_sessions').select('*').order('date', { ascending: false })
  return { props: { sessions: data || [] } }
}

const INTENSITY_COLORS = {
  Low: { bg: '#D4EDDA', text: '#155724' },
  Medium: { bg: '#FFF3CD', text: '#856404' },
  High: { bg: '#F8D7DA', text: '#721C24' },
}

export default function Training({ sessions }) {
  const totalHours = Math.round(sessions.reduce((s, t) => s + (t.duration_minutes || 0), 0) / 60)
  const totalSessions = sessions.length
  const avgDuration = totalSessions > 0
    ? Math.round(sessions.reduce((s, t) => s + (t.duration_minutes || 0), 0) / totalSessions)
    : 0

  // Focus area breakdown
  const focusMap = {}
  sessions.forEach(s => {
    if (!focusMap[s.focus_area]) focusMap[s.focus_area] = 0
    focusMap[s.focus_area]++
  })
  const topFocus = Object.entries(focusMap).sort((a, b) => b[1] - a[1])

  return (
    <Layout title="Training" description="Training sessions and skill development log">
      <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #E8E0D0', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow">The Grind</p>
          <h1 className="section-title">Training Log</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto" style={{ padding: '2rem 1.5rem' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '3rem' }}>
          {[
            { value: totalSessions, label: 'Total Sessions' },
            { value: `${totalHours}h`, label: 'Hours Trained' },
            { value: `${avgDuration}m`, label: 'Avg Duration' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Focus area breakdown */}
        {topFocus.length > 0 && (
          <div style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Focus Areas</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Where I Train Most</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topFocus.map(([area, count]) => {
                const pct = Math.round((count / totalSessions) * 100)
                return (
                  <div key={area}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{area}</span>
                      <span style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>{count} sessions · {pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #E8C96B, #C9A84C)',
                        borderRadius: 3,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: 16 }}>
            All Sessions
          </h3>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No training sessions logged yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map(s => (
                <TrainingCard key={s.id} session={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function TrainingCard({ session: s }) {
  const ic = INTENSITY_COLORS[s.intensity] || INTENSITY_COLORS.Medium
  return (
    <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      {/* Date */}
      <div style={{ minWidth: 70 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{format(new Date(s.date), 'MMM d')}</div>
        <div style={{ fontSize: 11, color: '#C9A84C' }}>{format(new Date(s.date), 'yyyy')}</div>
      </div>

      {/* Intensity */}
      <span style={{ background: ic.bg, color: ic.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
        {s.intensity}
      </span>

      {/* Focus */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>{s.focus_area}</div>
        {s.drills && (
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{s.drills}</div>
        )}
      </div>

      {/* Duration */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#C9A84C' }}>
          {s.duration_minutes}m
        </div>
        <div style={{ fontSize: 11, color: '#6B6B6B' }}>duration</div>
      </div>
    </div>
  )
}
