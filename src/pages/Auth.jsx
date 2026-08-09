import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MessageCircle, Mail, Lock, User, ArrowRight, Check, AlertCircle, Loader } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function Auth() {
  const { signIn, signUp, signInWithProvider, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (showReset) {
      const { error } = await resetPassword(email)
      setLoading(false)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password reset link sent to your email!')
        setShowReset(false)
      }
      return
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      setLoading(false)
      if (error) {
        setError(error.message)
      } else {
        navigate('/account')
      }
    } else {
      const { data, error } = await signUp(email, password)
      setLoading(false)
      if (error) {
        setError(error.message)
      } else if (data?.user && !data?.session) {
        setSuccess('Check your email to confirm your account!')
      } else if (data?.session) {
        navigate('/account')
      }
    }
  }

  const handleSocial = async (provider) => {
    setError('')
    await signInWithProvider(provider)
  }

  return (
    <div className="smoke-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <img src="/packzlogo.png" alt="SmokenPackz" className="w-16 h-16 object-contain" />
          </Link>
          <h1 className="font-medieval text-3xl font-bold text-osrs-goldBright">
            {showReset ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Join the Pack'}
          </h1>
          <p className="text-stoner-haze/50 text-sm mt-1">
            {showReset ? 'Enter your email to reset your password' : mode === 'login' ? 'Sign in to your SmokenPackz account' : 'Create your SmokenPackz account'}
          </p>
        </div>

        {/* Social Auth */}
        {!showReset && (
          <>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocial('google')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors border border-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocial('discord')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#5865F2] hover:bg-[#7983f5] text-white font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Continue with Discord
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-osrs-brownLight" />
              <span className="text-stoner-haze/40 text-xs">OR</span>
              <div className="flex-1 h-px bg-osrs-brownLight" />
            </div>
          </>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-stoner-haze/60 text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stoner-haze/40" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-osrs-dark border border-osrs-brownLight text-stoner-haze placeholder-stoner-haze/30 focus:border-osrs-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {!showReset && (
            <div>
              <label className="text-stoner-haze/60 text-sm mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stoner-haze/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-osrs-dark border border-osrs-brownLight text-stoner-haze placeholder-stoner-haze/30 focus:border-osrs-gold focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-stoner-greenBright text-sm bg-stoner-greenBright/10 border border-stoner-greenBright/30 rounded-lg p-3">
              <Check className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {loading ? (
              <><Loader className="w-5 h-5 animate-spin" /> Please wait...</>
            ) : showReset ? (
              'Send Reset Link'
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        {/* Toggle */}
        {!showReset && (
          <div className="text-center mt-6 space-y-2">
            <p className="text-stoner-haze/50 text-sm">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
                className="text-osrs-goldBright hover:text-osrs-gold font-bold transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <button
              onClick={() => { setShowReset(!showReset); setError(''); setSuccess('') }}
              className="text-stoner-haze/40 hover:text-osrs-gold text-xs transition-colors"
            >
              {showReset ? '← Back to sign in' : 'Forgot password?'}
            </button>
          </div>
        )}

        {showReset && (
          <div className="text-center mt-6">
            <button
              onClick={() => { setShowReset(false); setError(''); setSuccess('') }}
              className="text-stoner-haze/50 hover:text-osrs-gold text-sm transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {/* Discord help */}
        <div className="text-center mt-8">
          <p className="text-stoner-haze/40 text-xs mb-2">Need help?</p>
          {discordUrls.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[#5865F2] text-xs mx-1">
              <MessageCircle className="w-3 h-3" /> Discord {i + 1}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
