import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {
  axios.defaults.withCredentials = true

  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent)
  const navigate = useNavigate()
  const inputRefs = React.useRef([])
  const [loading, setLoading] = useState(false)
  const [filled, setFilled] = useState(0)

  const handleInput = (e, index) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1)
    e.target.value = val
    setFilled(inputRefs.current.filter(r => r?.value).length)
    if (val && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    paste.split('').forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char
    })
    const next = Math.min(paste.length, 5)
    inputRefs.current[next]?.focus()
    setFilled(paste.length)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const otp = inputRefs.current.map(r => r.value).join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', {
        userId: userData._id,
        otp,
      })
      if (data.success) {
        toast.success(data.message)
        getUserData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) navigate('/')
  }, [isLoggedin, userData, navigate])

  return (
    <div
      className="bg-mesh"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      {/* Orbs */}
      <div className="orb1" style={{
        position: 'fixed', top: '20%', right: '15%',
        width: 300, height: 300, borderRadius: '9999px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div
        style={{ position: 'fixed', top: 20, left: 32, cursor: 'pointer', zIndex: 10 }}
        onClick={() => navigate('/')}
      >
        <img src={assets.logo} alt="AuthKit" style={{ height: 28 }} />
      </div>

      {/* Card */}
      <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#818cf8" strokeWidth="1.5"/>
            <path d="M2 7l10 7 10-7" stroke="#818cf8" strokeWidth="1.5"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Verify your email
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: 28 }}>
          We sent a 6-digit code to{' '}
          <span style={{ color: '#a5b4fc', fontWeight: 500 }}>{userData?.email || 'your email'}</span>.
          Enter it below to verify your account.
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* OTP inputs */}
          <div
            style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}
            onPaste={handlePaste}
          >
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                className="otp-input"
                ref={el => (inputRefs.current[index] = el)}
                onInput={e => handleInput(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                placeholder="·"
              />
            ))}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className={`step-dot ${i < filled ? 'active' : ''}`} />
            ))}
          </div>

          <button
            type="submit"
            className="neon-btn"
            disabled={loading || filled < 6}
            style={{ opacity: (loading || filled < 6) ? 0.5 : 1 }}
          >
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textAlign: 'center', marginTop: 20 }}>
          Didn't receive it?{' '}
          <span className="link" onClick={() => navigate('/')}>
            Go back
          </span>
        </p>
      </div>
    </div>
  )
}

export default EmailVerify
