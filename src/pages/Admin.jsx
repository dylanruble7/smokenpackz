import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Check, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { OSRS_SKILLS } from '../data/skills.js'

export default function Admin() {
  const { user } = useAuth()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

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

    const totalLevel = Object.values(skillsObj).reduce((sum, v) => sum + v, 0)

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
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSaved(true)
      setForm({
        name: '', price: '', description: '', tag: '', tagColor: 'osrs-goldBright',
        badges: 'No Recoveries, Hand-Trained', stock: 1,
        skills: { ...emptySkills },
      })
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

          {/* Skills grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medieval text-osrs-goldBright text-sm">Skill Levels</h3>
              <span className="text-stoner-haze/40 text-xs">Leave blank if not trained / irrelevant</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {OSRS_SKILLS.map(skill => (
                <div key={skill.name} className="bg-osrs-darker rounded-lg p-2 border border-osrs-brownLight/50">
                  <label className="text-stoner-haze/60 text-xs flex items-center gap-1 mb-1">
                    <span>{skill.icon}</span> {skill.short}
                  </label>
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
                    <h3 className="font-medieval text-osrs-goldBright">{acc.name}</h3>
                    <p className="text-stoner-haze/50 text-sm">${acc.price} — Stock: {acc.stock}</p>
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
