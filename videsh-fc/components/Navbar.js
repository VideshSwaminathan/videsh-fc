import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/matches', label: 'Matches' },
  { href: '/stats', label: 'Stats' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/training', label: 'Training' },
  { href: '/highlights', label: 'Highlights' },
]

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#0A0A0A',
            letterSpacing: '-0.01em',
          }}>
            Videsh <span style={{ color: '#C9A84C' }}>FC</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const active = router.pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: active ? 500 : 400,
                  color: active ? '#C9A84C' : '#6B6B6B',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Admin link */}
        <div className="hidden md:block">
          <Link href="/admin" style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#C9A84C',
            textDecoration: 'none',
            padding: '6px 14px',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}>
            Admin ↗
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? '#C9A84C' : '#0A0A0A', transition: 'all 0.2s', transform: menuOpen ? 'translateY(5.5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#0A0A0A', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? '#C9A84C' : '#0A0A0A', transition: 'all 0.2s', transform: menuOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none' }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          padding: '12px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '15px',
                color: router.pathname === link.href ? '#C9A84C' : '#0A0A0A',
                textDecoration: 'none',
                fontWeight: router.pathname === link.href ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ padding: '10px 14px', fontSize: '15px', color: '#C9A84C', textDecoration: 'none' }}>
            Admin ↗
          </Link>
        </div>
      )}
    </nav>
  )
}
