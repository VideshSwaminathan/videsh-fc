import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const [{ data: matches }, { data: achievements }, { data: profile }] = await Promise.all([
    supabase.from('matches').select('*').order('date', { ascending: false }),
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
      stats: { totalMatches: allMatches.length, totalGoals, totalAssists, winRate },
    },
  }
}

export default function Home({ recentMatches, featuredAchievements, profile, stats }) {
  return (
    <Layout title="Home" description="Videsh FC — Personal Football Portfolio">

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        overflow: 'hidden',
        background: '#FFFFFF',
      }}>
        {/* Left — Text */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 5rem)',
          paddingTop: 'clamp(5rem, 10vw, 8rem)',
          position: 'relative', zIndex: 2,
        }}>
          {/* Top accent line */}
          <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, #E8C96B, #C9A84C)', marginBottom: 24, borderRadius: 2 }} />

          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              background: 'linear-gradient(135deg, #E8C96B, #C9A84C)',
              color: '#2D2105', fontSize: 11, fontWeight: 700,
              padding: '5px 14px', borderRadius: 20,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              ⚽ Midfielder · Chennai
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
            fontWeight: 600, color: '#0A0A0A',
            lineHeight: 1.0, marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            {profile.name || 'Videsh'}
          </h1>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#C9A84C', marginBottom: '1.5rem',
          }}>
            {profile.club || 'School XI'}
          </h2>

          {/* Bio */}
          <p style={{
            fontSize: 15, color: '#6B6B6B',
            lineHeight: 1.8, maxWidth: 420, marginBottom: '2.5rem',
          }}>
            {profile.bio || 'Passionate midfielder from Chennai with a love for the beautiful game. Every match is a chance to grow.'}
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/matches" className="btn-gold">View Matches →</Link>
            <Link href="/achievements" className="btn-outline">Achievements</Link>
          </div>

          {/* Mini stats row */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { value: stats.totalMatches, label: 'Matches' },
              { value: stats.totalGoals, label: 'Goals' },
              { value: stats.totalAssists, label: 'Assists' },
              { value: `${stats.winRate}%`, label: 'Win Rate' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 600, color: '#C9A84C', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Photo */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A' }}>
          {/* Gold overlay gradient */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to right, rgba(255,255,255,0.15) 0%, transparent 30%), linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)',
          }} />

          {/* The trophy photo */}
          <img
            src="/videsh-hero.jpg"
            alt="Videsh with the Runner-Up trophy"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
            }}
          />

          {/* Trophy label overlay */}
          <div style={{
            position: 'absolute', bottom: 32, left: 32, zIndex: 2,
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 12, padding: '14px 18px',
          }}>
            <div style={{ fontSize: 10, color: '#C9A84C', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Little Legends League
            </div>
            <div style={{ fontSize: 15, color: 'white', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>
              🏆 Runner-Up · Under 13
            </div>
          </div>
        </div>

        {/* Decorative gold line on left edge */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: 2,
          background: 'linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)',
          opacity: 0.3,
        }} />
      </section>

      {/* ── RECENT MATCHES ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#FAFAF8' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <p className="section-eyebrow">On the Pitch</p>
              <h2 className="section-title">Recent Matches</h2>
            </div>
            <Link href="/matches" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>All Matches →</Link>
          </div>
          <div className="gold-line" style={{ marginBottom: '1.75rem' }} />
          {recentMatches.length === 0 ? (
            <p style={{ color: '#6B6B6B', textAlign: 'center', padding: '3rem' }}>No matches yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentMatches.map(match => <MatchRow key={match.id} match={match} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      {featuredAchievements.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: '#FFFFFF' }}>
          <div className="max-w-6xl mx-auto">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <div>
                <p className="section-eyebrow">Hall of Fame</p>
                <h2 className="section-title">Achievements</h2>
              </div>
              <Link href="/achievements" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
            </div>
            <div className="gold-line" style={{ marginBottom: '1.75rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {featuredAchievements.map(a => (
                <div key={a.id} className="achievement-card">
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{a.emoji}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6 }}>{a.description}</p>
                  <div style={{ marginTop: 14 }}>
                    <span style={{ fontSize: 10, color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{a.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="max-w-3xl mx-auto text-center" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>The Player</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>
            About Videsh
          </h2>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)', maxWidth: 120, margin: '0 auto 2rem' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            {profile.bio || 'Passionate midfielder from Chennai with a love for the beautiful game. Started playing young and never looked back.'}
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Position', value: profile.position || 'Midfielder' },
              { label: 'Club', value: profile.club || 'School XI' },
              { label: 'City', value: profile.city || 'Chennai' },
              { label: 'Jersey', value: `#${profile.jersey_number || 8}` },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: '#E8C96B' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  )
}

function MatchRow({ match }) {
  const resultColors = { W: '#D4EDDA', D: '#FFF3CD', L: '#F8D7DA' }
  const resultTextColor = { W: '#155724', D: '#856404', L: '#721C24' }
  const resultText = { W: 'Win', D: 'Draw', L: 'Loss' }
  return (
    <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'white' }}>
      <div style={{ minWidth: 80 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{format(new Date(match.date), 'MMM d')}</div>
        <div style={{ fontSize: 11, color: '#C9A84C' }}>{format(new Date(match.date), 'yyyy')}</div>
      </div>
      <span style={{ background: resultColors[match.result], color: resultTextColor[match.result], fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
        {resultText[match.result]}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>vs {match.opponent}</div>
        <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{match.competition} · {match.venue}</div>
      </div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600 }}>{match.our_score}–{match.opponent_score}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[{ label: 'G', value: match.goals }, { label: 'A', value: match.assists }, { label: 'KP', value: match.key_passes }].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B6B6B', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontWeight: 600, color: s.value > 0 ? '#C9A84C' : '#0A0A0A' }}>{s.value}</div>
          </div>
        ))}
      </div>
      {match.player_of_match && <span title="Player of the Match">⭐</span>}
    </div>
  )
}
