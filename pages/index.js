import Layout from '../components/Layout'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export async function getServerSideProps() {
  const [{ data: matches }, { data: achievements }, { data: profile }] = await Promise.all([
    supabase.from('matches').select('*').order('date', { ascending: false }),
    supabase.from('achievements').select('*').eq('featured', true).order('date', { ascending: false }).limit(3),
    supabase.from('profile').select('*').single(),
  ])
  const all = matches || []
  const goals = all.reduce((s, m) => s + (m.goals || 0), 0)
  const assists = all.reduce((s, m) => s + (m.assists || 0), 0)
  const wins = all.filter(m => m.result === 'W').length
  const winRate = all.length > 0 ? Math.round((wins / all.length) * 100) : 0
  return { props: {
    recentMatches: all.slice(0, 5),
    achievements: achievements || [],
    profile: profile || {},
    stats: { matches: all.length, goals, assists, winRate },
  }}
}

export default function Home({ recentMatches, achievements, profile, stats }) {
  return (
    <Layout title="Home">

      {/* ════ HERO BANNER ════ */}
      <section style={{ width: '100%', minHeight: '92vh', display: 'grid', gridTemplateColumns: '55% 45%', background: '#0A0A0A', position: 'relative', overflow: 'hidden', marginTop: 0 }}>

        {/* Left — Text panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 6rem)', paddingTop: 'clamp(5rem, 10vw, 8rem)', position: 'relative', zIndex: 2 }}>

          {/* Position badge */}
          <div className="anim-fade-up d1" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 2, background: 'linear-gradient(90deg, #E8C96B, #C9A84C)', display: 'inline-block', borderRadius: 2 }} />
              Midfielder · Chennai, India
            </span>
          </div>

          {/* Name — huge Bebas */}
          <div className="anim-fade-up d2" style={{ marginBottom: 8 }}>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4.5rem, 9vw, 8rem)', letterSpacing: '0.03em', lineHeight: 0.9, color: 'white' }}>
              {profile.name || 'Videsh'}
            </h1>
          </div>

          {/* Club & jersey */}
          <div className="anim-fade-up d3" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#C9A84C', letterSpacing: '0.05em' }}>
                {profile.club || 'School XI'}
              </span>
              <span style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                #{profile.jersey_number || 8}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="anim-fade-up d3" style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 400, marginBottom: 36 }}>
            {profile.bio || 'Passionate midfielder from Chennai building a career in the beautiful game — one match at a time.'}
          </p>

          {/* CTAs */}
          <div className="anim-fade-up d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/matches" className="btn-gold">View Matches →</Link>
            <Link href="/achievements" className="btn-outline-white">Achievements</Link>
          </div>

          {/* Stats strip */}
          <div className="anim-fade-up d5" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { value: stats.matches, label: 'Matches' },
              { value: stats.goals, label: 'Goals' },
              { value: stats.assists, label: 'Assists' },
              { value: `${stats.winRate}%`, label: 'Win Rate' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '1rem', textAlign: 'center', background: 'rgba(10,10,10,0.6)', borderRight: i < 3 ? '1px solid rgba(201,168,76,0.1)' : 'none' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', color: '#E8C96B', letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Photo with diagonal clip */}
        <div style={{ position: 'relative', overflow: 'hidden', clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
          <img src="/videsh-hero.jpg" alt="Videsh with trophy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          {/* Dark gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.6) 0%, transparent 40%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 40%)' }} />
          {/* Trophy tag */}
          <div style={{ position: 'absolute', bottom: 28, right: 28, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 4, padding: '12px 16px' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 4 }}>Little Legends League</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: 'white', letterSpacing: '0.04em' }}>🏆 Runner-Up · U13</div>
          </div>
        </div>

        {/* Gold bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #E8C96B, #C9A84C, #8B6914)', zIndex: 10 }} />
      </section>

      {/* ════ RECENT MATCHES ════ */}
      <section style={{ padding: '5rem 1.5rem', background: '#F8F7F4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>On the Pitch</div>
              <h2 className="section-heading">Recent Matches</h2>
            </div>
            <Link href="/matches" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>
              All Matches →
            </Link>
          </div>
          <div style={{ height: 3, background: 'linear-gradient(90deg, #E8C96B, #C9A84C, transparent)', marginBottom: '1.5rem', borderRadius: 2 }} />

          {recentMatches.length === 0 ? (
            <p style={{ color: '#6B6B6B', padding: '3rem', textAlign: 'center' }}>No matches yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentMatches.map(m => <MatchRow key={m.id} match={m} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════ FEATURED ACHIEVEMENTS ════ */}
      {achievements.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(201,168,76,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Hall of Fame</div>
                <h2 className="section-heading section-heading-light">Achievements</h2>
              </div>
              <Link href="/achievements" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #E8C96B, #C9A84C, transparent)', marginBottom: '2rem', borderRadius: 2 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
              {achievements.map(a => (
                <div key={a.id} style={{ background: '#141414', border: '1px solid rgba(201,168,76,0.12)', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{a.emoji}</div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>{a.category}</div>
                  <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: '0.03em', color: 'white', marginBottom: 10 }}>{a.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ ABOUT STRIP ════ */}
      <section style={{ padding: '5rem 1.5rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>The Player</div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>About<br/>Videsh</h2>
          </div>
          <div>
            <p style={{ fontSize: 17, color: '#444', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 300 }}>
              {profile.bio || 'Passionate midfielder from Chennai with a love for the beautiful game. Started playing in school and never looked back.'}
            </p>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'Position', value: profile.position || 'Midfielder' },
                { label: 'Club', value: profile.club || 'School XI' },
                { label: 'City', value: profile.city || 'Chennai' },
                { label: 'Jersey', value: `#${profile.jersey_number || 8}` },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.04em', color: '#0A0A0A' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}

function MatchRow({ match }) {
  const rc = { W: '#1A4731', D: '#3D3000', L: '#4A1515' }
  const tc = { W: '#4ADE80', D: '#FCD34D', L: '#F87171' }
  const rt = { W: 'WIN', D: 'DRAW', L: 'LOSS' }
  return (
    <div className="card-sport" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'white' }}>
      <div style={{ minWidth: 80 }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700, color: '#0A0A0A' }}>{format(new Date(match.date), 'MMM d')}</div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, color: '#C9A84C', letterSpacing: '0.04em' }}>{format(new Date(match.date), 'yyyy')}</div>
      </div>
      <span style={{ background: rc[match.result], color: tc[match.result], fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 2, letterSpacing: '0.1em' }}>
        {rt[match.result]}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>vs {match.opponent}</div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, color: '#6B6B6B', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>{match.competition} · {match.venue}</div>
      </div>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.04em', color: '#0A0A0A' }}>{match.our_score}–{match.opponent_score}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[{ label: 'G', v: match.goals }, { label: 'A', v: match.assists }, { label: 'KP', v: match.key_passes }].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: s.v > 0 ? '#C9A84C' : '#0A0A0A', letterSpacing: '0.04em' }}>{s.v}</div>
          </div>
        ))}
      </div>
      {match.player_of_match && <span title="Player of Match" style={{ fontSize: 16 }}>⭐</span>}
    </div>
  )
}
