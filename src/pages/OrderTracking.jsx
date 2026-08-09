import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search, Clock, Check, AlertCircle, Loader, Leaf, MessageCircle, ArrowLeft } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function OrderTracking() {
  const { orderId: paramOrderId } = useParams()
  const [searchId, setSearchId] = useState(paramOrderId || '')
  const [invoiceId, setInvoiceId] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchId.trim()) return

    setLoading(true)
    setError('')
    setPaymentData(null)

    try {
      const response = await fetch(`/api/check-payment?invoiceId=${encodeURIComponent(searchId.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Order not found')
      } else {
        setPaymentData(data)
        setInvoiceId(searchId.trim())
        startPolling(searchId.trim())
      }
    } catch (err) {
      setError('Failed to check order status')
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current)

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?invoiceId=${encodeURIComponent(id)}`)
        const data = await response.json()

        if (response.ok) {
          setPaymentData(data)

          if (data.payment_status === 'finished' || data.payment_status === 'confirmed' ||
              data.payment_status === 'failed' || data.payment_status === 'expired') {
            clearInterval(pollRef.current)
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 10000)
  }

  useEffect(() => {
    if (paramOrderId) {
      handleSearch()
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const statusConfig = {
    waiting: { label: 'Waiting for Payment', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', icon: Clock },
    confirming: { label: 'Confirming on Blockchain', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', icon: Loader },
    confirmed: { label: 'Payment Confirmed', color: 'text-stoner-greenBright', bg: 'bg-stoner-greenBright/10', border: 'border-stoner-greenBright/30', icon: Check },
    finished: { label: 'Payment Complete', color: 'text-stoner-greenBright', bg: 'bg-stoner-greenBright/10', border: 'border-stoner-greenBright/30', icon: Check },
    failed: { label: 'Payment Failed', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', icon: AlertCircle },
    expired: { label: 'Payment Expired', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', icon: AlertCircle },
  }

  const currentStatus = paymentData ? (statusConfig[paymentData.payment_status] || statusConfig.waiting) : null
  const StatusIcon = currentStatus?.icon

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <h1 className="section-title mb-2">Track Your Order 🔍</h1>
        <p className="text-stoner-haze/60 mb-8">Enter your invoice ID or order ID to check payment status.</p>

        {/* Search */}
        <form onSubmit={handleSearch} className="card p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Invoice ID (e.g. 1234567890)"
              className="flex-1 px-4 py-2 rounded-lg bg-osrs-darker border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors"
            />
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Search className="w-4 h-4" /> Track
            </button>
          </div>
        </form>

        {loading && (
          <div className="card p-8 text-center">
            <Loader className="w-8 h-8 text-osrs-gold mx-auto animate-spin mb-3" />
            <p className="text-stoner-haze/50">Checking payment status...</p>
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500/30">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold">{error}</span>
            </div>
            <p className="text-stoner-haze/50 text-sm">
              Make sure you entered the correct invoice ID. If you paid manually, contact us on Discord with your order ID.
            </p>
          </div>
        )}

        {paymentData && currentStatus && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`card p-6 border-2 ${currentStatus.border} ${currentStatus.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <StatusIcon className={`w-8 h-8 ${currentStatus.color} ${paymentData.payment_status === 'confirming' ? 'animate-spin' : ''}`} />
                <div>
                  <h2 className={`font-medieval text-xl font-bold ${currentStatus.color}`}>{currentStatus.label}</h2>
                  <p className="text-stoner-haze/50 text-sm">Order: {paymentData.order_id || invoiceId}</p>
                </div>
              </div>

              {/* Payment details */}
              <div className="bg-osrs-darker rounded-lg p-4 border border-osrs-brownLight space-y-2">
                {paymentData.pay_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stoner-haze/50">Amount:</span>
                    <span className="text-stoner-haze font-bold">{paymentData.pay_amount} {paymentData.pay_currency}</span>
                  </div>
                )}
                {paymentData.price_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stoner-haze/50">USD Value:</span>
                    <span className="text-stoner-haze font-bold">${paymentData.price_amount}</span>
                  </div>
                )}
                {paymentData.pay_address && (
                  <div className="text-sm">
                    <span className="text-stoner-haze/50 block mb-1">Payment Address:</span>
                    <code className="block px-3 py-2 rounded bg-osrs-dark border border-osrs-brownLight text-stoner-haze/70 text-xs break-all">
                      {paymentData.pay_address}
                    </code>
                  </div>
                )}
                {paymentData.created_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stoner-haze/50">Created:</span>
                    <span className="text-stoner-haze/70">{new Date(paymentData.created_at * 1000).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Auto-refresh indicator */}
              {(paymentData.payment_status === 'waiting' || paymentData.payment_status === 'confirming') && (
                <p className="text-stoner-haze/40 text-xs mt-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Auto-refreshing every 10 seconds...
                </p>
              )}
            </div>

            {/* Discord CTA */}
            <div className="card p-6 text-center">
              <Leaf className="w-10 h-10 text-stoner-greenBright mx-auto mb-3" />
              <h3 className="font-medieval text-lg text-osrs-goldBright mb-2">Need help with your order?</h3>
              <p className="text-stoner-haze/60 text-sm mb-4">Join our Discord and mention your order ID for fast support.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {discordUrls.map((d, i) => (
                  <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                     className="btn-secondary flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> Server {i + 1}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {!paymentData && !loading && !error && (
          <div className="card p-12 text-center">
            <Search className="w-12 h-12 text-osrs-gold/30 mx-auto mb-4" />
            <p className="text-stoner-haze/40">Enter an invoice ID above to track your payment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
