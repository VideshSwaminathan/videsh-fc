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
  const results = ['All', 'W', 'D', 'L']

  const filtered = matches.filter(m => {
    if (filter !== 'All' && m.result !== filter) return false
    if (season !== 'All' && m.season !== season) return false
    return true
  })

  const totalGoals = filtered.reduce((s, m) => s + (m.goals || 0), 0)
  const totalAssists = filtered.reduce((s, m) => s + (m.assists || 0), 0)
  const wins = filtered.filter(m => m.result === 'W').length
  const winRate = filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0

  return (
    <Layout title="Matches" description="Full match history and statistics">
      {/* Header */}
      <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #E8E0D0', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow">On the Pitch</p>
          <h1 className="section-title">Match History</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto" style={{ padding: '2rem 1.5rem' }}>
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '2rem' }}>
          {[
            { value: filtered.length, label: 'Matches' },
            { value: totalGoals, label: 'Goals' },
            { value: totalAssists, label: 'Assists' },
            { value: `${winRate}%`, label: 'Win Rate' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {results.map(r => (
              <button key={r} onClick={() => setFilter(r)} style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: filter === r ? '#C9A84C' : '#E8E0D0',
                background: filter === r ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: filter === r ? '#C9A84C' : '#6B6B6B',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: filter === r ? 600 : 400,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}>
                {r === 'W' ? 'Wins' : r === 'D' ? 'Draws' : r === 'L' ? 'Losses' : 'All'}
              </button>
            ))}
          </div>
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="input-field"
            style={{ width: 140 }}
          >
            {seasons.map(s => <option key={s} value={s}>{s === 'All' ? 'All Seasons' : s}</option>)}
          </select>
        </div>

        {/* Match list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>
            No matches found for the selected filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false)
  const resultColors = { W: '#D4EDDA', D: '#FFF3CD', L: '#F8D7DA' }
  const resultText = { W: 'Win', D: 'Draw', L: 'Loss' }
  const resultTextColor = { W: '#155724', D: '#856404', L: '#721C24' }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date */}
        <div style={{ minWidth: 70 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{format(new Date(match.date), 'MMM d')}</div>
          <div style={{ fontSize: 11, color: '#C9A84C' }}>{format(new Date(match.date), 'yyyy')}</div>
        </div>

        {/* Result pill */}
        <span style={{
          background: resultColors[match.result],
          color: resultTextColor[match.result],
          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
          letterSpacing: '0.04em', flexShrink: 0,
        }}>
          {resultText[match.result]}
        </span>

        {/* Opponent & competition */}
        <div style={{ flex: 1, minWidth: 150 }}>
          <div style={{ fontWeight: 500, fontSize: 15 }}>vs {match.opponent}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>
            {match.competition} · {match.venue} · {match.season}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center', minWidth: 56 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600 }}>
            {match.our_score}–{match.opponent_score}
          </div>
        </div>

        {/* My quick stats */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Goals', value: match.goals },
            { label: 'Assists', value: match.assists },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontWeight: 600, color: s.value > 0 ? '#C9A84C' : '#0A0A0A' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {match.player_of_match && <span title="Player of Match">⭐</span>}

        {/* Expand chevron */}
        <span style={{ fontSize: 12, color: '#6B6B6B', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid #E8E0D0', background: '#FAFAF8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Goals', value: match.goals },
              { label: 'Assists', value: match.assists },
              { label: 'Key Passes', value: match.key_passes },
              { label: 'Rating', value: match.rating ? `${match.rating}/10` : '—' },
              { label: 'Minutes', value: match.minutes_played },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#C9A84C' }}>{s.value}</div>
              </div>
            ))}
          </div>
          {match.notes && (
            <p style={{ fontSize: 13, color: '#6B6B6B', fontStyle: 'italic', borderLeft: '2px solid #C9A84C', paddingLeft: 12 }}>
              {match.notes}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
