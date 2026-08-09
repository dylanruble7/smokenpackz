import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Check, Shield, Zap, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { products, discordUrls } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

const categoryLogos = {
  accounts: '/packzaccs.png',
  gold: '/packzgold.png',
  bonds: '/packzbond.png',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stoner-haze/60 text-xl mb-4">Product not found 😔</p>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    addToCart(product)
    navigate('/checkout')
  }

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/shop" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="card p-0">
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-osrs-brown/50 to-osrs-dark/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-smoke animate-smoke" />
              <div className="relative z-10 flex items-center justify-center">
                {categoryLogos[product.category] ? (
                  <img src={categoryLogos[product.category]} alt={product.name} className="w-72 h-72 object-contain" />
                ) : (
                  <span className="text-9xl">{product.image}</span>
                )}
              </div>
              {product.tag && (
                <span className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-bold text-osrs-dark bg-${product.tagColor}`}>
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-medieval text-3xl font-bold text-osrs-goldBright mb-2">{product.name}</h1>
            <p className="text-stoner-haze/70 text-lg mb-6">{product.description}</p>

            {/* Stats */}
            <div className="bg-osrs-dark/60 rounded-lg p-4 mb-6 border border-osrs-brownLight">
              <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Stats & Details</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-stoner-haze/50">{key}:</span>
                    <span className="text-stoner-haze font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.badges.map(badge => (
                <span key={badge} className="text-xs px-3 py-1 rounded-full bg-stoner-greenDeep/50 text-stoner-haze/80 border border-stoner-green/30">
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* Price + actions */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-medieval text-4xl font-bold text-osrs-gold">${product.price}</span>
                <span className="text-stoner-haze/40 text-sm">Crypto, CashApp & OSRS GP accepted</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`btn-secondary flex items-center gap-2 ${added ? 'bg-stoner-greenBright text-osrs-dark' : ''}`}
                >
                  {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
                </button>
                <button onClick={handleBuyNow} className="btn-primary flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Buy Now
                </button>
              </div>
            </div>

            {/* Trust */}
            <div className="mt-6 flex gap-4 text-sm text-stoner-haze/50">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure</span>
              <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Fast Delivery</span>
              {discordUrls.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#5865F2]">
                  <MessageCircle className="w-4 h-4" /> Server {i + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
