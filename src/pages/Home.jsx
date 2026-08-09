import { Link } from 'react-router-dom'
import { Zap, Shield, MessageCircle, Coins, ArrowRight, ExternalLink, Crown } from 'lucide-react'
import { discordUrls } from '../data/products.js'
import { sponsors } from '../data/sponsors.js'

export default function Home() {
  return (
    <div className="smoke-bg">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-haze-gradient opacity-40" />
        <div className="absolute inset-0 bg-smoke animate-smoke" />

        {/* Floating leaves */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-30">🌿</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🍃</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🌿</div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <div className="mb-6 flex justify-center">
            <img src="/packzlogo.png" alt="SmokenPackz" className="w-64 h-64 object-contain animate-float" />
          </div>
          <h1 className="font-medieval text-5xl md:text-7xl font-black text-osrs-goldBright mb-4 drop-shadow-[0_0_20px_rgba(201,162,39,0.5)]">
            SmokenPackz
          </h1>
          <p className="font-osrs text-xs md:text-sm text-stoner-haze mb-2">
            PREMIUM OSRS ACCOUNTS & GOLD
          </p>
          <p className="text-stoner-haze/70 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Hand-trained accounts. Fast gold delivery. Crypto, CashApp & OSRS GP accepted. Zero stress, all chill.
            We're not just a shop — we're the pack. 🐺
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary flex items-center justify-center gap-2">
              Browse Products <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={discordUrls[0].url} target="_blank" rel="noopener noreferrer"
               className="btn-secondary flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Join Discord
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-osrs-brownLight bg-osrs-dark/50 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <Shield className="w-8 h-8 text-stoner-greenBright mb-2" />
            <span className="text-stoner-haze text-sm">Safe & Secure</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="w-8 h-8 text-osrs-goldBright mb-2" />
            <span className="text-stoner-haze text-sm">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Coins className="w-8 h-8 text-osrs-gold mb-2" />
            <span className="text-stoner-haze text-sm">Payments Accepted</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <MessageCircle className="w-8 h-8 text-[#5865F2] mb-2" />
            <span className="text-stoner-haze text-sm">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <Crown className="w-10 h-10 text-osrs-goldBright mx-auto mb-3" />
          <h2 className="section-title">Our Sponsors</h2>
          <p className="text-stoner-haze/50 text-sm mt-2 max-w-xl mx-auto">
            Support the businesses that support the pack. Check out our sponsors' communities and services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsors.map(sponsor => (
            <div key={sponsor.id} className="card overflow-hidden group">
              {/* Banner */}
              <div className="h-40 bg-gradient-to-br from-osrs-brown/40 to-osrs-dark/60 flex items-center justify-center overflow-hidden">
                {sponsor.banner && sponsor.bannerType === 'video' ? (
                  <video src={sponsor.banner} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : sponsor.banner ? (
                  <img src={sponsor.banner} alt={sponsor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="text-center">
                    <Crown className="w-10 h-10 text-osrs-gold/40 mx-auto mb-1" />
                    <span className="text-stoner-haze/30 text-sm">Banner Available</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-medieval text-lg font-bold text-osrs-goldBright mb-2">{sponsor.name}</h3>
                <p className="text-stoner-haze/60 text-sm mb-4">{sponsor.description}</p>
                <div className="flex gap-3">
                  {sponsor.discord && (
                    <a href={sponsor.discord} target="_blank" rel="noopener noreferrer"
                       className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4">
                      <MessageCircle className="w-4 h-4 text-[#5865F2]" /> Discord
                    </a>
                  )}
                  {sponsor.website && (
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                       className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4">
                      <ExternalLink className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-stoner-haze/40 text-xs mt-6">
          Want to sponsor SmokenPackz? Join our Discord to inquire about ad placement.
        </p>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="section-title text-center mb-12">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/shop?cat=accounts" className="card group p-8 text-center">
            <img src="/packzaccs.png" alt="OSRS Accounts" className="w-40 h-40 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-medieval text-2xl font-bold text-osrs-goldBright mb-2">OSRS Accounts</h3>
            <p className="text-stoner-haze/60">Pures, mains, skillers, ironmen — hand-trained, no botting, no recovery risk.</p>
          </Link>
          <Link to="/shop?cat=gold" className="card group p-8 text-center">
            <img src="/packzgold.png" alt="OSRS Gold" className="w-40 h-40 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-medieval text-2xl font-bold text-osrs-goldBright mb-2">OSRS Gold</h3>
            <p className="text-stoner-haze/60">From pocket change to whale orders. Fast, safe, in-game trades. Bonus GP on bulk.</p>
          </Link>
          <Link to="/shop?cat=bonds" className="card group p-8 text-center">
            <img src="/packzbond.png" alt="OSRS Bonds" className="w-40 h-40 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-medieval text-2xl font-bold text-osrs-goldBright mb-2">OSRS Bonds</h3>
            <p className="text-stoner-haze/60">Membership bonds from $4.50. Cheaper than Jagex. Bulk discounts available.</p>
          </Link>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-8 md:p-12 text-center bg-gradient-to-r from-[#2c2f33] to-[#36393f] border-[#5865F2]">
          <MessageCircle className="w-12 h-12 text-[#5865F2] mx-auto mb-4" />
          <h2 className="font-medieval text-3xl font-bold text-white mb-4">Join the Pack 🐺</h2>
          <p className="text-stoner-haze/70 text-lg mb-6 max-w-2xl mx-auto">
            Exclusive deals, restock alerts, giveaways, and the chillest OSRS community on Discord.
            We post drops before they hit the site. Don't miss out.
          </p>
          <div className="flex gap-3 justify-center">
            {discordUrls.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                 className="inline-block px-8 py-3 rounded-lg bg-[#5865F2] hover:bg-[#7983f5] text-white font-medieval font-bold transition-colors">
                Join Server {i + 1}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
