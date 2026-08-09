import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { LogOut, Mail, User as UserIcon, ShoppingCart, Package, Shield, Zap, MessageCircle, ChevronRight } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function Account() {
  const { user, signOut, loading } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="smoke-bg min-h-screen flex items-center justify-center">
        <div className="text-stoner-haze/40 text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    navigate('/auth')
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const provider = user.app_metadata?.provider || 'email'
  const email = user.email || ''
  const initials = email.charAt(0).toUpperCase()

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="section-title mb-8">My Account</h1>

        {/* Profile card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-osrs-dark font-medieval text-2xl font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="font-medieval text-xl font-bold text-osrs-goldBright">{email}</h2>
              <p className="text-stoner-haze/50 text-sm flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3" /> Signed in via {provider}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link to="/cart" className="card p-5 group hover:border-osrs-gold transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <ShoppingCart className="w-6 h-6 text-osrs-gold mb-2" />
                <p className="text-stoner-haze/50 text-xs">Cart Items</p>
                <p className="font-medieval text-2xl font-bold text-osrs-goldBright">{cart.length}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-stoner-haze/30 group-hover:text-osrs-gold transition-colors" />
            </div>
          </Link>

          <div className="card p-5">
            <Package className="w-6 h-6 text-osrs-gold mb-2" />
            <p className="text-stoner-haze/50 text-xs">Member Since</p>
            <p className="font-medieval text-lg font-bold text-osrs-goldBright">
              {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="card p-5">
            <Mail className="w-6 h-6 text-osrs-gold mb-2" />
            <p className="text-stoner-haze/50 text-xs">Email Status</p>
            <p className="font-medieval text-lg font-bold text-stoner-greenBright">
              {user.email_confirmed_at ? 'Verified' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Account details */}
        <div className="card p-6 mb-6">
          <h3 className="font-medieval text-osrs-gold mb-4 text-sm">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stoner-haze/50 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
              <span className="text-stoner-haze font-bold">{email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stoner-haze/50 flex items-center gap-2"><UserIcon className="w-4 h-4" /> User ID</span>
              <span className="text-stoner-haze/60 font-mono text-xs">{user.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stoner-haze/50 flex items-center gap-2"><Shield className="w-4 h-4" /> Auth Provider</span>
              <span className="text-stoner-haze font-bold capitalize">{provider}</span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link to="/shop" className="card p-5 group hover:border-osrs-gold transition-colors flex items-center justify-between">
            <div>
              <p className="font-medieval text-osrs-goldBright font-bold">Browse Shop</p>
              <p className="text-stoner-haze/40 text-xs">Accounts, gold, bonds</p>
            </div>
            <ChevronRight className="w-5 h-5 text-stoner-haze/30 group-hover:text-osrs-gold transition-colors" />
          </Link>

          <Link to="/track" className="card p-5 group hover:border-osrs-gold transition-colors flex items-center justify-between">
            <div>
              <p className="font-medieval text-osrs-goldBright font-bold">Track Order</p>
              <p className="text-stoner-haze/40 text-xs">Check your order status</p>
            </div>
            <ChevronRight className="w-5 h-5 text-stoner-haze/30 group-hover:text-osrs-gold transition-colors" />
          </Link>
        </div>

        {/* Support */}
        <div className="card p-6 bg-gradient-to-r from-[#2c2f33] to-[#36393f] border-[#5865F2]">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6 text-[#5865F2]" />
            <h3 className="font-medieval text-lg font-bold text-white">Need Help?</h3>
          </div>
          <p className="text-stoner-haze/60 text-sm mb-4">Join our Discord for support, order questions, or just to chill with the pack.</p>
          <div className="flex gap-3">
            {discordUrls.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                 className="inline-block px-5 py-2 rounded-lg bg-[#5865F2] hover:bg-[#7983f5] text-white font-medieval font-bold text-sm transition-colors">
                Join Server {i + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
