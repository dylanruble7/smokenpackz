import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { OSRS_SKILLS } from '../data/skills.js'

const categoryLogos = {
  accounts: '/packzaccs.png',
  gold: '/packzgold.png',
  bonds: '/packzbond.png',
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const logo = categoryLogos[product.category]
  const hasSkills = product.skills && Object.keys(product.skills).length > 0

  return (
    <Link to={`/product/${product.id}`} className="card group flex flex-col cursor-pointer">
      {/* Image / Icon area */}
      <div className="relative h-52 flex items-center justify-center bg-gradient-to-br from-osrs-brown/50 to-osrs-dark/50 overflow-hidden">
        <div className="absolute inset-0 bg-smoke animate-smoke" />
        {hasSkills ? (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img src="/osrs-skills.webp" alt={product.name} className="h-48 object-contain group-hover:scale-110 transition-transform duration-300" />
            {/* Skill level overlays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-xs font-bold text-white" style={{ textShadow: '1px 1px 2px black' }}>
                {OSRS_SKILLS.map(skill => {
                  const level = product.skills[skill.name]
                  if (!level) return <div key={skill.name} className="w-8 text-center opacity-0">--</div>
                  return (
                    <div key={skill.name} className="w-8 text-center text-yellow-300">
                      {level}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : logo ? (
          <img src={logo} alt={product.name} className="w-52 h-52 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10" />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300 relative z-10">
            {product.image}
          </span>
        )}
        {product.tag && (
          <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold text-osrs-dark bg-${product.tagColor}`}>
            {product.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medieval text-lg font-bold text-osrs-goldBright mb-1">{product.name}</h3>
        <p className="text-stoner-haze/60 text-sm mb-3 flex-1 line-clamp-2">{product.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.badges.slice(0, 3).map(badge => (
            <span key={badge} className="text-xs px-2 py-0.5 rounded-full bg-stoner-greenDeep/50 text-stoner-haze/80 border border-stoner-green/30">
              {badge}
            </span>
          ))}
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-medieval text-2xl font-bold text-osrs-gold">
            {product.customQuantity ? `From $${product.price}` : `$${product.price}`}
          </span>
          <div
            onClick={product.customQuantity ? undefined : (e) => { e.preventDefault(); handleAdd(); }}
            className={`px-4 py-2 rounded-lg font-medieval font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
              product.customQuantity
                ? 'bg-gold-gradient text-osrs-dark hover:scale-105'
                : added
                  ? 'bg-stoner-greenBright text-osrs-dark'
                  : 'bg-gold-gradient text-osrs-dark hover:scale-105'
            }`}
          >
            {product.customQuantity ? (
              <><ShoppingCart className="w-4 h-4" /> Choose Amount</>
            ) : added ? (
              <><Check className="w-4 h-4" /> Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add</>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
