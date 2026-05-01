import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('matches').select('*').order('date', { ascending: false })
  return { props: { matches: data || [] } }
}

export default function Matches({ matches }) {
  const [filter, setFilter] = useState('All')
  const [season, setSeason] = useState('All')

  const seasons = ['All', ...new Set(matches.map(m => m.season).filter(Boolean))]
  const filtered = matches.filter(m => {
    if (filter !== 'All' && m.result !== filter) return false
    if (season !== 'All' && m.season !== season) return false
    return true
  })

  const goals = filtered.reduce((s, m) => s + (m.goals || 0), 0)
  const assists = filtered.reduce((s, m) => s + (m.assists || 0), 0)
  const wins = filtered.filter(m => m.result === 'W').length
  const winRate = filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0

  return (
    <Layout title="Matches">
      {/* Page header */}
      <div className="page-header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>On the Pitch</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.03em', color: 'white', lineHeight: 0.9 }}>Match History</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: '2rem' }}>
          {[{ value: filtered.length, label: 'Matches' }, { value: goals, label: 'Goals' }, { value: assists, label: 'Assists' }, { value: `${winRate}%`, label: 'Win Rate' }].map(s => (
            <div key={s.label} className="stat-block">
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['All', 'W', 'D', 'L'].map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{
              padding: '7px 18px', borderRadius: 3,
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '1px solid', cursor: 'pointer',
              borderColor: filter === r ? '#C9A84C' : '#E8E0D0',
              background: filter === r ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: filter === r ? '#C9A84C' : '#6B6B6B',
              transition: 'all 0.15s',
            }}>
              {r === 'All' ? 'All' : r === 'W' ? 'Wins' : r === 'D' ? 'Draws' : 'Losses'}
            </button>
          ))}
          <select value={season} onChange={e => setSeason(e.target.value)} className="input-field" style={{ width: 150, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
            {seasons.map(s => <option key={s} value={s}>{s === 'All' ? 'All Seasons' : s}</option>)}
          </select>
        </div>

        {/* Matches */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No matches found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}

function MatchCard({ match }) {
  const [open, setOpen] = useState(false)
  const rc = { W: '#1A4731', D: '#3D3000', L: '#4A1515' }
  const tc = { W: '#4ADE80', D: '#FCD34D', L: '#F87171' }
  const rt = { W: 'WIN', D: 'DRAW', L: 'LOSS' }
  return (
    <div style={{ background: 'white', border: '1px solid #E8E0D0', borderLeft: `3px solid ${tc[match.result]}`, overflow: 'hidden', transition: 'all 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 74 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700 }}>{format(new Date(match.date), 'MMM d')}</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, color: '#C9A84C' }}>{format(new Date(match.date), 'yyyy')}</div>
        </div>
        <span style={{ background: rc[match.result], color: tc[match.result], fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 2, letterSpacing: '0.1em', flexShrink: 0 }}>
          {rt[match.result]}
        </span>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>vs {match.opponent}</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{match.competition} · {match.venue} · {match.season}</div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.7rem', letterSpacing: '0.04em', color: '#0A0A0A', minWidth: 60, textAlign: 'center' }}>
          {match.our_score}–{match.opponent_score}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ label: 'G', v: match.goals }, { label: 'A', v: match.assists }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.08em' }}>{s.label}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: s.v > 0 ? '#C9A84C' : '#0A0A0A' }}>{s.v}</div>
            </div>
          ))}
        </div>
        {match.player_of_match && <span>⭐</span>}
        <span style={{ color: '#6B6B6B', fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid #F0EBE0', background: '#FAFAF8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Goals', v: match.goals },
              { label: 'Assists', v: match.assists },
              { label: 'Key Passes', v: match.key_passes },
              { label: 'Rating', v: match.rating ? `${match.rating}/10` : '—' },
              { label: 'Minutes', v: match.minutes_played },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', border: '1px solid #E8E0D0', borderTop: '2px solid #C9A84C', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#C9A84C', letterSpacing: '0.04em' }}>{s.v}</div>
              </div>
            ))}
          </div>
          {match.notes && (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontStyle: 'italic', borderLeft: '3px solid #C9A84C', paddingLeft: 12 }}>{match.notes}</p>
          )}
        </div>
      )}
    </div>
  )
}
