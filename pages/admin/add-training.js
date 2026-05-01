import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'

const FOCUS_AREAS = ['Passing', 'Dribbling', 'Shooting', 'Defending', 'Fitness', 'Set Pieces', 'Positioning', 'Heading', 'Speed', 'Tactical']

export default function AddTraining() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    duration_minutes: '60',
    focus_area: 'Passing',
    intensity: 'Medium',
    drills: '',
    notes: '',
    season: '2024-25',
  })

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/training'), 1500)
    } catch {
      setError('Network error.'); setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add Training">
      <div style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Log a Session</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Add Training</h1>
        </div>

        {success && <div style={{ background: '#D4EDDA', color: '#155724', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>✓ Session logged! Redirecting...</div>}
        {error && <div style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label className="input-label">Date *</label>
              <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Duration (minutes) *</label>
              <input type="number" min="15" max="240" className="input-field" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} required />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Focus Area *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FOCUS_AREAS.map(a => (
                <button key={a} type="button" onClick={() => set('focus_area', a)} style={{
                  padding: '7px 14px', borderRadius: 20, border: '1px solid',
                  borderColor: form.focus_area === a ? '#C9A84C' : '#E8E0D0',
                  background: form.focus_area === a ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: form.focus_area === a ? '#C9A84C' : '#6B6B6B',
                  cursor: 'pointer', fontSize: 12, fontWeight: form.focus_area === a ? 600 : 400,
                  fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                }}>{a}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Intensity</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Low', 'Medium', 'High'].map(i => (
                <button key={i} type="button" onClick={() => set('intensity', i)} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: '1px solid',
                  borderColor: form.intensity === i ? '#C9A84C' : '#E8E0D0',
                  background: form.intensity === i ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: form.intensity === i ? '#C9A84C' : '#6B6B6B',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, transition: 'all 0.2s',
                }}>{i}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Drills (comma-separated)</label>
            <input type="text" className="input-field" value={form.drills} onChange={e => set('drills', e.target.value)} placeholder="e.g. Cone drills, 1v1, Ball control" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Season</label>
            <input type="text" className="input-field" value={form.season} onChange={e => set('season', e.target.value)} placeholder="e.g. 2024-25" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Notes</label>
            <textarea className="input-field" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="How did the session go?" rows={3} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : '🏃 Log Session'}
            </button>
            <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
