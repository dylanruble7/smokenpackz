import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Copy, Leaf, MessageCircle, Clock, AlertCircle, Loader, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useGpPrices } from '../hooks/useGpPrices.js'
import { sendOrderNotification } from '../lib/notify.js'
import { cryptoOptions, paymentMethods, discordUrls } from '../data/products.js'

const PAYMENT_FEES = {
  crypto: { rate: 0.02, flat: 0, label: 'Crypto network fee' },
  card: { rate: 0.03, flat: 0.30, label: 'Card processing fee' },
  cashapp: { rate: 0.015, flat: 0, label: 'CashApp fee' },
  osrsgp: { rate: 0, flat: 0, label: 'No fee' },
}

function calcFee(method, total) {
  const fee = PAYMENT_FEES[method]
  if (!fee) return 0
  return (total * fee.rate) + fee.flat
}

function calcTotalWithFee(method, total) {
  return total + calcFee(method, total)
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { prices: gpPrices, ourPrice, lowestCompetitor, updatedAt } = useGpPrices()
  const navigate = useNavigate()
  const [step, setStep] = useState('details')
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [orderInfo, setOrderInfo] = useState({ email: '', discord: '', rsn: '' })

  useEffect(() => {
    if (user?.email) {
      setOrderInfo(prev => ({ ...prev, email: user.email }))
    }
  }, [user])
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stoner-haze/60 text-xl mb-4">Cart is empty 🌿</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    )
  }

  const generateOrderId = () => {
    return 'SP-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase().slice(-4)
  }

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    setStep('payment')
  }

  const handleCryptoSelect = async (crypto) => {
    setSelectedCrypto(crypto)
    setLoading(true)
    setError('')
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)

    const orderDescription = cart.map(item => `${item.image} ${item.name} x${item.quantity}`).join(', ')

    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          order_id: newOrderId,
          order_description: orderDescription,
          customer_email: orderInfo.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create invoice')
      }

      setInvoice(data)
      setStep('confirm')
      startPolling(data.id)
    } catch (err) {
      setError(err.message)
      setStep('confirm')
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (invoiceId) => {
    if (pollRef.current) clearInterval(pollRef.current)

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?invoiceId=${invoiceId}`)
        const data = await response.json()

        if (response.ok) {
          setPaymentStatus(data.payment_status)

          if (data.payment_status === 'finished' || data.payment_status === 'confirmed') {
            clearInterval(pollRef.current)
            clearCart()
            setStep('success')
          } else if (data.payment_status === 'failed' || data.payment_status === 'expired') {
            clearInterval(pollRef.current)
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 10000)
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const handleCopyAddress = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleComplete = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    sendOrderNotification({
      orderId, paymentMethod: selectedPayment || 'crypto',
      cartTotal, items: cart, rsn: orderInfo.rsn, email: orderInfo.email, user,
    })
    clearCart()
    setStep('success')
  }

  const handleCashApp = () => {
    setSelectedPayment('cashapp')
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    setStep('cashapp')
  }

  const handleOSRSGP = () => {
    setSelectedPayment('osrsgp')
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    setStep('osrsgp')
  }

  const handleGoToChat = () => {
    localStorage.setItem('my_orders', JSON.stringify([
      ...JSON.parse(localStorage.getItem('my_orders') || '[]'),
      orderId,
    ]))
    sendOrderNotification({
      orderId, paymentMethod: 'osrsgp',
      cartTotal, items: cart, rsn: orderInfo.rsn, email: orderInfo.email, user,
    })
    clearCart()
    navigate(`/chat/${orderId}`)
  }

  const handleCard = () => {
    setSelectedPayment('card')
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    setStep('card')
  }

  const statusConfig = {
    waiting: { label: 'Waiting for Payment', color: 'text-yellow-400', icon: Clock },
    confirming: { label: 'Confirming on Blockchain', color: 'text-blue-400', icon: Loader },
    confirmed: { label: 'Payment Confirmed!', color: 'text-stoner-greenBright', icon: Check },
    finished: { label: 'Payment Complete!', color: 'text-stoner-greenBright', icon: Check },
    failed: { label: 'Payment Failed', color: 'text-red-400', icon: AlertCircle },
    expired: { label: 'Payment Expired', color: 'text-red-400', icon: AlertCircle },
    null: { label: 'Awaiting Payment', color: 'text-yellow-400', icon: Clock },
  }

  const currentStatus = statusConfig[paymentStatus] || statusConfig.null
  const StatusIcon = currentStatus.icon

  const payAmount = invoice?.pay_amount
  const payCurrency = invoice?.pay_currency || selectedCrypto?.symbol
  const payAddress = invoice?.pay_address || selectedCrypto?.address
  const invoiceUrl = invoice?.invoice_url

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/cart" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="section-title mb-8">Checkout 💎</h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {['details', 'payment', 'confirm', 'success'].map((s, i) => {
            const labels = ['Details', 'Payment', 'Confirm', 'Done']
            const active = step === s
            const passed = ['details', 'payment', 'confirm', 'success'].indexOf(step) > i
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  active ? 'bg-gold-gradient text-osrs-dark' : passed ? 'bg-stoner-greenBright text-osrs-dark' : 'bg-osrs-brownLight text-stoner-haze/40'
                }`}>
                  {passed ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={active ? 'text-osrs-goldBright' : 'text-stoner-haze/40'}>{labels[i]}</span>
                {i < 3 && <div className="w-8 h-px bg-osrs-brownLight" />}
              </div>
            )
          })}
        </div>

        {/* Step: Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="card p-6 space-y-4 max-w-lg">
            <h2 className="font-medieval text-xl text-osrs-goldBright">Delivery Info</h2>
            {user ? (
              <p className="text-stoner-haze/50 text-sm">Signed in as <span className="text-osrs-goldBright font-bold">{user.email}</span>. Just drop your RSN below — we'll handle the rest in Discord after you order.</p>
            ) : (
              <p className="text-stoner-haze/50 text-sm">We need this to deliver your order. No spam, we promise. We're chill like that.</p>
            )}
            {!user && (
              <>
                <div>
                  <label className="block text-stoner-haze/70 text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={orderInfo.email}
                    onChange={e => setOrderInfo({ ...orderInfo, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-stoner-haze/70 text-sm mb-1">Discord Username *</label>
                  <input
                    type="text"
                    required
                    value={orderInfo.discord}
                    onChange={e => setOrderInfo({ ...orderInfo, discord: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                    placeholder="username#1234 or @username"
                  />
                  <p className="text-stoner-haze/40 text-xs mt-1">We'll contact you on Discord for delivery.</p>
                </div>
              </>
            )}
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">In-Game RSN *</label>
              <input
                type="text"
                required
                value={orderInfo.rsn}
                onChange={e => setOrderInfo({ ...orderInfo, rsn: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="Your RuneScape Name"
              />
              <p className="text-stoner-haze/40 text-xs mt-1">Where we should deliver your gold/items.</p>
            </div>

            {/* Order summary */}
            <div className="bg-osrs-darker rounded-lg p-4 border border-osrs-brownLight">
              <h3 className="font-medieval text-osrs-gold text-sm mb-2">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-stoner-haze/70 py-1">
                  <span>{item.image} {item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-osrs-brownLight mt-2 pt-2 flex justify-between font-bold">
                <span className="text-osrs-gold">Total</span>
                <span className="text-osrs-goldBright">${cartTotal}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">Continue to Payment</button>
          </form>
        )}

        {/* Step: Payment - choose method */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Choose Payment Method</h2>
              <p className="text-stoner-haze/50 text-sm mb-6">Pay with crypto, card, CashApp, or OSRS GP.</p>

              {/* Crypto options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {cryptoOptions.map(crypto => (
                  <button
                    key={crypto.id}
                    onClick={() => handleCryptoSelect(crypto)}
                    disabled={loading}
                    className="card p-6 text-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: crypto.color + '40' }}
                  >
                    <div className="text-4xl mb-2" style={{ color: crypto.color }}>{crypto.icon}</div>
                    <div className="font-medieval font-bold text-stoner-haze">{crypto.name}</div>
                    <div className="text-stoner-haze/40 text-sm">{crypto.symbol}</div>
                  </button>
                ))}
              </div>

              {/* Card / CashApp / OSRS GP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleCard}
                  className="card p-6 text-center hover:scale-105 transition-transform border border-osrs-brownLight"
                >
                  <div className="text-4xl mb-2">💳</div>
                  <div className="font-medieval font-bold text-stoner-haze">Credit / Debit</div>
                  <div className="text-stoner-haze/40 text-sm">Visa, Mastercard, Amex</div>
                </button>

                <button
                  onClick={handleCashApp}
                  className="card p-6 text-center hover:scale-105 transition-transform border border-osrs-brownLight"
                >
                  <div className="text-4xl mb-2">$</div>
                  <div className="font-medieval font-bold text-stoner-haze">CashApp</div>
                  <div className="text-stoner-haze/40 text-sm">Send USD instantly</div>
                </button>

                <button
                  onClick={handleOSRSGP}
                  className="card p-6 text-center hover:scale-105 transition-transform border border-osrs-brownLight"
                >
                  <div className="text-4xl mb-2">🪙</div>
                  <div className="font-medieval font-bold text-stoner-haze">OSRS GP</div>
                  <div className="text-stoner-haze/40 text-sm">Pay with in-game gold</div>
                </button>
              </div>

              {loading && (
                <div className="text-center mt-4">
                  <Loader className="w-6 h-6 text-osrs-gold mx-auto animate-spin mb-2" />
                  <p className="text-stoner-haze/50 text-sm">Creating invoice...</p>
                </div>
              )}
            </div>

            <div className="card p-6 max-w-md mx-auto">
              <div className="flex justify-between font-medieval text-xl mb-2">
                <span className="text-osrs-gold">Order Total</span>
                <span className="text-osrs-goldBright font-bold">${cartTotal}</span>
              </div>
              <p className="text-stoner-haze/40 text-xs text-center">Processing fees calculated on next step based on payment method</p>
            </div>
          </div>
        )}

        {/* Step: CashApp */}
        {step === 'cashapp' && (
          <div className="card p-8 max-w-lg mx-auto text-center">
            <div className="text-5xl mb-3">$</div>
            <h2 className="font-medieval text-2xl text-osrs-goldBright mb-2">Pay with CashApp</h2>
            <p className="text-stoner-haze/50 text-sm mb-6">Order ID: <span className="font-bold text-osrs-gold">{orderId}</span></p>

            <div className="bg-osrs-darker rounded-lg p-6 border border-osrs-brownLight space-y-4">
              <div className="bg-osrs-dark/60 rounded-lg p-3 border border-osrs-brownLight/50">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stoner-haze/50">Order Total</span>
                  <span className="text-stoner-haze">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stoner-haze/50">{PAYMENT_FEES.cashapp.label} (1.5%)</span>
                  <span className="text-stoner-haze/70">+${calcFee('cashapp', cartTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-osrs-brownLight/30">
                  <span className="text-osrs-gold">Total to Send</span>
                  <span className="text-osrs-goldBright text-lg">${calcTotalWithFee('cashapp', cartTotal).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <p className="text-stoner-haze/50 text-sm mb-2">Send <span className="text-osrs-goldBright font-bold text-lg">${calcTotalWithFee('cashapp', cartTotal).toFixed(2)}</span> to:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="px-4 py-3 rounded-lg bg-osrs-dark border border-osrs-brownLight text-osrs-goldBright text-xl font-bold">
                    $SMOKENPACKZ
                  </code>
                  <button onClick={() => handleCopyAddress('$SMOKENPACKZ')} className="px-3 py-3 rounded-lg bg-osrs-brownLight hover:bg-osrs-brown transition-colors">
                    {copied ? <Check className="w-5 h-5 text-stoner-greenBright" /> : <Copy className="w-5 h-5 text-stoner-haze" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG value="https://cash.app/$SMOKENPACKZ" size={180} bgColor="#ffffff" fgColor="#1a1410" level="M" />
                </div>
              </div>

              <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-3">
                <p className="text-stoner-haze/70 text-sm">
                  <strong className="text-stoner-greenBright">How it works:</strong> Scan the QR code or send manually to <strong className="text-osrs-goldBright">$SMOKENPACKZ</strong>.
                  Send <strong className="text-osrs-goldBright">${calcTotalWithFee('cashapp', cartTotal).toFixed(2)}</strong> (includes 1.5% processing fee).
                  Include your order ID <strong className="text-osrs-gold">{orderId}</strong> in the note. Click "I've Paid" after sending.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back</button>
              <button onClick={handleComplete} className="btn-primary flex-1">I've Paid ✅</button>
            </div>
          </div>
        )}

        {/* Step: OSRS GP */}
        {step === 'osrsgp' && (
          <div className="card p-8 max-w-lg mx-auto text-center">
            <div className="text-5xl mb-3">🪙</div>
            <h2 className="font-medieval text-2xl text-osrs-goldBright mb-2">Pay with OSRS GP</h2>
            <p className="text-stoner-haze/50 text-sm mb-6">Order ID: <span className="font-bold text-osrs-gold">{orderId}</span></p>

            <div className="bg-osrs-darker rounded-lg p-6 border border-osrs-brownLight space-y-4">
              {/* GP Price Tracker */}
              <div className="bg-osrs-dark/60 rounded-lg p-4 border border-osrs-brownLight/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medieval text-sm text-osrs-goldBright">📊 Live GP Market Rates</h3>
                  {updatedAt && <span className="text-stoner-haze/30 text-xs">Updated {updatedAt.toLocaleTimeString()}</span>}
                </div>
                <div className="space-y-1.5">
                  {gpPrices.map(p => (
                    <div key={p.competitor} className="flex justify-between items-center text-sm">
                      <span className={p.is_us ? 'text-stoner-greenBright font-bold' : 'text-stoner-haze/60'}>
                        {p.is_us ? '🌿 ' : ''}{p.competitor}
                      </span>
                      <span className={p.is_us ? 'text-stoner-greenBright font-bold' : 'text-stoner-haze/60'}>
                        ${p.price_per_mil.toFixed(2)}/M
                      </span>
                    </div>
                  ))}
                </div>
                {lowestCompetitor && (
                  <p className="text-stoner-greenBright text-xs mt-2 pt-2 border-t border-osrs-brownLight/30">
                    ✓ We match the lowest competitor price!
                  </p>
                )}
              </div>

              <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-4">
                <p className="text-stoner-haze/70 text-sm mb-3">
                  <strong className="text-stoner-greenBright">How it works:</strong> Place your order below, then join our Discord to arrange the GP trade.
                  We'll meet in-game and trade the gold for your items. Easy and safe.
                </p>
              </div>

              {/* GP Calculation */}
              <div className="text-left bg-osrs-dark rounded-lg p-4 border border-osrs-brownLight space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stoner-haze/50">Order Total (USD)</span>
                  <span className="text-osrs-goldBright font-bold">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stoner-haze/50">Our GP Rate</span>
                  <span className="text-stoner-haze font-bold">${ourPrice.toFixed(2)}/M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stoner-haze/50">Processing Fee</span>
                  <span className="text-stoner-greenBright font-bold">$0.00 (FREE)</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-osrs-brownLight/30">
                  <span className="text-osrs-gold">GP to Trade</span>
                  <span className="text-osrs-goldBright text-lg">{Math.ceil(cartTotal / ourPrice).toLocaleString()}M GP</span>
                </div>
              </div>

              <p className="text-stoner-haze/50 text-sm">
                Your RSN: <span className="text-osrs-goldBright font-bold">{orderInfo.rsn || 'Not provided'}</span>
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back</button>
              <button onClick={handleGoToChat} className="btn-primary flex-1">Place Order & Start Chat 💬</button>
            </div>
          </div>
        )}

        {/* Step: Card */}
        {step === 'card' && (
          <div className="card p-8 max-w-lg mx-auto text-center">
            <div className="text-5xl mb-3">💳</div>
            <h2 className="font-medieval text-2xl text-osrs-goldBright mb-2">Credit / Debit Card</h2>
            <p className="text-stoner-haze/50 text-sm mb-6">Order ID: <span className="font-bold text-osrs-gold">{orderId}</span></p>

            <div className="bg-osrs-darker rounded-lg p-6 border border-osrs-brownLight space-y-4">
              <div className="bg-osrs-dark/60 rounded-lg p-3 border border-osrs-brownLight/50">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stoner-haze/50">Order Total</span>
                  <span className="text-stoner-haze">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stoner-haze/50">{PAYMENT_FEES.card.label} (3% + $0.30)</span>
                  <span className="text-stoner-haze/70">+${calcFee('card', cartTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-osrs-brownLight/30">
                  <span className="text-osrs-gold">Total to Pay</span>
                  <span className="text-osrs-goldBright text-lg">${calcTotalWithFee('card', cartTotal).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-4">
                <p className="text-stoner-haze/70 text-sm">
                  <strong className="text-stoner-greenBright">Card payments coming soon!</strong> We're working on integrating direct card payments.
                  For now, please use crypto, CashApp, or OSRS GP — or join our Discord and we'll sort it out.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back to Payment Methods</button>
            </div>
          </div>
        )}

        {/* Step: Confirm - show wallet address + QR code + live status */}
        {step === 'confirm' && selectedCrypto && (
          <div className="space-y-6">
            <div className="card p-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="text-6xl mb-2" style={{ color: selectedCrypto.color }}>{selectedCrypto.icon}</div>
                <h2 className="font-medieval text-2xl text-osrs-goldBright">Pay with {selectedCrypto.name}</h2>
                <p className="text-stoner-haze/50 text-sm">Order ID: <span className="font-bold text-osrs-gold">{orderId}</span></p>
              </div>

              {error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold">Invoice Error</span>
                  </div>
                  <p className="text-stoner-haze/70 text-sm mb-3">{error}</p>
                  <p className="text-stoner-haze/50 text-xs mb-3">
                    If NOWPayments isn't configured yet, you can still pay manually to the wallet address below.
                    Send the crypto equivalent of ${calcTotalWithFee('crypto', cartTotal).toFixed(2)} (includes 2% processing fee), then click "I've Paid" and confirm on Discord.
                  </p>
                  <div className="bg-osrs-darker rounded-lg p-4 border border-osrs-brownLight">
                    <label className="block text-stoner-haze/70 text-sm mb-1">Send {selectedCrypto.symbol} to:</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded bg-osrs-dark border border-osrs-brownLight text-stoner-haze text-sm break-all">
                        {selectedCrypto.address}
                      </code>
                      <button onClick={() => handleCopyAddress(selectedCrypto.address)} className="px-3 py-2 rounded-lg bg-osrs-brownLight hover:bg-osrs-brown transition-colors">
                        {copied ? <Check className="w-4 h-4 text-stoner-greenBright" /> : <Copy className="w-4 h-4 text-stoner-haze" />}
                      </button>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <QRCodeSVG value={selectedCrypto.address} size={180} bgColor="transparent" fgColor="#c9a227" level="M" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back</button>
                    <button onClick={handleComplete} className="btn-primary flex-1">I've Paid ✅</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* QR Code */}
                  {payAddress && (
                    <div className="flex flex-col items-center mb-6">
                      <div className="bg-white p-4 rounded-xl mb-3">
                        <QRCodeSVG value={payAddress} size={200} bgColor="#ffffff" fgColor="#1a1410" level="M" />
                      </div>
                      <p className="text-stoner-haze/50 text-sm flex items-center gap-1">
                        <QrCode className="w-4 h-4" /> Scan with your {selectedCrypto.name} wallet
                      </p>
                    </div>
                  )}

                  {/* Payment details */}
                  <div className="bg-osrs-darker rounded-lg p-4 border border-osrs-brownLight space-y-4">
                    {payAddress && (
                      <div>
                        <label className="block text-stoner-haze/70 text-sm mb-1">Send {payCurrency} to this address:</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 rounded bg-osrs-dark border border-osrs-brownLight text-stoner-haze text-sm break-all">
                            {payAddress}
                          </code>
                          <button onClick={() => handleCopyAddress(payAddress)} className="px-3 py-2 rounded-lg bg-osrs-brownLight hover:bg-osrs-brown transition-colors">
                            {copied ? <Check className="w-4 h-4 text-stoner-greenBright" /> : <Copy className="w-4 h-4 text-stoner-haze" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {payAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-stoner-haze/50">Amount to send:</span>
                        <span className="text-stoner-haze font-bold">{payAmount} {payCurrency}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-stoner-haze/50">Order Total:</span>
                      <span className="text-stoner-haze font-bold">${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stoner-haze/50">{PAYMENT_FEES.crypto.label} (2%):</span>
                      <span className="text-stoner-haze/70">+${calcFee('crypto', cartTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-osrs-brownLight/30">
                      <span className="text-osrs-gold">Total USD:</span>
                      <span className="text-osrs-goldBright">${calcTotalWithFee('crypto', cartTotal).toFixed(2)}</span>
                    </div>

                    {/* Live status */}
                    <div className="border-t border-osrs-brownLight pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-stoner-haze/50 text-sm">Payment Status:</span>
                        <div className={`flex items-center gap-2 font-bold text-sm ${currentStatus.color}`}>
                          <StatusIcon className={`w-4 h-4 ${paymentStatus === 'confirming' ? 'animate-spin' : ''}`} />
                          {currentStatus.label}
                        </div>
                      </div>
                      {paymentStatus === 'waiting' && (
                        <p className="text-stoner-haze/40 text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Auto-checking every 10 seconds...
                        </p>
                      )}
                    </div>

                    {invoiceUrl && (
                      <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-3">
                        <p className="text-stoner-haze/70 text-sm mb-2">
                          <strong className="text-stoner-greenBright">Tip:</strong> You can also pay via the NOWPayments hosted page:
                        </p>
                        <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-osrs-gold hover:text-osrs-goldBright underline text-sm">
                          Open NOWPayments Invoice →
                        </a>
                      </div>
                    )}

                    <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-3">
                      <p className="text-stoner-haze/70 text-sm">
                        <strong className="text-stoner-greenBright">How it works:</strong> Send the exact amount of {payCurrency || selectedCrypto.symbol} to the address above.
                        The payment will be auto-detected on the blockchain. Once confirmed, you'll be redirected automatically.
                        Then join our Discord to arrange delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setStep('payment') }} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button onClick={handleComplete} className="btn-primary flex-1">
                      I've Paid Manually ✅
                    </button>
                  </div>

                  <div className="mt-4 flex gap-3 justify-center">
                    {discordUrls.map((d, i) => (
                      <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-[#5865F2] hover:text-[#7983f5] transition-colors text-sm">
                        <MessageCircle className="w-4 h-4" /> Confirm on Server {i + 1}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="card p-12 max-w-2xl mx-auto text-center">
            <Leaf className="w-16 h-16 text-stoner-greenBright mx-auto mb-4 animate-float" />
            <h2 className="font-medieval text-3xl text-osrs-goldBright mb-2">
              {paymentStatus === 'finished' || paymentStatus === 'confirmed' ? 'Payment Confirmed! 🎉' : 'Order Placed! 🎉'}
            </h2>
            <p className="text-stoner-haze/70 text-lg mb-2">Thanks for choosing SmokenPackz.</p>
            <p className="text-stoner-haze/50 mb-6">
              Your order ID is <span className="text-osrs-gold font-bold">{orderId}</span>.
              {paymentStatus === 'finished' || paymentStatus === 'confirmed'
                ? ' Your crypto payment has been auto-verified on the blockchain.'
                : ' We\'ll verify your payment and contact you on Discord.'}
              {' '}{user ? "We'll reach out to you on Discord for delivery." : `We'll reach out to you on Discord (${orderInfo.discord}) for delivery.`}
            </p>
            <div className="bg-stoner-greenDeep/20 border border-stoner-green/30 rounded-lg p-4 mb-6">
              <p className="text-stoner-haze/70 text-sm">
                <strong className="text-stoner-greenBright">Next step:</strong> Join our Discord and post your order ID in the orders channel.
                We'll confirm and deliver within minutes. Stay chill! 🌿
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              {discordUrls.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                   className="btn-secondary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Server {i + 1}
                </a>
              ))}
              <Link to="/shop" className="btn-primary">Keep Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
