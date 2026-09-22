import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { userData, isLoggedin } = useContext(AppContent)
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 24px',
        textAlign: 'center',
        paddingTop: '80px', // clear navbar
      }}
    >
      {/* Avatar */}
      <div style={{ marginBottom: 28, position: 'relative' }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            padding: 3,
            display: 'inline-block',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '9999px',
              background: '#0f0f1a',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={assets.header_img}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Wave */}
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            fontSize: '1.5rem',
          }}
        >
          <img src={assets.hand_wave} alt="" style={{ width: 28 }} />
        </span>
      </div>

      {/* Greeting */}
      <p style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: 12, letterSpacing: '0.06em' }}>
        {isLoggedin ? `Welcome back` : `Get started for free`}
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          maxWidth: 600,
          background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {userData
          ? `Hey, ${userData.name.split(' ')[0]}.`
          : `Auth that just works.`}
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '1rem',
          lineHeight: 1.65,
          maxWidth: 420,
          marginBottom: 40,
        }}
      >
        {userData
          ? 'Your account is set up and ready. Explore what you can build next.'
          : 'A complete MERN authentication system — registration, OTP verification, and password reset, all wired up.'}
      </p>

      {/* CTA */}
      {!isLoggedin ? (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="neon-btn"
            style={{ width: 'auto', padding: '13px 32px' }}
            onClick={() => navigate('/login')}
          >
            Create account
          </button>
          <button
            className="ghost-btn"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!userData?.isAccountVerified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.25)',
                color: '#fde68a',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 999,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M6 3.5v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Email not verified — check your navbar
            </span>
          )}
          {userData?.isAccountVerified && (
            <span className="verified-badge" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Account verified
            </span>
          )}
        </div>
      )}

      {/* Feature strip */}
      {!isLoggedin && (
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 60,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { icon: '🔐', label: 'JWT + Cookies', desc: 'Secure httpOnly cookie auth' },
            { icon: '📧', label: 'OTP Verify', desc: 'Email verification flow' },
            { icon: '🔑', label: 'Password Reset', desc: 'OTP-based reset in 3 steps' },
          ].map(f => (
            <div key={f.label} className="feature-card" style={{ width: 180, textAlign: 'left' }}>
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: 10 }}>{f.icon}</span>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>{f.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header
