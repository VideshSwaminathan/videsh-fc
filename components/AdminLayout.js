import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { type: 'divider', label: 'ADD NEW' },
  { href: '/admin/add-match', label: 'Add Match', icon: '⚽' },
  { href: '/admin/add-training', label: 'Add Training', icon: '🏃' },
  { href: '/admin/add-achievement', label: 'Add Achievement', icon: '🏆' },
  { href: '/admin/add-highlight', label: 'Add Highlight', icon: '🎬' },
  { type: 'divider', label: 'MANAGE' },
  { href: '/admin/manage-matches', label: 'Manage Matches', icon: '✏️' },
  { href: '/admin/manage-training', label: 'Manage Training', icon: '✏️' },
  { href: '/admin/manage-achievements', label: 'Manage Achievements', icon: '✏️' },
  { href: '/admin/manage-highlights', label: 'Manage Highlights', icon: '✏️' },
]

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('videsh_admin')
    if (!session) router.replace('/admin')
    else setAuthed(true)
  }, [router])

  function handleLogout() {
    sessionStorage.removeItem('videsh_admin')
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => router.push('/admin'))
  }

  if (!authed) return null

  return (
    <>
      <Head><title>{title} — Videsh FC Admin</title></Head>
      <aside style={{
        width: 220, background: '#0A0A0A', minHeight: '100vh',
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
        borderRight: '1px solid rgba(201,168,76,0.15)', overflowY: 'auto',
      }}>
        <div style={{ padding: '20px 12px 24px' }}>
          <div style={{ marginBottom: 24, paddingLeft: 8 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF' }}>
                Videsh <span style={{ color: '#C9A84C' }}>FC</span>
              </span>
            </Link>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>
          <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', marginBottom: 12 }} />
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {adminLinks.map((link, i) => {
              if (link.type === 'divider') return (
                <div key={i} style={{ paddingLeft: 8, marginTop: 16, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontWeight: 700 }}>{link.label}</span>
                </div>
              )
              const active = router.pathname === link.href
              return (
                <Link key={link.href} href={link.href} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 7, fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? '#E8C96B' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  margin: '1px 0', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 14 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
          <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', margin: '16px 0' }} />
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 7, fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            <span>↗</span><span>View Site</span>
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 7, fontSize: 13, color: 'rgba(255,100,100,0.5)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>
            <span>⎋</span><span>Logout</span>
          </button>
        </div>
      </aside>
      <div style={{ marginLeft: 220, minHeight: '100vh', background: '#FAFAF8' }}>
        <div style={{ padding: '2rem 2.5rem', maxWidth: 880 }}>
          {children}
        </div>
      </div>
    </>
  )
}
