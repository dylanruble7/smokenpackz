import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Check, Shield, Zap, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { products, discordUrls } from '../data/products.js'
import { OSRS_SKILLS } from '../data/skills.js'
import SkillsPanel from '../components/SkillsPanel.jsx'
import { supabase } from '../lib/supabase.js'
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
  const [inputValue, setInputValue] = useState('1')
  const [customAccount, setCustomAccount] = useState(null)

  const product = products.find(p => p.id === id)

  // Load custom account from Supabase if not in static products
  useEffect(() => {
    if (!product) {
      supabase.from('custom_accounts').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setCustomAccount({
              id: data.id,
              category: 'accounts',
              name: data.name,
              price: parseFloat(data.price),
              image: '',
              tag: data.tag || '',
              tagColor: data.tag_color || '',
              description: data.description || '',
              stats: {},
              skills: data.skills || {},
              badges: data.badges || [],
              stock: data.stock || 1,
              qp: data.qp || 0,
              banned: data.banned || false,
              goldAmount: data.gold_amount || '',
              importantItems: data.important_items || [],
            })
          }
        })
    }
  }, [id, product])

  // Adjust defaults based on product type
  useEffect(() => {
    if (product?.id === 'gold-custom') {
      setBondQty(5)
      setInputValue('5')
    } else if (product?.id === 'bond-custom') {
      setBondQty(1)
      setInputValue('1')
    }
  }, [product])

  if (!product && !customAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stoner-haze/60 text-xl mb-4">Product not found</p>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const p = product || customAccount

  const isGold = p?.id === 'gold-custom'
  const isBond = p?.id === 'bond-custom'
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
  const getValidQty = () => Math.max(minQty, Math.min(99999, bondQty))
  const validQty = getValidQty()
  const customTotal = p?.customQuantity ? unitPrice(validQty) * validQty : p?.price

  const handleAdd = () => {
    if (p.customQuantity) {
      const qty = getValidQty()
      const customName = isGold
        ? `${qty}M OSRS Gold - Custom Order`
        : `${qty} OSRS Bond${qty > 1 ? 's' : ''} - Custom Order`
      const customStats = isGold
        ? { ...product.stats, 'Amount': `${qty}M GP`, 'Price per 1M': `$${unitPrice(qty).toFixed(2)}` }
        : { ...product.stats, 'Amount': `${qty} Bonds`, 'Membership': `${qty * 14} days`, 'Price per Bond': `$${unitPrice(qty).toFixed(2)}` }
      addToCart({ ...p, price: unitPrice(qty), name: customName, stats: customStats }, qty)
    } else {
      addToCart(p)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    if (p.customQuantity) {
      const qty = getValidQty()
      const customName = isGold
        ? `${qty}M OSRS Gold - Custom Order`
        : `${qty} OSRS Bond${qty > 1 ? 's' : ''} - Custom Order`
      const customStats = isGold
        ? { ...product.stats, 'Amount': `${qty}M GP`, 'Price per 1M': `$${unitPrice(qty).toFixed(2)}` }
        : { ...product.stats, 'Amount': `${qty} Bonds`, 'Membership': `${qty * 14} days`, 'Price per Bond': `$${unitPrice(qty).toFixed(2)}` }
      addToCart({ ...p, price: unitPrice(qty), name: customName, stats: customStats }, qty)
    } else {
      addToCart(p)
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
            <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-osrs-brown/50 to-osrs-dark/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-smoke animate-smoke" />
              <div className="relative z-10 w-full px-4">
                {p.skills && Object.keys(p.skills).length > 0 ? (
                  <SkillsPanel skills={p.skills} size="lg" />
                ) : categoryLogos[p.category] ? (
                  <img src={categoryLogos[p.category]} alt={p.name} className="w-72 h-72 object-contain" />
                ) : (
                  <span className="text-9xl">{p.image}</span>
                )}
              </div>
              {p.tag && (
                <span className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-bold text-osrs-dark bg-${p.tagColor}`}>
                  {p.tag}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-medieval text-3xl font-bold text-osrs-goldBright mb-2">{p.name}</h1>
            <p className="text-stoner-haze/70 text-lg mb-6">{p.description}</p>

            {/* Skills grid for accounts */}
            {p.skills && Object.keys(p.skills).length > 0 && (
              <div className="bg-osrs-dark/60 rounded-lg p-4 mb-6 border border-osrs-brownLight">
                <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Skill Levels</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {OSRS_SKILLS.map(skill => {
                    const level = p.skills[skill.name]
                    if (!level) return null
                    return (
                      <div key={skill.name} className="flex items-center justify-between text-sm bg-osrs-darker/60 rounded px-2 py-1">
                        <span className="text-stoner-haze/60 flex items-center gap-1">{skill.icon} {skill.short}</span>
                        <span className="text-osrs-goldBright font-bold">{level}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Account info: QP, Gold, Banned */}
            {p.skills && Object.keys(p.skills).length > 0 && (
              <div className="bg-osrs-dark/60 rounded-lg p-4 mb-6 border border-osrs-brownLight">
                <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Account Info</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-osrs-darker/60 rounded-lg p-3">
                    <p className="text-stoner-haze/50 text-xs mb-1">Quest Points</p>
                    <p className="font-medieval text-xl font-bold text-osrs-goldBright">{p.qp || 0}</p>
                  </div>
                  <div className="text-center bg-osrs-darker/60 rounded-lg p-3">
                    <p className="text-stoner-haze/50 text-xs mb-1">Gold on Acc</p>
                    <p className="font-medieval text-xl font-bold text-osrs-goldBright">{p.goldAmount || '0'}</p>
                  </div>
                  <div className="text-center bg-osrs-darker/60 rounded-lg p-3">
                    <p className="text-stoner-haze/50 text-xs mb-1">Status</p>
                    <p className={`font-medieval text-sm font-bold ${p.banned ? 'text-red-400' : 'text-stoner-greenBright'}`}>
                      {p.banned ? 'BANNED' : 'Clean'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Important Items */}
            {p.importantItems && p.importantItems.length > 0 && (
              <div className="bg-osrs-dark/60 rounded-lg p-4 mb-6 border border-osrs-brownLight">
                <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Important Items & Unlocks</h3>
                <div className="flex flex-wrap gap-2">
                  {p.importantItems.map(item => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-lg bg-osrs-gold/15 text-osrs-goldBright border border-osrs-gold/30">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {Object.keys(p.stats).length > 0 && (
              <div className="bg-osrs-dark/60 rounded-lg p-4 mb-6 border border-osrs-brownLight">
                <h3 className="font-medieval text-osrs-gold mb-3 text-sm">Stats & Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(p.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-stoner-haze/50">{key}:</span>
                      <span className="text-stoner-haze font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {p.badges.map(badge => (
                <span key={badge} className="text-xs px-3 py-1 rounded-full bg-stoner-greenDeep/50 text-stoner-haze/80 border border-stoner-green/30">
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* Price + actions */}
            <div className="mt-auto">
              {p.customQuantity && (
                <div className="mb-6 rounded-xl overflow-hidden border border-osrs-brownLight">
                  {/* Header bar */}
                  <div className="bg-gradient-to-r from-osrs-brown/60 to-osrs-dark/80 px-5 py-3 border-b border-osrs-brownLight">
                    <h3 className="font-medieval text-osrs-goldBright text-lg flex items-center gap-2">
                      {isGold ? '🪙 Choose Your Gold Amount' : '🎯 Choose Your Bond Amount'}
                    </h3>
                  </div>

                  <div className="bg-osrs-dark/70 p-5 space-y-4">
                    {/* Big input with label */}
                    <div>
                      <label className="text-stoner-haze/50 text-xs uppercase tracking-wider mb-2 block">
                        {isGold ? 'Amount (in millions)' : 'Number of Bonds'}
                      </label>
                      <div className="flex items-stretch gap-0">
                        <button
                          onClick={() => { const q = Math.max(minQty, bondQty - (isGold ? 5 : 1)); setBondQty(q); setInputValue(String(q)) }}
                          className="px-5 rounded-l-lg bg-osrs-dark border border-osrs-brownLight border-r-0 text-osrs-goldBright font-bold text-2xl hover:bg-osrs-brown/40 hover:border-osrs-gold transition-all"
                        >−</button>
                        <input
                          type="number"
                          min={minQty}
                          max="99999"
                          value={inputValue}
                          onChange={e => {
                            setInputValue(e.target.value)
                            const parsed = parseInt(e.target.value)
                            if (!isNaN(parsed)) setBondQty(parsed)
                          }}
                          onBlur={() => {
                            const qty = Math.max(minQty, Math.min(99999, parseInt(inputValue) || minQty))
                            setBondQty(qty)
                            setInputValue(String(qty))
                          }}
                          className="flex-1 text-center bg-osrs-dark border-y border-osrs-brownLight text-stoner-haze text-3xl font-bold py-3 focus:outline-none focus:border-osrs-gold transition-colors"
                        />
                        <button
                          onClick={() => { const q = Math.min(99999, bondQty + (isGold ? 5 : 1)); setBondQty(q); setInputValue(String(q)) }}
                          className="px-5 rounded-r-lg bg-osrs-dark border border-osrs-brownLight border-l-0 text-osrs-goldBright font-bold text-2xl hover:bg-osrs-brown/40 hover:border-osrs-gold transition-all"
                        >+</button>
                      </div>
                      <div className="flex items-center justify-between mt-1 px-1">
                        <span className="text-stoner-haze/30 text-xs">Min: {minQty}{isGold ? 'M' : ''}</span>
                        <span className="text-stoner-haze/30 text-xs">Max: 99,999{isGold ? 'M' : ''}</span>
                      </div>
                    </div>

                    {/* Quick select buttons */}
                    <div>
                      <label className="text-stoner-haze/50 text-xs uppercase tracking-wider mb-2 block">Quick Select</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {(isGold ? [5, 10, 50, 100, 500, 1000] : [1, 5, 10, 25, 50, 100]).map(qty => (
                          <button
                            key={qty}
                            onClick={() => { setBondQty(qty); setInputValue(String(qty)) }}
                            className={`py-2.5 rounded-lg font-bold text-sm transition-all ${
                              validQty === qty
                                ? 'bg-gold-gradient text-osrs-dark scale-105'
                                : 'bg-osrs-dark border border-osrs-brownLight text-stoner-haze hover:border-osrs-gold hover:text-osrs-goldBright'
                            }`}
                          >
                            {isGold ? `${qty}M` : qty}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price breakdown card */}
                    <div className="bg-osrs-darker/80 rounded-lg p-4 border border-osrs-brownLight/50 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stoner-haze/50">Price per {unitLabel}</span>
                        <span className="text-osrs-goldBright font-bold text-base">${unitPrice(validQty).toFixed(2)}</span>
                      </div>
                      {isGold && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stoner-haze/50">Total Gold</span>
                          <span className="text-stoner-haze font-bold">{validQty.toLocaleString()}M GP</span>
                        </div>
                      )}
                      {isBond && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stoner-haze/50">Total Membership</span>
                          <span className="text-stoner-haze font-bold">{validQty * 14} days ({Math.floor(validQty * 14 / 30)} months)</span>
                        </div>
                      )}
                      {validQty >= (isGold ? 50 : 5) && (
                        <div className="flex justify-between items-center text-sm pt-1 border-t border-osrs-brownLight/30">
                          <span className="text-stoner-greenBright flex items-center gap-1">
                            ✓ Bulk Discount
                          </span>
                          <span className="text-stoner-greenBright font-bold">
                            Save ${(basePrice - unitPrice(validQty)).toFixed(2)}/{unitLabel}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-osrs-brownLight/30">
                        <span className="text-stoner-haze font-medieval text-lg">Total</span>
                        <span className="font-medieval text-3xl font-bold text-osrs-gold drop-shadow-[0_0_10px_rgba(201,162,39,0.4)]">
                          ${customTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!p.customQuantity && (
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-medieval text-4xl font-bold text-osrs-gold">${p.price}</span>
                  <span className="text-stoner-haze/40 text-sm">Crypto, CashApp & OSRS GP accepted</span>
                </div>
              )}
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
