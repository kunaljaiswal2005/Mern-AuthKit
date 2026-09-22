import React, { useState, useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const steps = ['Email', 'OTP', 'New password']

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent)
  axios.defaults.withCredentials = true

  const [step, setStep] = useState(0) // 0=email, 1=otp, 2=newpassword
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [filled, setFilled] = useState(0)

  const navigate = useNavigate()
  const inputRefs = useRef([])

  /* ── OTP handlers ── */
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
    inputRefs.current[Math.min(paste.length, 5)]?.focus()
    setFilled(paste.length)
  }

  /* ── Submit handlers ── */
  const onSubmitEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      if (data.success) {
        toast.success(data.message)
        setStep(1)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpVal = inputRefs.current.map(r => r.value).join('')
    setOtp(otpVal)
    setStep(2)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      })
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── Step content map ── */
  const stepContent = {
    0: {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" stroke="#818cf8" strokeWidth="1.5"/>
          <path d="M2 7l10 7 10-7" stroke="#818cf8" strokeWidth="1.5"/>
        </svg>
      ),
      title: 'Reset your password',
      subtitle: 'Enter the email address linked to your account. We\'ll send you a one-time code.',
    },
    1: {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="13" rx="2" stroke="#818cf8" strokeWidth="1.5"/>
          <path d="M8 8V6a4 4 0 118 0v2" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="15" r="1.5" fill="#818cf8"/>
        </svg>
      ),
      title: 'Enter the code',
      subtitle: `We sent a 6-digit code to ${email || 'your email'}. It expires soon.`,
    },
    2: {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="13" rx="2" stroke="#818cf8" strokeWidth="1.5"/>
          <path d="M8 8V6a4 4 0 118 0v2" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9 15l2 2 4-3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Set a new password',
      subtitle: 'Choose a strong password you haven\'t used before.',
    },
  }

  const { icon, title, subtitle } = stepContent[step]

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
      <div className="orb2" style={{
        position: 'fixed', bottom: '15%', left: '10%',
        width: 300, height: 300, borderRadius: '9999px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div
        style={{ position: 'fixed', top: 20, left: 32, cursor: 'pointer', zIndex: 10 }}
        onClick={() => navigate('/')}
      >
        <img src={assets.logo} alt="AuthKit" style={{ height: 28 }} />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, alignItems: 'center' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '9999px',
                  background: i < step
                    ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                    : i === step
                    ? 'rgba(99,102,241,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: i === step ? '1.5px solid #818cf8' : '1.5px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: i <= step ? '#c7d2fe' : 'rgba(255,255,255,0.25)',
                  transition: 'all 0.3s',
                }}>
                  {i < step
                    ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : i + 1}
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  color: i === step ? '#a5b4fc' : 'rgba(255,255,255,0.25)',
                  fontWeight: i === step ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 1,
                  background: i < step
                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.08)',
                  marginBottom: 20,
                  transition: 'all 0.3s',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          {icon}
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: 26 }}>
          {subtitle}
        </p>

        {/* Step 0 — Email */}
        {step === 0 && (
          <form onSubmit={onSubmitEmail} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            <button type="submit" className="neon-btn" disabled={loading} style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending code…' : 'Send code'}
            </button>
          </form>
        )}

        {/* Step 1 — OTP */}
        {step === 1 && (
          <form onSubmit={onSubmitOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 4 }}
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
            <button
              type="submit"
              className="neon-btn"
              disabled={filled < 6}
              style={{ marginTop: 6, opacity: filled < 6 ? 0.5 : 1 }}
            >
              Confirm code
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', cursor: 'pointer' }}
              onClick={() => setStep(0)}
            >
              ← Back
            </button>
          </form>
        )}

        {/* Step 2 — New password */}
        {step === 2 && (
          <form onSubmit={onSubmitNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group">
              <img src={assets.lock_icon} alt="" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', padding: 0,
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {showPassword
                    ? <><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>
                    : <><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3"/></>}
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className="neon-btn"
              disabled={loading}
              style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>
          Remembered it?{' '}
          <span className="link" onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
