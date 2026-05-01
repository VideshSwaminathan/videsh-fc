import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('highlights').select('*').order('date', { ascending: false })
  return { props: { highlights: data || [] } }
}

function getYtId(url) {
  const patterns = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^&]+)/, /youtube\.com\/embed\/([^?&]+)/]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return null
}

export default function Highlights({ highlights }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const filtered = filter === 'All' ? highlights : highlights.filter(h => h.type === filter)

  return (
    <Layout title="Highlights">
      <div className="page-header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>The Reel</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.03em', color: 'white', lineHeight: 0.9 }}>Highlights</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {[{ val: 'All', label: 'All Media' }, { val: 'video', label: '▶ Videos' }, { val: 'photo', label: '📷 Photos' }].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)} style={{
              padding: '7px 18px', borderRadius: 3,
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '1px solid',
              borderColor: filter === f.val ? '#C9A84C' : '#E8E0D0',
              background: filter === f.val ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: filter === f.val ? '#C9A84C' : '#6B6B6B',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{f.label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No highlights yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
            {filtered.map(h => <HighlightCard key={h.id} h={h} onClick={() => setSelected(h)} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, overflow: 'hidden', maxWidth: 740, width: '100%' }}>
            {selected.type === 'video' && getYtId(selected.url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe src={`https://www.youtube.com/embed/${getYtId(selected.url)}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            ) : selected.type === 'photo' ? (
              <img src={selected.url} alt={selected.title} style={{ width: '100%', maxHeight: 440, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <a href={selected.url} target="_blank" rel="noreferrer" className="btn-gold">Open Video ↗</a>
              </div>
            )}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.03em', color: 'white', marginBottom: 4 }}>{selected.title}</h3>
                  {selected.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{selected.description}</p>}
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 700, color: '#C9A84C', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{format(new Date(selected.date), 'MMMM d, yyyy')}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: 3, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700 }}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

function HighlightCard({ h, onClick }) {
  const ytId = h.type === 'video' ? getYtId(h.url) : null
  const thumb = h.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null)
  return (
    <div onClick={onClick} style={{ background: '#0A0A0A', border: '1px solid #1A1A1A', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#1A1A1A'; }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#141414', overflow: 'hidden' }}>
        {thumb ? (
          <img src={thumb} alt={h.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 40 }}>
            {h.type === 'video' ? '▶' : '🖼'}
          </div>
        )}
        {/* Play overlay */}
        {h.type === 'video' && thumb && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ width: 52, height: 52, background: 'rgba(201,168,76,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#0A0A0A', fontSize: 18, marginLeft: 4 }}>▶</span>
            </div>
          </div>
        )}
        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(4px)', color: 'white', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {h.type}
          </span>
          {h.featured && <span className="gold-badge">⭐</span>}
        </div>
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: '0.03em', color: 'white', marginBottom: 4 }}>{h.title}</h3>
        {h.description && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{h.description}</p>}
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 700, color: '#C9A84C', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{format(new Date(h.date), 'MMM d, yyyy')}</p>
      </div>
    </div>
  )
}
