import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'

const EMOJIS = ['🏆','🥇','🥈','🥉','⭐','🎖️','🏅','🎯','⚽','🔥','💪','🌟','👑','🎉','🎪']
const CATEGORIES = ['Trophy', 'Award', 'Personal Record', 'Milestone', 'Other']

export default function AddAchievement() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: 'Award',
    date: new Date().toISOString().split('T')[0],
    emoji: '🏆', featured: false,
  })

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/achievements'), 1500)
    } catch {
      setError('Network error.'); setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add Achievement">
      <div style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Hall of Fame</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Add Achievement</h1>
        </div>

        {success && <div style={{ background: '#D4EDDA', color: '#155724', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>✓ Achievement added!</div>}
        {error && <div style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Emoji picker */}
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => set('emoji', em)} style={{
                  width: 42, height: 42, borderRadius: 8, border: '1px solid',
                  borderColor: form.emoji === em ? '#C9A84C' : '#E8E0D0',
                  background: form.emoji === em ? 'rgba(201,168,76,0.1)' : 'transparent',
                  cursor: 'pointer', fontSize: 20, transition: 'all 0.2s',
                }}>{em}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Title *</label>
            <input type="text" className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. District Cup Champions" required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Description</label>
            <textarea className="input-field" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell the story behind this achievement" rows={3} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label className="input-label">Category</label>
              <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Date *</label>
              <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#C9A84C' }} />
            <label htmlFor="featured" style={{ fontSize: 14, cursor: 'pointer' }}>⭐ Feature on home page</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : '🏆 Add Achievement'}
            </button>
            <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
