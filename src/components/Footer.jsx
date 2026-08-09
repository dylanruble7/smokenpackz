import { MessageCircle, Shield, Zap } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function Footer() {
  return (
    <footer className="bg-osrs-darker border-t border-osrs-brownLight mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-0 mb-4">
              <img src="/packzlogo.png" alt="SmokenPackz" className="w-60 h-60 object-contain" />
              <span className="font-medieval text-2xl font-bold text-osrs-goldBright ml-1">SmokenPackz</span>
            </div>
            <p className="text-stoner-haze/60 text-sm max-w-md">
              Premium OSRS accounts and gold. Hand-trained, fairly priced, and delivered with chill vibes.
              Join the pack — we're not like the other sellers. We actually care.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-medieval text-osrs-gold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/shop" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">All Products</a></li>
              <li><a href="#/shop?cat=accounts" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Accounts</a></li>
              <li><a href="#/shop?cat=gold" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Gold</a></li>
              <li><a href="#/shop?cat=bonds" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Bonds</a></li>
              <li><a href="#/about" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">About Us</a></li>
              <li><a href="#/track" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medieval text-osrs-gold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/terms" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Terms of Service</a></li>
              <li><a href="#/privacy" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Privacy Policy</a></li>
              <li><a href="#/refund-policy" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Refund Policy</a></li>
              {discordUrls.map((d, i) => (
                <li key={i}><a href={d.url} target="_blank" rel="noopener noreferrer" className="text-stoner-haze/60 hover:text-osrs-goldBright transition-colors">Discord Server {i + 1}</a></li>
              ))}
            </ul>
          </div>

          {/* Trust badges */}
          <div>
            <h4 className="font-medieval text-osrs-gold mb-3 text-sm">Why Us?</h4>
            <ul className="space-y-2 text-sm text-stoner-haze/60">
              <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-stoner-greenBright" /> Safe & Secure</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-osrs-goldBright" /> Fast Delivery</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#5865F2]" /> 24/7 Discord Support</li>
            </ul>
          </div>
        </div>

        {/* Triple image */}
        <div className="flex justify-center mt-8">
          <img src="/triple.png" alt="Triple" className="max-w-full object-contain" />
        </div>

        <div className="border-t border-osrs-brownLight mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stoner-haze/40 text-xs">
            © 2025 SmokenPackz. Not affiliated with Jagex. OSRS is a trademark of Jagex Ltd.
          </p>
          <p className="text-stoner-haze/40 text-xs">
            Stay chill. Stay grinding. 🌿
          </p>
        </div>
      </div>
    </footer>
  )
}
