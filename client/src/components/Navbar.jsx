import React, { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setisLoggedin } = useContext(AppContent)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', { userId: userData._id })
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setOpen(false)
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setisLoggedin(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setOpen(false)
  }

  return (
    <nav className="nav-glass">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={assets.logo} alt="AuthKit" className="h-7 w-auto" />
      </div>

      {/* Right side */}
      {userData ? (
        <div className="relative" ref={dropdownRef}>
          <div className="avatar-ring" onClick={() => setOpen(prev => !prev)}>
            <div className="avatar-inner">
              {userData.name[0].toUpperCase()}
            </div>
          </div>

          {open && (
            <div
              className="dropdown-glass absolute right-0 mt-3"
              style={{ zIndex: 100 }}
            >
              {/* User info */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Signed in as</p>
                <p style={{ fontSize: '0.88rem', color: 'white', fontWeight: 600 }}>{userData.name}</p>
                {userData.isAccountVerified && (
                  <span className="verified-badge" style={{ marginTop: 6 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              {!userData.isAccountVerified && (
                <div className="dropdown-item" onClick={sendVerificationOtp}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                  Verify email
                </div>
              )}

              <div className="dropdown-item danger" onClick={logout}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign out
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="ghost-btn" onClick={() => navigate('/login')}>
          Sign in
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </nav>
  )
}

export default Navbar
