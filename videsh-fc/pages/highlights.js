import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('highlights').select('*').order('date', { ascending: false })
  return { props: { highlights: data || [] } }
}

function getYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function Highlights({ highlights }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? highlights : highlights.filter(h => h.type === filter)

  return (
    <Layout title="Highlights" description="Match highlights and memorable moments">
      <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #E8E0D0', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow">The Reel</p>
          <h1 className="section-title">Highlights</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto" style={{ padding: '2rem 1.5rem' }}>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {['All', 'video', 'photo'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f ? '#C9A84C' : '#E8E0D0',
              background: filter === f ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: filter === f ? '#C9A84C' : '#6B6B6B',
              cursor: 'pointer', fontSize: 12, fontWeight: filter === f ? 600 : 400,
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}>
              {f === 'All' ? 'All Media' : f === 'video' ? '▶ Videos' : '📷 Photos'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No highlights yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(h => (
              <HighlightCard key={h.id} highlight={h} onClick={() => setSelected(h)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: 16, overflow: 'hidden', maxWidth: 700, width: '100%' }}
          >
            {selected.type === 'video' && getYouTubeId(selected.url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(selected.url)}?autoplay=1`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : selected.type === 'photo' ? (
              <img src={selected.url} alt={selected.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <a href={selected.url} target="_blank" rel="noreferrer" className="btn-gold">Open Video ↗</a>
              </div>
            )}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>{selected.title}</h3>
              {selected.description && <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 6 }}>{selected.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: '#C9A84C' }}>{format(new Date(selected.date), 'MMMM d, yyyy')}</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 13 }}>Close ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

function HighlightCard({ highlight: h, onClick }) {
  const ytId = h.type === 'video' ? getYouTubeId(h.url) : null
  const thumb = h.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null)

  return (
    <div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={onClick}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#F5F5F5', overflow: 'hidden' }}>
        {thumb ? (
          <img src={thumb} alt={h.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 36 }}>
            {h.type === 'video' ? '▶' : '🖼'}
          </div>
        )}
        {/* Type badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(10,10,10,0.7)', color: 'white',
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
          backdropFilter: 'blur(4px)',
        }}>
          {h.type === 'video' ? '▶ Video' : '📷 Photo'}
        </div>
        {h.featured && (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className="gold-badge">⭐ Featured</span>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{h.title}</h3>
        {h.description && <p style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>{h.description}</p>}
        <p style={{ fontSize: 11, color: '#C9A84C', marginTop: 8 }}>{format(new Date(h.date), 'MMM d, yyyy')}</p>
      </div>
    </div>
  )
}
