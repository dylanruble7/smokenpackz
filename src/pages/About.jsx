import { Leaf, Shield, Zap, MessageCircle, Coins, Heart } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function About() {
  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <Leaf className="w-16 h-16 text-stoner-greenBright mx-auto mb-4 animate-float" />
          <h1 className="font-medieval text-4xl font-bold text-osrs-goldBright mb-4">About SmokenPackz 🌿</h1>
          <p className="text-stoner-haze/70 text-lg">
            We're not your average OSRS shop. We're a pack of chill gamers who've been grinding Gielinor since the dial-up days.
            We know the game, we know the risks, and we know how to keep things smooth.
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <Shield className="w-8 h-8 text-stoner-greenBright mb-3" />
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Safe & Secure</h2>
            <p className="text-stoner-haze/60">
              Every account is hand-trained — no bots, no shortcuts. We verify no recovery emails are set,
              and we give you all the original details. Your purchase is protected.
            </p>
          </div>

          <div className="card p-6">
            <Zap className="w-8 h-8 text-osrs-goldBright mb-3" />
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Fast Delivery</h2>
            <p className="text-stoner-haze/60">
              We deliver fast — no long waits, no runaround. Active on Discord 24/7.
              If you need something, just ping us.
            </p>
          </div>

          <div className="card p-6">
            <Coins className="w-8 h-8 text-osrs-gold mb-3" />
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Payments Accepted</h2>
            <p className="text-stoner-haze/60">
              We accept Crypto (Bitcoin, Litecoin, Ethereum, USDT), CashApp, and OSRS GP. No KYC, no middleman, no hassle.
              Privacy is a priority.
            </p>
          </div>

          <div className="card p-6">
            <MessageCircle className="w-8 h-8 text-[#5865F2] mb-3" />
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Community First</h2>
            <p className="text-stoner-haze/60">
              We're building a community, not just a shop. Join our Discord for exclusive deals,
              restock alerts, giveaways, and chill conversation with fellow OSRS players.
              We treat our pack right.
            </p>
          </div>

          <div className="card p-8 text-center bg-gradient-to-r from-[#2c2f33] to-[#36393f] border-[#5865F2]">
            <Heart className="w-8 h-8 text-[#5865F2] mx-auto mb-3" />
            <h2 className="font-medieval text-2xl text-white mb-2">Join the Pack 🐺</h2>
            <p className="text-stoner-haze/70 mb-4">Discord is where the magic happens. Come hang.</p>
            <div className="flex gap-3 justify-center">
              {discordUrls.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                   className="inline-block px-8 py-3 rounded-lg bg-[#5865F2] hover:bg-[#7983f5] text-white font-medieval font-bold transition-colors">
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
