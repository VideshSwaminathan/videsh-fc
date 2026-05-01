import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const FOCUS_AREAS = ['Passing', 'Dribbling', 'Shooting', 'Defending', 'Fitness', 'Set Pieces', 'Positioning', 'Heading', 'Speed', 'Tactical']

export default function ManageTraining() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/training')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this training session?')) return
    const res = await fetch('/api/training', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id }) })
    if (res.ok) { setMsg({ type: 'success', text: 'Deleted!' }); load() }
    else setMsg({ type: 'error', text: 'Failed.' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/training', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(editing) })
    if (res.ok) { setMsg({ type: 'success', text: 'Updated!' }); setEditing(null); load() }
    else setMsg({ type: 'error', text: 'Failed.' })
    setSaving(false)
    setTimeout(() => setMsg(null), 3000)
  }

  function setField(key, val) { setEditing(prev => ({ ...prev, [key]: val })) }

  const intensityColors = { Low: { bg: '#D4EDDA', text: '#155724' }, Medium: { bg: '#FFF3CD', text: '#856404' }, High: { bg: '#F8D7DA', text: '#721C24' } }

  return (
    <AdminLayout title="Manage Training">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Admin</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600 }}>Manage Training</h1>
      </div>

      {msg && <div style={{ background: msg.type === 'success' ? '#D4EDDA' : '#F8D7DA', color: msg.type === 'success' ? '#155724' : '#721C24', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>{msg.text}</div>}

      {loading ? <p style={{ color: '#6B6B6B' }}>Loading...</p> : items.length === 0 ? <p style={{ color: '#6B6B6B' }}>No sessions yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(s => (
            <div key={s.id} style={{ background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, overflow: 'hidden' }}>
              {editing?.id === s.id ? (
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Date</label>
                      <input type="date" value={editing.date || ''} onChange={e => setField('date', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Duration (min)</label>
                      <input type="number" value={editing.duration_minutes || ''} onChange={e => setField('duration_minutes', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Focus Area</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {FOCUS_AREAS.map(a => (
                        <button key={a} type="button" onClick={() => setField('focus_area', a)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${editing.focus_area === a ? '#C9A84C' : '#E8E0D0'}`, background: editing.focus_area === a ? 'rgba(201,168,76,0.1)' : 'transparent', color: editing.focus_area === a ? '#C9A84C' : '#6B6B6B', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>{a}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Intensity</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['Low', 'Medium', 'High'].map(i => (
                        <button key={i} type="button" onClick={() => setField('intensity', i)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${editing.intensity === i ? '#C9A84C' : '#E8E0D0'}`, background: editing.intensity === i ? 'rgba(201,168,76,0.1)' : 'transparent', color: editing.intensity === i ? '#C9A84C' : '#6B6B6B', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>{i}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Drills</label>
                    <input value={editing.drills || ''} onChange={e => setField('drills', e.target.value)} className="input-field" style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Notes</label>
                    <textarea value={editing.notes || ''} onChange={e => setField('notes', e.target.value)} className="input-field" rows={2} style={{ resize: 'vertical', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ fontSize: 13, padding: '8px 18px' }}>{saving ? 'Saving...' : '✓ Save'}</button>
                    <button onClick={() => setEditing(null)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B6B6B', minWidth: 70 }}>{format(new Date(s.date), 'MMM d, yyyy')}</span>
                  <span style={{ background: intensityColors[s.intensity]?.bg, color: intensityColors[s.intensity]?.text, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s.intensity}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{s.focus_area}</div>
                    {s.drills && <div style={{ fontSize: 12, color: '#6B6B6B' }}>{s.drills}</div>}
                  </div>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: '#C9A84C' }}>{s.duration_minutes}m</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditing({ ...s })} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Edit</button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: 'rgba(248,215,218,0.5)', border: '1px solid rgba(220,53,69,0.2)', color: '#dc3545', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Delete</button>
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
