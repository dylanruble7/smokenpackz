import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Check, Loader, X, Search } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { OSRS_SKILLS, OSRS_ITEMS } from '../data/skills.js'

export default function Admin() {
  const { user } = useAuth()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [itemSearch, setItemSearch] = useState('')
  const [showItemPicker, setShowItemPicker] = useState(false)

  const emptySkills = {}
  OSRS_SKILLS.forEach(s => { emptySkills[s.name] = '' })

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    tag: '',
    tagColor: 'osrs-goldBright',
    badges: 'No Recoveries, Hand-Trained',
    stock: 1,
    skills: { ...emptySkills },
    qp: '',
    banned: false,
    goldAmount: '',
    importantItems: [],
  })

  useEffect(() => {
    async function checkStaff() {
      if (!user) {
        setChecking(false)
        return
      }
      const { data } = await supabase
        .from('staff_users')
        .select('*')
        .eq('email', user.email)
        .single()
      if (data) setAuthed(true)
      setChecking(false)
    }
    checkStaff()
  }, [user])

  useEffect(() => {
    if (authed) loadAccounts()
  }, [authed])

  const loadAccounts = async () => {
    const { data } = await supabase
      .from('custom_accounts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAccounts(data)
  }

  const handleSkillChange = (skillName, value) => {
    setForm(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillName]: value }
    }))
  }

  const toggleItem = (itemName) => {
    setForm(prev => {
      const has = prev.importantItems.includes(itemName)
      return {
        ...prev,
        importantItems: has
          ? prev.importantItems.filter(i => i !== itemName)
          : [...prev.importantItems, itemName]
      }
    })
  }

  const filteredItems = OSRS_ITEMS.filter(item =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  )

  const itemCategories = [...new Set(filteredItems.map(i => i.category))]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const id = 'acc-' + Date.now().toString(36)
    const skillsObj = {}
    Object.entries(form.skills).forEach(([k, v]) => {
      if (v !== '') skillsObj[k] = parseInt(v) || 0
    })

    const { error: insertError } = await supabase
      .from('custom_accounts')
      .insert({
        id,
        name: form.name,
        price: parseFloat(form.price) || 0,
        description: form.description,
        tag: form.tag,
        tag_color: form.tagColor,
        badges: form.badges.split(',').map(b => b.trim()).filter(Boolean),
        stock: parseInt(form.stock) || 1,
        skills: skillsObj,
        qp: parseInt(form.qp) || 0,
        banned: form.banned,
        gold_amount: form.goldAmount,
        important_items: form.importantItems,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSaved(true)
      setForm({
        name: '', price: '', description: '', tag: '', tagColor: 'osrs-goldBright',
        badges: 'No Recoveries, Hand-Trained', stock: 1,
        skills: { ...emptySkills },
        qp: '', banned: false, goldAmount: '', importantItems: [],
      })
      setItemSearch('')
      loadAccounts()
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('custom_accounts').delete().eq('id', id)
    loadAccounts()
  }

  if (checking) {
    return (
      <div className="smoke-bg min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-osrs-gold animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="smoke-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="card p-8">
            <h1 className="font-medieval text-xl text-osrs-goldBright mb-2">Staff Sign In Required</h1>
            <p className="text-stoner-haze/50 text-sm mb-6">Sign in with your staff account to manage listings.</p>
            <Link to="/auth" className="btn-primary inline-block">Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="smoke-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="card p-8">
            <h1 className="font-medieval text-xl text-red-400 mb-2">Access Denied</h1>
            <p className="text-stoner-haze/50 text-sm mb-6">Your account doesn't have staff permissions. Add your email to the staff_users table in Supabase.</p>
            <Link to="/" className="btn-secondary inline-block">Back Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="nav-link inline-flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <h1 className="section-title mb-2">Admin - Post New Account</h1>
        <p className="text-stoner-haze/60 text-sm mb-8">Fill in the details and skill levels, then post to the shop.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Account Name *</label>
              <input
                type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="e.g. Maxed Main, 1 Def Pure, etc."
              />
            </div>
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Price (USD) *</label>
              <input
                type="number" step="0.01" required value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="e.g. 150"
              />
            </div>
          </div>

          <div>
            <label className="block text-stoner-haze/70 text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors resize-none"
              placeholder="Describe the account — build, quests, bank value, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Tag (optional)</label>
              <input
                type="text" value={form.tag}
                onChange={e => setForm({ ...form, tag: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="e.g. HOT, NEW, CHEAP"
              />
            </div>
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Tag Color</label>
              <select
                value={form.tagColor}
                onChange={e => setForm({ ...form, tagColor: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
              >
                <option value="osrs-goldBright">Gold</option>
                <option value="stoner-greenBright">Green</option>
                <option value="stoner-purple">Purple</option>
                <option value="red-400">Red</option>
              </select>
            </div>
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Stock</label>
              <input
                type="number" min="1" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-stoner-haze/70 text-sm mb-1">Badges (comma-separated)</label>
            <input
              type="text" value={form.badges}
              onChange={e => setForm({ ...form, badges: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
              placeholder="No Recoveries, Hand-Trained, PK Ready"
            />
          </div>

          {/* QP, Gold, Banned */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Quest Points</label>
              <input
                type="number" min="0" max="300" value={form.qp}
                onChange={e => setForm({ ...form, qp: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="e.g. 280"
              />
            </div>
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Gold on Account</label>
              <input
                type="text" value={form.goldAmount}
                onChange={e => setForm({ ...form, goldAmount: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="e.g. 50M, 0, 200M"
              />
            </div>
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">Banned?</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, banned: !form.banned })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${form.banned ? 'bg-red-500' : 'bg-stoner-greenDeep'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${form.banned ? 'left-8' : 'left-1'}`} />
                </button>
                <span className={`text-sm font-bold ${form.banned ? 'text-red-400' : 'text-stoner-greenBright'}`}>
                  {form.banned ? 'BANNED' : 'Clean'}
                </span>
              </div>
            </div>
          </div>

          {/* Important Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medieval text-osrs-goldBright text-sm">Important Items & Unlocks</h3>
              <button
                type="button"
                onClick={() => setShowItemPicker(!showItemPicker)}
                className="text-xs px-3 py-1 rounded-lg bg-osrs-dark border border-osrs-brownLight text-stoner-haze hover:border-osrs-gold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> {showItemPicker ? 'Close' : 'Add Items'}
              </button>
            </div>

            {/* Selected items */}
            {form.importantItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.importantItems.map(item => (
                  <span key={item} className="text-xs px-2 py-1 rounded-full bg-osrs-gold/20 text-osrs-goldBright border border-osrs-gold/30 flex items-center gap-1">
                    {item}
                    <button type="button" onClick={() => toggleItem(item)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Item picker */}
            {showItemPicker && (
              <div className="bg-osrs-darker rounded-lg p-4 border border-osrs-brownLight max-h-96 overflow-y-auto">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stoner-haze/40" />
                  <input
                    type="text" value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-osrs-dark border border-osrs-brownLight text-stoner-haze text-sm focus:border-osrs-gold focus:outline-none transition-colors"
                    placeholder="Search items..."
                    autoFocus
                  />
                </div>
                {itemCategories.map(category => (
                  <div key={category} className="mb-4">
                    <h4 className="text-stoner-haze/50 text-xs uppercase tracking-wider mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredItems.filter(i => i.category === category).map(item => {
                        const selected = form.importantItems.includes(item.name)
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => toggleItem(item.name)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                              selected
                                ? 'bg-osrs-gold/30 border-osrs-gold text-osrs-goldBright'
                                : 'bg-osrs-dark border-osrs-brownLight text-stoner-haze/70 hover:border-osrs-gold/50'
                            }`}
                          >
                            {selected && '✓ '}{item.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <p className="text-stoner-haze/40 text-sm text-center py-4">No items found</p>
                )}
              </div>
            )}
          </div>

          {/* Skills grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medieval text-osrs-goldBright text-sm">Skill Levels</h3>
              <span className="text-stoner-haze/40 text-xs">Leave blank if not trained / irrelevant</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {OSRS_SKILLS.map(skill => (
                <div key={skill.name} className="bg-osrs-darker rounded-lg p-2 border border-osrs-brownLight/50 flex flex-col items-center">
                  <img
                    src={skill.iconUrl}
                    alt={skill.name}
                    className="w-6 h-6 object-contain mb-1"
                    style={{ imageRendering: 'pixelated' }}
                    loading="lazy"
                  />
                  <label className="text-stoner-haze/60 text-xs mb-1">{skill.short}</label>
                  <input
                    type="number" min="1" max="99"
                    value={form.skills[skill.name]}
                    onChange={e => handleSkillChange(skill.name, e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-osrs-dark border border-osrs-brownLight text-stoner-haze text-center text-sm font-bold focus:border-osrs-gold focus:outline-none transition-colors"
                    placeholder="-"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <><Loader className="w-5 h-5 animate-spin" /> Posting...</> 
              : saved ? <><Check className="w-5 h-5" /> Posted! Account is live</>
              : <><Save className="w-5 h-5" /> Post Account to Shop</>}
          </button>
        </form>

        {/* Existing accounts */}
        <div className="mt-8">
          <h2 className="font-medieval text-lg text-osrs-goldBright mb-4">Posted Accounts ({accounts.length})</h2>
          {accounts.length === 0 ? (
            <p className="text-stoner-haze/40 text-sm text-center py-8">No accounts posted yet.</p>
          ) : (
            <div className="space-y-3">
              {accounts.map(acc => (
                <div key={acc.id} className="card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medieval text-osrs-goldBright">{acc.name}</h3>
                      {acc.banned && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">BANNED</span>
                      )}
                    </div>
                    <p className="text-stoner-haze/50 text-sm">${acc.price} — Stock: {acc.stock} — QP: {acc.qp || 0} — Gold: {acc.gold_amount || '0'}</p>
                    {acc.important_items && acc.important_items.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {acc.important_items.slice(0, 5).map(item => (
                          <span key={item} className="text-xs px-1.5 py-0.5 rounded bg-osrs-gold/10 text-osrs-gold/70">
                            {item}
                          </span>
                        ))}
                        {acc.important_items.length > 5 && (
                          <span className="text-xs px-1.5 py-0.5 text-stoner-haze/40">+{acc.important_items.length - 5} more</span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(acc.skills || {}).filter(([,v]) => v > 0).slice(0, 6).map(([k, v]) => (
                        <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-osrs-dark/60 text-stoner-haze/60">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="text-red-400/60 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
