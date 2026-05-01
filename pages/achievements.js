import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const { data } = await supabase.from('achievements').select('*').order('date', { ascending: false })
  return { props: { achievements: data || [] } }
}

const CATEGORIES = ['All', 'Trophy', 'Award', 'Personal Record', 'Milestone', 'Other']

export default function Achievements({ achievements }) {
  const [cat, setCat] = useState('All')

  const filtered = cat === 'All' ? achievements : achievements.filter(a => a.category === cat)

  return (
    <Layout title="Achievements" description="Trophies, awards and personal records">
      {/* Header */}
      <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #E8E0D0', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-eyebrow">Hall of Fame</p>
          <h1 className="section-title">Achievements</h1>
          <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8 }}>
            {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} and counting
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto" style={{ padding: '2rem 1.5rem' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: cat === c ? '#C9A84C' : '#E8E0D0',
              background: cat === c ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: cat === c ? '#C9A84C' : '#6B6B6B',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: cat === c ? 600 : 400,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6B6B' }}>No achievements in this category yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {filtered.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function AchievementCard({ achievement: a }) {
  return (
    <div className="achievement-card">
      {/* Featured indicator */}
      {a.featured && (
        <div style={{
          position: 'absolute',
          top: 12, right: 12,
          background: 'linear-gradient(135deg, #E8C96B, #C9A84C)',
          color: '#4A3709',
          fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 10,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Featured
        </div>
      )}

      {/* Emoji */}
      <div style={{ fontSize: 40, marginBottom: 16 }}>{a.emoji}</div>

      {/* Category badge */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#C9A84C', background: 'rgba(201,168,76,0.1)',
          padding: '3px 10px', borderRadius: 20,
        }}>
          {a.category}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
        {a.title}
      </h3>

      {/* Description */}
      {a.description && (
        <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 12 }}>{a.description}</p>
      )}

      {/* Date */}
      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #E8E0D0' }}>
        <span style={{ fontSize: 11, color: '#6B6B6B' }}>
          {format(new Date(a.date), 'MMMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}
