import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { discordUrls } from '../data/products.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount } = useCart()
  const { user, signOut } = useAuth()
  const location = useLocation()

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Accounts', path: '/shop?cat=accounts' },
    { label: 'Gold', path: '/shop?cat=gold' },
    { label: 'Bonds', path: '/shop?cat=bonds' },
    { label: 'About', path: '/about' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-osrs-darker/95 backdrop-blur-md border-b border-osrs-brownLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/packzlogo.png" alt="SmokenPackz" className="w-28 h-28 object-contain group-hover:rotate-12 transition-transform" />
            <span className="font-medieval text-xl font-bold text-osrs-goldBright">SmokenPackz</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname + location.search === link.path ? 'text-osrs-goldBright' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {discordUrls.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                 className="nav-link flex items-center gap-1 text-[#5865F2] hover:text-[#7983f5]">
                Discord {i + 1}
              </a>
            ))}
          </div>

          {/* Cart + auth + mobile toggle */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/account" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-osrs-dark font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-stoner-haze/60 text-sm group-hover:text-osrs-goldBright transition-colors">Account</span>
              </Link>
            ) : (
              <Link to="/auth" className="flex items-center gap-1 text-stoner-haze hover:text-osrs-goldBright transition-colors text-sm font-bold">
                <User className="w-5 h-5" /> <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-stoner-haze hover:text-osrs-goldBright transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-osrs-gold text-osrs-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6 text-stoner-haze" /> : <Menu className="w-6 h-6 text-stoner-haze" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="nav-link py-2"
              >
                {link.label}
              </Link>
            ))}
            {discordUrls.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="nav-link py-2 text-[#5865F2]">
                Discord Server {i + 1}
              </a>
            ))}
            {user ? (
              <Link to="/account" onClick={() => setOpen(false)} className="nav-link py-2 flex items-center gap-1 text-osrs-goldBright">
                <User className="w-4 h-4" /> My Account
              </Link>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="nav-link py-2 flex items-center gap-1">
                <User className="w-4 h-4" /> Sign In / Sign Up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
