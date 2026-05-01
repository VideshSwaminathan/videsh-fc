import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AddMatch() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    competition: 'School League',
    venue: 'Home',
    our_score: '',
    opponent_score: '',
    result: 'W',
    goals: '0',
    assists: '0',
    key_passes: '0',
    rating: '',
    minutes_played: '90',
    player_of_match: false,
    notes: '',
    season: '2024-25',
  })

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Auto-compute result from score
  function handleScoreChange(field, val) {
    const updated = { ...form, [field]: val }
    const ours = Number(field === 'our_score' ? val : form.our_score)
    const theirs = Number(field === 'opponent_score' ? val : form.opponent_score)
    if (!isNaN(ours) && !isNaN(theirs) && val !== '') {
      updated.result = ours > theirs ? 'W' : ours < theirs ? 'L' : 'D'
    }
    setForm(updated)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/matches'), 1500)
    } catch {
      setError('Network error. Try again.')
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add Match">
      <div style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Log a Match</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Add Match</h1>
        </div>

        {success && (
          <div style={{ background: '#D4EDDA', color: '#155724', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
            ✓ Match saved! Redirecting...
          </div>
        )}
        {error && (
          <div style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection title="Match Details">
            <FormRow>
              <FormField label="Date" required>
                <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} required />
              </FormField>
              <FormField label="Season">
                <input type="text" className="input-field" value={form.season} onChange={e => set('season', e.target.value)} placeholder="e.g. 2024-25" />
              </FormField>
            </FormRow>
            <FormField label="Opponent" required>
              <input type="text" className="input-field" value={form.opponent} onChange={e => set('opponent', e.target.value)} placeholder="Team name" required />
            </FormField>
            <FormRow>
              <FormField label="Competition">
                <select className="input-field" value={form.competition} onChange={e => set('competition', e.target.value)}>
                  {['School League', 'District Cup', 'Inter-School', 'Friendly', 'State Cup', 'Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Venue">
                <select className="input-field" value={form.venue} onChange={e => set('venue', e.target.value)}>
                  <option>Home</option>
                  <option>Away</option>
                  <option>Neutral</option>
                </select>
              </FormField>
            </FormRow>
          </FormSection>

          <FormSection title="Score & Result">
            <FormRow>
              <FormField label="Our Score" required>
                <input type="number" min="0" className="input-field" value={form.our_score}
                  onChange={e => handleScoreChange('our_score', e.target.value)} placeholder="0" required />
              </FormField>
              <FormField label="Opponent Score" required>
                <input type="number" min="0" className="input-field" value={form.opponent_score}
                  onChange={e => handleScoreChange('opponent_score', e.target.value)} placeholder="0" required />
              </FormField>
              <FormField label="Result">
                <div style={{ display: 'flex', gap: 8 }}>
                  {['W', 'D', 'L'].map(r => (
                    <button
                      key={r} type="button"
                      onClick={() => set('result', r)}
                      style={{
                        flex: 1, padding: '9px', borderRadius: 8, border: '1px solid',
                        borderColor: form.result === r ? '#C9A84C' : '#E8E0D0',
                        background: form.result === r ? 'rgba(201,168,76,0.1)' : 'transparent',
                        color: form.result === r ? '#C9A84C' : '#6B6B6B',
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        fontSize: 13, transition: 'all 0.2s',
                      }}>
                      {r}
                    </button>
                  ))}
                </div>
              </FormField>
            </FormRow>
          </FormSection>

          <FormSection title="My Performance">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Goals', key: 'goals' },
                { label: 'Assists', key: 'assists' },
                { label: 'Key Passes', key: 'key_passes' },
              ].map(f => (
                <FormField key={f.key} label={f.label}>
                  <input type="number" min="0" className="input-field" value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)} placeholder="0" />
                </FormField>
              ))}
            </div>
            <FormRow>
              <FormField label="Rating (1–10)">
                <input type="number" min="1" max="10" step="0.5" className="input-field" value={form.rating}
                  onChange={e => set('rating', e.target.value)} placeholder="e.g. 8.0" />
              </FormField>
              <FormField label="Minutes Played">
                <input type="number" min="0" max="120" className="input-field" value={form.minutes_played}
                  onChange={e => set('minutes_played', e.target.value)} />
              </FormField>
            </FormRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input type="checkbox" id="potm" checked={form.player_of_match} onChange={e => set('player_of_match', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#C9A84C' }} />
              <label htmlFor="potm" style={{ fontSize: 14, cursor: 'pointer', color: '#0A0A0A' }}>
                ⭐ Player of the Match
              </label>
            </div>
          </FormSection>

          <FormSection title="Notes">
            <textarea
              className="input-field"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional — how did you play? Coach feedback?"
              rows={4}
              style={{ resize: 'vertical', minHeight: 90 }}
            />
          </FormSection>

          <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
            <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : '⚽ Save Match'}
            </button>
            <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #E8E0D0' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function FormRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, 1fr)`, gap: 12, marginBottom: 0 }}>{children}</div>
}

function FormField({ label, children, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="input-label">{label}{required && ' *'}</label>
      {children}
    </div>
  )
}
