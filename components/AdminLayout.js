import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/admin/add-match', label: 'Add Match', icon: '⚽' },
  { href: '/admin/add-training', label: 'Add Training', icon: '🏃' },
  { href: '/admin/add-achievement', label: 'Add Achievement', icon: '🏆' },
  { href: '/admin/add-highlight', label: 'Add Highlight', icon: '🎬' },
]

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    // Check if logged in
    const session = sessionStorage.getItem('videsh_admin')
    if (!session) {
      router.replace('/admin')
    } else {
      setAuthed(true)
    }
  }, [router])

  function handleLogout() {
    sessionStorage.removeItem('videsh_admin')
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/admin')
    })
  }

  if (!authed) return null

  return (
    <>
      <Head><title>{title} — Videsh FC Admin</title></Head>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '24px 16px 20px' }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#FFFFFF',
              }}>
                Videsh <span style={{ color: '#C9A84C' }}>FC</span>
              </span>
            </Link>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', marginBottom: 16 }} />

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {adminLinks.map(link => {
              const active = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-item${active ? ' active' : ''}`}
                >
                  <span style={{ fontSize: 16 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', margin: '16px 8px' }} />

          {/* View Site */}
          <Link href="/" className="admin-nav-item" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>↗</span>
            <span>View Site</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{
              background: 'none', border: 'none', width: '100%',
              textAlign: 'left', cursor: 'pointer', color: 'rgba(255,100,100,0.6)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            }}
          >
            <span>⎋</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-content">
        <div style={{ padding: '2rem 2.5rem', maxWidth: 900 }}>
          {children}
        </div>
      </div>
    </>
  )
}
