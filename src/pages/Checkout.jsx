import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Copy, Leaf, MessageCircle, Clock, AlertCircle, Loader, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCart } from '../context/CartContext.jsx'
import { cryptoOptions, paymentMethods, discordUrls } from '../data/products.js'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const [step, setStep] = useState('details')
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [orderInfo, setOrderInfo] = useState({ email: '', discord: '', rsn: '' })
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
    clearCart()
    setStep('success')
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
            <h2 className="font-medieval text-xl text-osrs-goldBright">Contact Info</h2>
            <p className="text-stoner-haze/50 text-sm">We need this to deliver your order. No spam, we promise. We're chill like that.</p>
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
            <div>
              <label className="block text-stoner-haze/70 text-sm mb-1">In-Game RSN (for gold delivery)</label>
              <input
                type="text"
                value={orderInfo.rsn}
                onChange={e => setOrderInfo({ ...orderInfo, rsn: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
                placeholder="Your RuneScape Name"
              />
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

        {/* Step: Payment - choose crypto */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-medieval text-xl text-osrs-goldBright mb-2">Choose Payment Method</h2>
              <p className="text-stoner-haze/50 text-sm mb-6">Pay with crypto, CashApp, or OSRS GP. Crypto payments are auto-confirmed on the blockchain.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

              {/* Non-crypto payment options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {paymentMethods.filter(m => m.id !== 'crypto').map(method => (
                  <div key={method.id} className="card p-6 text-center border border-osrs-brownLight">
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <div className="font-medieval font-bold text-stoner-haze">{method.name}</div>
                    <div className="text-stoner-haze/40 text-sm">{method.description}</div>
                    <p className="text-stoner-haze/50 text-xs mt-2">Contact us on Discord to pay with {method.name}</p>
                  </div>
                ))}
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
                <span className="text-osrs-gold">Total to Pay</span>
                <span className="text-osrs-goldBright font-bold">${cartTotal}</span>
              </div>
              <p className="text-stoner-haze/40 text-xs text-center">Powered by NOWPayments — auto-confirmed crypto payments</p>
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
                    Send the crypto equivalent of ${cartTotal}, then click "I've Paid" and confirm on Discord.
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
                      <span className="text-stoner-haze/50">USD Value:</span>
                      <span className="text-stoner-haze font-bold">${cartTotal}</span>
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
              {' '}We'll reach out to you on Discord ({orderInfo.discord}) for delivery.
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
