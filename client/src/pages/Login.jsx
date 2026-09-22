import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, setisLoggedin, getUserData } = useContext(AppContent)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setisLoggedin(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setisLoggedin(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const isSignUp = state === 'Sign Up'

  return (
    <div
      className="bg-mesh"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      {/* Orbs */}
      <div
        className="orb1"
        style={{
          position: 'fixed', top: '15%', left: '10%',
          width: 340, height: 340, borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        className="orb2"
        style={{
          position: 'fixed', bottom: '10%', right: '8%',
          width: 280, height: 280, borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Logo */}
      <div
        style={{ position: 'fixed', top: 20, left: 32, cursor: 'pointer', zIndex: 10 }}
        onClick={() => navigate('/')}
      >
        <img src={assets.logo} alt="AuthKit" style={{ height: 28 }} />
      </div>

      {/* Card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '36px 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {['Sign Up', 'Login'].map(tab => (
            <button
              key={tab}
              onClick={() => setState(tab)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                background: state === tab
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'transparent',
                color: state === tab ? 'white' : 'rgba(255,255,255,0.4)',
                boxShadow: state === tab ? '0 0 20px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            {isSignUp
              ? 'Fill in the details below to get started.'
              : 'Enter your credentials to continue.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isSignUp && (
            <div className="input-group">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <img src={assets.lock_icon} alt="" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.35)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              )}
            </button>
          </div>

          {!isSignUp && (
            <p
              className="link"
              style={{ fontSize: '0.82rem', textAlign: 'right', marginTop: -4 }}
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </p>
          )}

          <button
            type="submit"
            className="neon-btn"
            disabled={loading}
            style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? (isSignUp ? 'Creating account…' : 'Signing in…')
              : (isSignUp ? 'Create account' : 'Sign in')}
          </button>
        </form>

        {/* Footer switch */}
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textAlign: 'center', marginTop: 20 }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span
            className="link"
            onClick={() => setState(isSignUp ? 'Login' : 'Sign Up')}
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
