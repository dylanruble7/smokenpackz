import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="smoke-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-stoner-haze/30 mx-auto mb-4" />
          <h2 className="font-medieval text-2xl text-osrs-goldBright mb-2">Your bag is empty</h2>
          <p className="text-stoner-haze/50 mb-6">Time to fix that. The stash is waiting. 🌿</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="section-title mb-8">Your Cart 🛒</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="card p-4 flex items-center gap-4">
                <span className="text-4xl">{item.image}</span>
                <div className="flex-1">
                  <h3 className="font-medieval text-lg text-osrs-goldBright">{item.name}</h3>
                  <p className="text-stoner-haze/50 text-sm">${item.price} each</p>
                </div>
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-osrs-brownLight hover:bg-osrs-brown flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4 text-stoner-haze" />
                  </button>
                  <span className="font-medieval text-lg text-stoner-haze w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-osrs-brownLight hover:bg-osrs-brown flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-stoner-haze" />
                  </button>
                </div>
                {/* Price */}
                <span className="font-medieval text-xl font-bold text-osrs-gold w-20 text-right">
                  ${item.price * item.quantity}
                </span>
                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-20">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-stoner-haze/70">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-stoner-haze/70">
                <span>Delivery</span>
                <span className="text-stoner-greenBright">Free</span>
              </div>
            </div>
            <div className="border-t border-osrs-brownLight pt-4 mb-6">
              <div className="flex justify-between font-medieval text-xl">
                <span className="text-osrs-gold">Total</span>
                <span className="text-osrs-goldBright font-bold">${cartTotal}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-stoner-haze/40 text-xs text-center mt-3">
              Pay with BTC, LTC, ETH, USDT 💎
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
