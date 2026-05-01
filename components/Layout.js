import Head from 'next/head'
import Navbar from './Navbar'
import Link from 'next/link'

export default function Layout({ children, title = 'Videsh FC', description }) {
  return (
    <>
      <Head>
        <title>{title === 'Home' ? 'Videsh FC — Midfielder · Chennai' : `${title} — Videsh FC`}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Navbar />
      <main style={{ paddingTop: 64 }}>{children}</main>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', padding: '3rem 1.5rem', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', letterSpacing: '0.06em', color: 'white', marginBottom: 6 }}>
              VIDESH <span style={{ color: '#C9A84C' }}>FC</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, maxWidth: 240 }}>
              Personal Football Portfolio<br/>Midfielder · Chennai, India
            </p>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>Portfolio</div>
              {['Matches', 'Stats', 'Achievements', 'Training', 'Highlights'].map(l => (
                <Link key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)', marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} VIDESH FC · CHENNAI, INDIA
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.06em' }}>
            BUILT FOR THE BEAUTIFUL GAME ⚽
          </p>
        </div>
      </div>
    </footer>
  )
}
