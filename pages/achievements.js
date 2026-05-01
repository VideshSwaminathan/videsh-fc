import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('achievements').select('*').order('date', { ascending: false })
  return { props: { achievements: data || [] } }
}

const CATS = ['All', 'Trophy', 'Award', 'Personal Record', 'Milestone', 'Other']

export default function Achievements({ achievements }) {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? achievements : achievements.filter(a => a.category === cat)

  return (
    <Layout title="Achievements">
      <div className="page-header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Hall of Fame</div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.03em', color: 'white', lineHeight: 0.9 }}>Achievements</h1>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 12 }}>
            {achievements.length} Achievements & Counting
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem', flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '7px 18px', borderRadius: 3,
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '1px solid',
              borderColor: cat === c ? '#C9A84C' : '#E8E0D0',
              background: cat === c ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: cat === c ? '#C9A84C' : '#6B6B6B',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No achievements in this category.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {filtered.map(a => <AchievementCard key={a.id} a={a} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}

function AchievementCard({ a }) {
  return (
    <div className="achievement-card" style={{ position: 'relative' }}>
      {a.featured && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <span className="gold-badge">⭐ Featured</span>
        </div>
      )}
      <div style={{ fontSize: 44, marginBottom: 16 }}>{a.emoji}</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{a.category}</div>
      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', letterSpacing: '0.03em', color: '#0A0A0A', marginBottom: 10, lineHeight: 1.1 }}>{a.title}</h3>
      {a.description && <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 16 }}>{a.description}</p>}
      <div style={{ borderTop: '1px solid #E8E0D0', paddingTop: 12, marginTop: 'auto' }}>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {format(new Date(a.date), 'MMMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}
