import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Incorrect password')
        setLoading(false)
        return
      }

      sessionStorage.setItem('videsh_admin', 'true')
      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login — Videsh FC</title></Head>

      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          background: '#141414',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 20,
          padding: '3rem',
          width: '100%',
          maxWidth: 400,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem',
              fontWeight: 600,
              color: 'white',
              marginBottom: 4,
            }}>
              Videsh <span style={{ color: '#C9A84C' }}>FC</span>
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Admin Access
            </p>
          </div>

          {/* Gold divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)', marginBottom: '2rem' }} />

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? 'rgba(255,100,100,0.4)' : 'rgba(201,168,76,0.2)'}`,
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'white',
                  outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
              {error && (
                <p style={{ fontSize: 12, color: '#F87171', marginTop: 8 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Verifying...' : 'Enter Admin Panel →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
