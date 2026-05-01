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
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #E8C96B, #C9A84C)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>⚽</span>
          </div>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: '0.06em', color: 'white' }}>
            VIDESH <span style={{ color: '#C9A84C' }}>FC</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
          {navLinks.map(link => {
            const active = router.pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '6px 14px', borderRadius: 3,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 13, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: active ? '#E8C96B' : 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Admin button */}
        <Link href="/admin" className="hidden md:flex" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#C9A84C', textDecoration: 'none',
          border: '1px solid rgba(201,168,76,0.35)',
          padding: '6px 14px', borderRadius: 3, transition: 'all 0.2s',
        }}>
          Admin ↗
        </Link>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#C9A84C', borderRadius: 1, transition: 'all 0.2s',
              transform: open ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)') : 'none',
              opacity: open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#111', borderTop: '1px solid rgba(201,168,76,0.2)', padding: '1rem 1.5rem' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '10px 0',
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: router.pathname === link.href ? '#E8C96B' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 0', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>
            Admin ↗
          </Link>
        </div>
      )}
    </nav>
  )
}
