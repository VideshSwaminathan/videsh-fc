import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AddHighlight() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', type: 'video', url: '', thumbnail_url: '',
    date: new Date().toISOString().split('T')[0], featured: false,
  })

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); setLoading(false); return }
      setSuccess(true)
      setTimeout(() => router.push('/highlights'), 1500)
    } catch {
      setError('Network error.'); setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add Highlight">
      <div style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>The Reel</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Add Highlight</h1>
        </div>

        {success && <div style={{ background: '#D4EDDA', color: '#155724', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>✓ Highlight added!</div>}
        {error && <div style={{ background: '#F8D7DA', color: '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Type selector */}
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Media Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ val: 'video', label: '▶ Video (YouTube)' }, { val: 'photo', label: '📷 Photo' }].map(t => (
                <button key={t.val} type="button" onClick={() => set('type', t.val)} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: '1px solid',
                  borderColor: form.type === t.val ? '#C9A84C' : '#E8E0D0',
                  background: form.type === t.val ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: form.type === t.val ? '#C9A84C' : '#6B6B6B',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, transition: 'all 0.2s',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Title *</label>
            <input type="text" className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Hat-trick vs City Rovers" required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">
              {form.type === 'video' ? 'YouTube URL *' : 'Image URL *'}
            </label>
            <input type="url" className="input-field" value={form.url} onChange={e => set('url', e.target.value)}
              placeholder={form.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://your-image-url.com/photo.jpg'} required />
            {form.type === 'video' && (
              <p style={{ fontSize: 11, color: '#6B6B6B', marginTop: 4 }}>YouTube thumbnail will be auto-generated</p>
            )}
          </div>

          {form.type === 'photo' && (
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Thumbnail URL (optional)</label>
              <input type="url" className="input-field" value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="Optional separate thumbnail" />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Description</label>
            <textarea className="input-field" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the highlight" rows={2} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Date *</label>
            <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} required />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <input type="checkbox" id="feat" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#C9A84C' }} />
            <label htmlFor="feat" style={{ fontSize: 14, cursor: 'pointer' }}>⭐ Feature this highlight</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : '🎬 Add Highlight'}
            </button>
            <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
