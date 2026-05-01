import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function ManageHighlights() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/highlights')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this highlight?')) return
    const res = await fetch('/api/highlights', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id }) })
    if (res.ok) { setMsg({ type: 'success', text: 'Deleted!' }); load() }
    else setMsg({ type: 'error', text: 'Failed.' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/highlights', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(editing) })
    if (res.ok) { setMsg({ type: 'success', text: 'Updated!' }); setEditing(null); load() }
    else setMsg({ type: 'error', text: 'Failed.' })
    setSaving(false)
    setTimeout(() => setMsg(null), 3000)
  }

  function setField(key, val) { setEditing(prev => ({ ...prev, [key]: val })) }

  return (
    <AdminLayout title="Manage Highlights">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Admin</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Manage Highlights</h1>
      </div>

      {msg && <div style={{ background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>{msg.text}</div>}

      {loading ? <p style={{ color: '#6B6B6B' }}>Loading...</p> : items.length === 0 ? <p style={{ color: '#6B6B6B' }}>No highlights yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(h => (
            <div key={h.id} style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, overflow: 'hidden' }}>
              {editing?.id === h.id ? (
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Title</label>
                      <input value={editing.title || ''} onChange={e => setField('title', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Date</label>
                      <input type="date" value={editing.date || ''} onChange={e => setField('date', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>URL</label>
                    <input value={editing.url || ''} onChange={e => setField('url', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Description</label>
                    <textarea value={editing.description || ''} onChange={e => setField('description', e.target.value)} className="input-field" rows={2} style={{ resize: 'vertical', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {['video', 'photo'].map(t => (
                      <button key={t} type="button" onClick={() => setField('type', t)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${editing.type === t ? '#C9A84C' : '#E8E0D0'}`, background: editing.type === t ? 'rgba(201,168,76,0.1)' : 'transparent', color: editing.type === t ? '#C9A84C' : '#6B6B6B', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, textTransform: 'capitalize' }}>{t}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <input type="checkbox" checked={!!editing.featured} onChange={e => setField('featured', e.target.checked)} style={{ accentColor: '#C9A84C' }} />
                    <span style={{ fontSize: 13 }}>⭐ Featured</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px' }}>{saving ? 'Saving...' : '✓ Save'}</button>
                    <button onClick={() => setEditing(null)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{h.type === 'video' ? '▶' : '📷'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{h.title}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B' }}>{h.type} · {format(new Date(h.date), 'MMM d, yyyy')}</div>
                  </div>
                  {h.featured && <span className="gold-badge">Featured</span>}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditing({ ...h })} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Edit</button>
                    <button onClick={() => handleDelete(h.id)} style={{ background: 'rgba(248,215,218,0.5)', border: '1px solid rgba(220,53,69,0.2)', color: '#dc3545', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Delete</button>
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
