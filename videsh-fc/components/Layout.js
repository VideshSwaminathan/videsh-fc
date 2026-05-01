import Head from 'next/head'
import Navbar from './Navbar'
import Link from 'next/link'

export default function Layout({ children, title = 'Videsh FC', description }) {
  return (
    <>
      <Head>
        <title>{title} — Videsh FC</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #E8E0D0',
      background: '#FAFAF8',
      padding: '2.5rem 1.5rem',
      marginTop: '4rem',
    }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600 }}>
            Videsh <span style={{ color: '#C9A84C' }}>FC</span>
          </span>
          <p style={{ fontSize: '12px', color: '#6B6B6B', marginTop: 4 }}>
            Personal Football Portfolio · Chennai, India
          </p>
        </div>
        <div className="gold-line-solid" style={{ flex: 1, maxWidth: 120, display: 'none' }} />
        <div style={{ display: 'flex', gap: 24 }}>
          {['Home', 'Matches', 'Stats', 'Achievements', 'Training', 'Highlights'].map(label => (
            <Link
              key={label}
              href={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
              style={{ fontSize: '12px', color: '#6B6B6B', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto" style={{ marginTop: '1.5rem' }}>
        <div className="gold-line" />
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B6B6B', marginTop: 12 }}>
          © {new Date().getFullYear()} Videsh FC. Built with passion for the beautiful game. ⚽
        </p>
      </div>
    </footer>
  )
}
