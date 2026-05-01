import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function ManageMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { loadMatches() }, [])

  async function loadMatches() {
    setLoading(true)
    const res = await fetch('/api/matches')
    const data = await res.json()
    setMatches(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this match? This cannot be undone.')) return
    const res = await fetch('/api/matches', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ id }),
    })
    if (res.ok) { setMsg({ type: 'success', text: 'Match deleted.' }); loadMatches() }
    else setMsg({ type: 'error', text: 'Failed to delete.' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/matches', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify(editing),
    })
    if (res.ok) { setMsg({ type: 'success', text: 'Match updated!' }); setEditing(null); loadMatches() }
    else setMsg({ type: 'error', text: 'Failed to update.' })
    setSaving(false)
    setTimeout(() => setMsg(null), 3000)
  }

  function setField(key, val) { setEditing(prev => ({ ...prev, [key]: val })) }

  const resultColors = { W: '#D4EDDA', D: '#FFF3CD', L: '#F8D7DA' }
  const resultTextColor = { W: '#155724', D: '#856404', L: '#721C24' }

  return (
    <AdminLayout title="Manage Matches">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Admin</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Manage Matches</h1>
      </div>

      {msg && (
        <div style={{ background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6B6B6B' }}>Loading...</p>
      ) : matches.length === 0 ? (
        <p style={{ color: '#6B6B6B' }}>No matches yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {matches.map(m => (
            <div key={m.id} style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, overflow: 'hidden' }}>
              {editing?.id === m.id ? (
                /* ── Edit form ── */
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
                    {[
                      { label: 'Date', key: 'date', type: 'date' },
                      { label: 'Opponent', key: 'opponent', type: 'text' },
                      { label: 'Competition', key: 'competition', type: 'text' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>{f.label}</label>
                        <input type={f.type} value={editing[f.key] || ''} onChange={e => setField(f.key, e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
                    {[
                      { label: 'Our Score', key: 'our_score', type: 'number' },
                      { label: 'Opp Score', key: 'opponent_score', type: 'number' },
                      { label: 'Goals', key: 'goals', type: 'number' },
                      { label: 'Assists', key: 'assists', type: 'number' },
                      { label: 'Key Passes', key: 'key_passes', type: 'number' },
                      { label: 'Rating', key: 'rating', type: 'number' },
                      { label: 'Minutes', key: 'minutes_played', type: 'number' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>{f.label}</label>
                        <input type={f.type} value={editing[f.key] || ''} onChange={e => setField(f.key, e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Result</label>
                      <select value={editing.result || 'W'} onChange={e => setField('result', e.target.value)} className="input-field" style={{ fontSize: 13 }}>
                        <option value="W">Win</option>
                        <option value="D">Draw</option>
                        <option value="L">Loss</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Notes</label>
                    <textarea value={editing.notes || ''} onChange={e => setField('notes', e.target.value)} className="input-field" rows={2} style={{ resize: 'vertical', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <input type="checkbox" checked={!!editing.player_of_match} onChange={e => setField('player_of_match', e.target.checked)} style={{ accentColor: '#C9A84C' }} />
                    <span style={{ fontSize: 13 }}>⭐ Player of the Match</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px' }}>
                      {saving ? 'Saving...' : '✓ Save Changes'}
                    </button>
                    <button onClick={() => setEditing(null)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* ── View row ── */
                <div style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#6B6B6B', minWidth: 70 }}>
                    {format(new Date(m.date), 'MMM d, yyyy')}
                  </span>
                  <span style={{ background: resultColors[m.result], color: resultTextColor[m.result], fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                    {m.result === 'W' ? 'Win' : m.result === 'D' ? 'Draw' : 'Loss'}
                  </span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>vs {m.opponent}</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>{m.our_score}–{m.opponent_score}</span>
                  <span style={{ fontSize: 12, color: '#C9A84C' }}>⚽ {m.goals} · 🎯 {m.assists}</span>
                  {m.player_of_match && <span>⭐</span>}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditing({ ...m })} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ background: 'rgba(248,215,218,0.5)', border: '1px solid rgba(220,53,69,0.2)', color: '#dc3545', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
