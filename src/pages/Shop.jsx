import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { products } from '../data/products.js'
import { supabase } from '../lib/supabase.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cat = searchParams.get('cat') || 'all'
  const [filter, setFilter] = useState(cat)
  const [customAccounts, setCustomAccounts] = useState([])

  useEffect(() => {
    setFilter(cat)
  }, [cat])

  useEffect(() => {
    async function loadAccounts() {
      const { data } = await supabase
        .from('custom_accounts')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setCustomAccounts(data)
    }
    loadAccounts()
  }, [])

  const setCategory = (c) => {
    if (c === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: c })
    }
  }

  const accountProducts = customAccounts.map(acc => ({
    id: acc.id,
    category: 'accounts',
    name: acc.name,
    price: parseFloat(acc.price),
    image: '/osrs-skills.webp',
    tag: acc.tag || '',
    tagColor: acc.tag_color || '',
    description: acc.description || '',
    stats: {},
    skills: acc.skills || {},
    badges: acc.badges || [],
    stock: acc.stock || 1,
  }))

  const allProducts = [...accountProducts, ...products]
  const filtered = filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter)

  const tabs = [
    { id: 'all', label: 'All Products', icon: null, img: null },
    { id: 'accounts', label: 'Accounts', icon: null, img: '/packzaccs.png' },
    { id: 'gold', label: 'Gold', icon: null, img: '/packzgold.png' },
    { id: 'bonds', label: 'Bonds', icon: null, img: '/packzbond.png' },
  ]

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="section-title mb-2">The Shop 🛒</h1>
        <p className="text-stoner-haze/60 mb-8">Browse the stash. Crypto checkout. Fast delivery. Stay chill.</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = filter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-5 py-2 rounded-lg font-medieval font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                  active
                    ? 'bg-gold-gradient text-osrs-dark'
                    : 'bg-osrs-dark/50 text-stoner-haze border border-osrs-brownLight hover:border-osrs-gold'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.img && <img src={tab.img} alt={tab.label} className="w-6 h-6 object-contain rounded" />}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stoner-haze/40 text-xl">No products found. Check back soon! 🌿</p>
          </div>
        )}
      </div>
    </div>
  )
}
