import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const [{ data: matches }, { data: achievements }, { data: profile }] = await Promise.all([
    supabase.from('matches').select('*').order('date', { ascending: false }).limit(5),
    supabase.from('achievements').select('*').eq('featured', true).order('date', { ascending: false }).limit(3),
    supabase.from('profile').select('*').single(),
  ])

  const allMatches = matches || []
  const totalGoals = allMatches.reduce((s, m) => s + (m.goals || 0), 0)
  const totalAssists = allMatches.reduce((s, m) => s + (m.assists || 0), 0)
  const wins = allMatches.filter(m => m.result === 'W').length
  const winRate = allMatches.length > 0 ? Math.round((wins / allMatches.length) * 100) : 0

  return {
    props: {
      recentMatches: allMatches.slice(0, 5),
      featuredAchievements: achievements || [],
      profile: profile || {},
      stats: {
        totalMatches: allMatches.length,
        totalGoals,
        totalAssists,
        winRate,
      },
    },
  }
}

export default function Home({ recentMatches, featuredAchievements, profile, stats }) {
  return (
    <Layout title="Home" description="Videsh FC — Personal Football Portfolio">
      {/* ── HERO ── */}
      <section className="hero-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem' }}>
        <div className="hero-bg-pattern" />

        {/* Decorative gold lines */}
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0 }}>
          <div className="gold-line" />
        </div>

        <div className="max-w-4xl mx-auto text-center" style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div className="animate-fade-up animate-delay-1">
            <span className="gold-badge">⚽ Midfielder · Chennai, India</span>
          </div>

          {/* Main headline */}
          <h1 className="animate-fade-up animate-delay-2" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: 600,
            color: '#0A0A0A',
            lineHeight: 1.0,
            marginTop: '1.25rem',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            {profile.name || 'Videsh'}
          </h1>

          {/* Tagline */}
          <p className="animate-fade-up animate-delay-3" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.4rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#6B6B6B',
            maxWidth: 480,
            margin: '0 auto 2rem',
            lineHeight: 1.5,
          }}>
            {profile.tagline || 'Playing the beautiful game with passion and purpose'}
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up animate-delay-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link href="/matches" className="btn-gold">View Matches →</Link>
            <Link href="/achievements" className="btn-outline">Achievements</Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up animate-delay-5" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            maxWidth: 640,
            margin: '0 auto',
          }}>
            {[
              { value: stats.totalMatches, label: 'Matches' },
              { value: stats.totalGoals, label: 'Goals' },
              { value: stats.totalAssists, label: 'Assists' },
              { value: `${stats.winRate}%`, label: 'Win Rate' },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeIn 1s ease 1s both',
        }}>
          <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #C9A84C, transparent)' }} />
        </div>
      </section>

      {/* ── RECENT MATCHES ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p className="section-eyebrow">On the Pitch</p>
              <h2 className="section-title">Recent Matches</h2>
            </div>
            <Link href="/matches" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>
              All Matches →
            </Link>
          </div>

          <div className="gold-line" style={{ marginBottom: '2rem' }} />

          {recentMatches.length === 0 ? (
            <EmptyState message="No matches recorded yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentMatches.map(match => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      {featuredAchievements.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: '#FAFAF8' }}>
          <div className="max-w-6xl mx-auto">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <p className="section-eyebrow">Hall of Fame</p>
                <h2 className="section-title">Achievements</h2>
              </div>
              <Link href="/achievements" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>
                View All →
              </Link>
            </div>
            <div className="gold-line" style={{ marginBottom: '2rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {featuredAchievements.map(a => (
                <div key={a.id} className="achievement-card">
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{a.emoji}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: 6 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.5 }}>{a.description}</p>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>{a.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT SECTION ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow">The Player</p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>About Me</h2>
          <div className="gold-line" style={{ maxWidth: 120, margin: '0 auto 2rem' }} />
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.3rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#444',
            lineHeight: 1.8,
            maxWidth: 600,
            margin: '0 auto 2rem',
          }}>
            {profile.bio || 'Passionate midfielder from Chennai with a love for the beautiful game. Started playing in school and haven\'t looked back since.'}
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Position', value: profile.position || 'Midfielder' },
              { label: 'Club', value: profile.club || 'School XI' },
              { label: 'City', value: profile.city || 'Chennai' },
              { label: 'Jersey', value: `#${profile.jersey_number || 8}` },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 600, color: '#0A0A0A' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function MatchRow({ match }) {
  const resultColors = { W: 'badge-w', D: 'badge-d', L: 'badge-l' }
  const resultText = { W: 'Win', D: 'Draw', L: 'Loss' }

  return (
    <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      {/* Date */}
      <div style={{ minWidth: 80 }}>
        <div style={{ fontSize: 11, color: '#6B6B6B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {format(new Date(match.date), 'MMM d')}
        </div>
        <div style={{ fontSize: 12, color: '#C9A84C', fontWeight: 500 }}>
          {format(new Date(match.date), 'yyyy')}
        </div>
      </div>

      {/* Result badge */}
      <span className={`${resultColors[match.result] || 'badge-d'}`} style={{
        fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em',
      }}>
        {resultText[match.result]}
      </span>

      {/* Opponent & score */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>vs {match.opponent}</div>
        <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>
          {match.competition} · {match.venue}
        </div>
      </div>

      {/* Score */}
      <div style={{ textAlign: 'center', minWidth: 60 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600 }}>
          {match.our_score}–{match.opponent_score}
        </div>
      </div>

      {/* My stats */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'G', value: match.goals },
          { label: 'A', value: match.assists },
          { label: 'KP', value: match.key_passes },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B6B6B', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontWeight: 600, color: s.value > 0 ? '#C9A84C' : '#0A0A0A' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {match.player_of_match && (
        <span title="Player of the Match" style={{ fontSize: 16 }}>⭐</span>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B6B6B', fontSize: 14 }}>
      {message}
    </div>
  )
}
