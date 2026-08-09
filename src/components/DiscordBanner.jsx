import { MessageCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { discordUrls } from '../data/products.js'

export default function DiscordBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('discord-banner-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('discord-banner-dismissed', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-float">
      <div className="bg-[#2c2f33] border border-[#5865F2] rounded-xl p-4 shadow-2xl">
        <button onClick={dismiss} className="absolute top-2 right-2 text-stoner-haze/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <MessageCircle className="w-8 h-8 text-[#5865F2] flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medieval font-bold text-white mb-1">Join the Pack! 🐺</h4>
            <p className="text-stoner-haze/70 text-sm mb-3">
              Get exclusive deals, restock alerts, and chill with the community on our Discord.
            </p>
            <div className="flex gap-2">
              {discordUrls.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                   className="inline-block px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#7983f5] text-white font-medieval text-sm font-bold transition-colors">
                  Join Server {i + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
