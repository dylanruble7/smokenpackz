import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Check, Shield, Zap, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
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
  const [bondQty, setBondQty] = useState(1)

  const product = products.find(p => p.id === id)

  // Adjust min quantity for gold
  useEffect(() => {
    if (product?.id === 'gold-custom' && bondQty < 5) setBondQty(5)
  }, [product])

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

  const isGold = product?.id === 'gold-custom'
  const isBond = product?.id === 'bond-custom'
  const unitLabel = isGold ? 'M GP' : 'Bond'
  const minQty = isGold ? 5 : 1

  const unitPrice = (qty) => {
    if (isGold) {
      if (qty >= 500) return 0.24
      if (qty >= 100) return 0.25
      if (qty >= 50) return 0.26
      return 0.27
    }
    if (qty >= 25) return 4.00
    if (qty >= 10) return 4.10
    if (qty >= 5) return 4.20
    return 4.25
  }
  const basePrice = isGold ? 0.27 : 4.25
  const customTotal = product?.customQuantity ? unitPrice(bondQty) * bondQty : product?.price

  const handleAdd = () => {
    if (product.customQuantity) {
      const customName = isGold
        ? `${bondQty}M OSRS Gold - Custom Order`
        : `${bondQty} OSRS Bond${bondQty > 1 ? 's' : ''} - Custom Order`
      const customStats = isGold
        ? { ...product.stats, 'Amount': `${bondQty}M GP`, 'Price per 1M': `$${unitPrice(bondQty).toFixed(2)}` }
        : { ...product.stats, 'Amount': `${bondQty} Bonds`, 'Membership': `${bondQty * 14} days`, 'Price per Bond': `$${unitPrice(bondQty).toFixed(2)}` }
      addToCart({ ...product, price: unitPrice(bondQty), name: customName, stats: customStats }, bondQty)
    } else {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    if (product.customQuantity) {
      const customName = isGold
        ? `${bondQty}M OSRS Gold - Custom Order`
        : `${bondQty} OSRS Bond${bondQty > 1 ? 's' : ''} - Custom Order`
      const customStats = isGold
        ? { ...product.stats, 'Amount': `${bondQty}M GP`, 'Price per 1M': `$${unitPrice(bondQty).toFixed(2)}` }
        : { ...product.stats, 'Amount': `${bondQty} Bonds`, 'Membership': `${bondQty * 14} days`, 'Price per Bond': `$${unitPrice(bondQty).toFixed(2)}` }
      addToCart({ ...product, price: unitPrice(bondQty), name: customName, stats: customStats }, bondQty)
    } else {
      addToCart(product)
    }
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
              {product.customQuantity && (
                <div className="mb-6 bg-osrs-dark/60 rounded-lg p-5 border border-osrs-brownLight">
                  <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Choose Quantity {isGold && '(in millions)'}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setBondQty(Math.max(minQty, bondQty - 1))}
                      className="w-10 h-10 rounded-lg bg-osrs-dark border border-osrs-brownLight text-osrs-goldBright font-bold text-xl hover:border-osrs-gold transition-colors"
                    >−</button>
                    <input
                      type="number"
                      min={minQty}
                      max="99999"
                      value={bondQty}
                      onChange={e => setBondQty(Math.max(minQty, Math.min(99999, parseInt(e.target.value) || minQty)))}
                      className="w-24 text-center bg-osrs-dark border border-osrs-brownLight rounded-lg text-stoner-haze text-lg font-bold py-2"
                    />
                    <button
                      onClick={() => setBondQty(Math.min(99999, bondQty + 1))}
                      className="w-10 h-10 rounded-lg bg-osrs-dark border border-osrs-brownLight text-osrs-goldBright font-bold text-xl hover:border-osrs-gold transition-colors"
                    >+</button>
                    <span className="text-stoner-haze/40 text-sm">{unitLabel}{isGold ? ' minimum' : ''}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stoner-haze/50">Price per {unitLabel}:</span>
                      <span className="text-osrs-goldBright font-bold">${unitPrice(bondQty).toFixed(2)}</span>
                    </div>
                    {isBond && (
                      <div className="flex justify-between">
                        <span className="text-stoner-haze/50">Membership:</span>
                        <span className="text-stoner-haze font-bold">{bondQty * 14} days</span>
                      </div>
                    )}
                    {isGold && (
                      <div className="flex justify-between">
                        <span className="text-stoner-haze/50">Total gold:</span>
                        <span className="text-stoner-haze font-bold">{bondQty}M GP</span>
                      </div>
                    )}
                    {bondQty >= (isGold ? 50 : 5) && (
                      <div className="text-stoner-greenBright text-xs pt-1">
                        ✓ Bulk discount applied! Save ${(basePrice - unitPrice(bondQty)).toFixed(2)} per {unitLabel}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-medieval text-4xl font-bold text-osrs-gold">${customTotal.toFixed(2)}</span>
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
