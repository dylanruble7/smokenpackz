import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, MessageCircle, Clock, Leaf, Check, Lock, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { discordUrls } from '../data/products.js'

export default function Chat() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [roomStatus, setRoomStatus] = useState('waiting')
  const [buyerRsn, setBuyerRsn] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [waitingTime, setWaitingTime] = useState(0)
  const [connected, setConnected] = useState(false)
  const [authState, setAuthState] = useState('checking')
  const [isStaff, setIsStaff] = useState(false)
  const [staffName, setStaffName] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check access permissions
  useEffect(() => {
    async function checkAccess() {
      // Check if this is the buyer's order via localStorage (works for guests)
      const myOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
      const isMyOrder = myOrders.includes(orderId)

      if (!user) {
        // Guest user — allow if they have this orderId in localStorage
        if (isMyOrder) {
          setAuthState('allowed')
        } else {
          setAuthState('login')
        }
        return
      }

      try {
        // Check if user is staff
        const { data: staffRecord } = await supabase
          .from('staff_users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (staffRecord) {
          setIsStaff(true)
          setStaffName(staffRecord.display_name || staffRecord.role)
          setAuthState('allowed')
          return
        }

        // Signed in — check if this is their order
        const { data: room } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (room && room.buyer_email === user.email) {
          setAuthState('allowed')
          return
        }

        // Also check localStorage (in case they placed order as guest then signed in)
        if (isMyOrder) {
          setAuthState('allowed')
          return
        }

        if (!room) {
          setAuthState('allowed')
          return
        }

        setAuthState('denied')
      } catch (e) {
        if (isMyOrder) {
          setAuthState('allowed')
        } else {
          setAuthState('allowed')
        }
      }
    }

    checkAccess()
  }, [orderId, user])

  // Setup chat only if allowed
  useEffect(() => {
    if (authState !== 'allowed') return

    async function setupChat() {
      try {
        const { data: existingRoom } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (existingRoom) {
          setRoomStatus(existingRoom.status)
          setBuyerRsn(existingRoom.buyer_rsn || '')
          setBuyerEmail(existingRoom.buyer_email || '')

          if (isStaff && existingRoom.status === 'waiting') {
            await supabase
              .from('chat_rooms')
              .update({ status: 'active' })
              .eq('order_id', orderId)
          }
        } else if (!isStaff) {
          await supabase
            .from('chat_rooms')
            .insert({
              order_id: orderId,
              buyer_email: user?.email || null,
              buyer_rsn: null,
              status: 'waiting',
            })
        }

        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true })

        if (existingMessages) {
          setMessages(existingMessages)
        }

        setConnected(true)

        const messageSubscription = supabase
          .channel(`chat:${orderId}`)
          .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `order_id=eq.${orderId}` },
            (payload) => {
              setMessages(prev => [...prev, payload.new])
            }
          )
          .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'chat_rooms', filter: `order_id=eq.${orderId}` },
            (payload) => {
              setRoomStatus(payload.new.status)
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(messageSubscription)
        }
      } catch (e) {
        console.error('Chat setup error:', e)
      }
    }

    setupChat()
  }, [authState, orderId, user, isStaff])

  useEffect(() => {
    if (roomStatus !== 'active' && !isStaff) {
      const interval = setInterval(() => {
        setWaitingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [roomStatus, isStaff])

  const formatWaitTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const messageText = input.trim()
    setInput('')

    try {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          order_id: orderId,
          sender: isStaff ? 'mod' : 'buyer',
          message: messageText,
        })

      if (msgError) {
        console.error('Error sending message:', msgError)
        setInput(messageText)
      }
    } catch (e) {
      console.error('Send error:', e)
      setInput(messageText)
    }
  }

  const handleCloseOrder = async () => {
    await supabase
      .from('chat_rooms')
      .update({ status: 'closed' })
      .eq('order_id', orderId)
  }

  const showDiscordFallback = waitingTime > 120

  if (authState === 'denied') {
    return (
      <div className="smoke-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="card p-8">
            <Lock className="w-12 h-12 text-red-400/60 mx-auto mb-4" />
            <h1 className="font-medieval text-xl text-red-400 mb-2">Access Denied</h1>
            <p className="text-stoner-haze/50 text-sm mb-6">
              You don't have permission to view this chat. Only the order owner and authorized staff can access this page.
            </p>
            <Link to="/shop" className="btn-primary inline-block">Back to Shop</Link>
          </div>
        </div>
      </div>
    )
  }

  if (authState === 'login') {
    return (
      <div className="smoke-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="card p-8">
            <Lock className="w-12 h-12 text-osrs-gold/40 mx-auto mb-4" />
            <h1 className="font-medieval text-xl text-osrs-goldBright mb-2">Sign In Required</h1>
            <p className="text-stoner-haze/50 text-sm mb-6">
              You need to be signed in to access the order chat.
            </p>
            <Link to="/auth" className="btn-primary inline-block">Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  if (authState === 'checking') {
    return (
      <div className="smoke-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="card p-8">
            <Loader className="w-8 h-8 text-osrs-gold mx-auto mb-4 animate-spin" />
            <p className="text-stoner-haze/50 text-sm">Verifying access...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/shop" className="nav-link inline-flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Header */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medieval text-xl text-osrs-goldBright flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Order Chat
              </h1>
              <p className="text-stoner-haze/50 text-sm mt-1">
                Order ID: <span className="text-osrs-gold font-bold">{orderId}</span>
                {isStaff && buyerEmail && (
                  <span className="ml-2 text-stoner-haze/30">| Buyer: {buyerEmail}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {roomStatus === 'waiting' && (
                <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold">
                  <Clock className="w-4 h-4 animate-pulse" />
                  Waiting for staff
                </span>
              )}
              {roomStatus === 'active' && (
                <span className="flex items-center gap-1.5 text-stoner-greenBright text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-stoner-greenBright animate-pulse" />
                  Staff online
                </span>
              )}
              {roomStatus === 'closed' && (
                <span className="flex items-center gap-1.5 text-stoner-haze/50 text-sm font-bold">
                  <Check className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>
          </div>
          {isStaff && (
            <div className="mt-3 pt-3 border-t border-osrs-brownLight/50 flex items-center justify-between">
              <span className="text-stoner-greenBright text-xs font-bold">
                Staff Mode — {staffName}
              </span>
              {roomStatus !== 'closed' && (
                <button onClick={handleCloseOrder} className="text-stoner-haze/40 hover:text-red-400 text-xs transition-colors">
                  Close Order
                </button>
              )}
            </div>
          )}
        </div>

        {/* Waiting banner (buyers only) */}
        {roomStatus === 'waiting' && !isStaff && (
          <div className={`card p-4 mb-4 ${showDiscordFallback ? 'border-yellow-500/40' : 'border-osrs-brownLight'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-osrs-gold/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-osrs-gold animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-stoner-haze text-sm">
                  <strong className="text-osrs-goldBright">Waiting for staff to join...</strong>
                </p>
                <p className="text-stoner-haze/50 text-xs mt-0.5">
                  Wait time: <span className="font-bold text-stoner-haze">{formatWaitTime(waitingTime)}</span>
                  {' — '}We're notifying our team. Hang tight!
                </p>
              </div>
            </div>
            {showDiscordFallback && (
              <div className="mt-3 pt-3 border-t border-osrs-brownLight/50">
                <p className="text-stoner-haze/60 text-xs mb-2">
                  Taking a while? Join our Discord and create a ticket — we'll be right with you!
                </p>
                <div className="flex gap-2 flex-wrap">
                  {discordUrls.map((d, i) => (
                    <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                       className="btn-secondary inline-flex items-center gap-1.5 text-xs py-1.5 px-3">
                      <MessageCircle className="w-3.5 h-3.5 text-[#5865F2]" />
                      Discord Server {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Staff joined info */}
        {roomStatus === 'waiting' && isStaff && (
          <div className="card p-4 mb-4 border-stoner-green/30">
            <p className="text-stoner-greenBright text-sm">
              You've joined the chat. The buyer can see you're online. Say hello to start!
            </p>
          </div>
        )}

        {/* Chat messages */}
        <div className="card p-0 overflow-hidden">
          <div className="bg-osrs-darker px-4 py-2 border-b border-osrs-brownLight">
            <p className="text-stoner-haze/40 text-xs flex items-center gap-1">
              <Leaf className="w-3 h-3" /> SmokenPackz Live Chat — be respectful, stay chill
            </p>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-osrs-dark/30">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-10 h-10 text-osrs-brownLight/50 mx-auto mb-3" />
                <p className="text-stoner-haze/40 text-sm">
                  No messages yet. {isStaff ? 'Say hi to the buyer!' : 'Say hi to get started!'}
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isMyMessage = isStaff ? msg.sender === 'mod' : msg.sender === 'buyer'
              return (
                <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isMyMessage
                      ? 'bg-osrs-gold/20 border border-osrs-gold/30'
                      : 'bg-stoner-greenDeep/20 border border-stoner-green/30'
                  }`}>
                    <p className={`text-xs font-bold mb-0.5 ${
                      isMyMessage ? 'text-osrs-goldBright' : 'text-stoner-greenBright'
                    }`}>
                      {msg.sender === 'buyer' ? (isStaff ? 'Buyer' : 'You') : (isStaff ? 'You' : 'SmokenPackz Staff')}
                    </p>
                    <p className="text-stoner-haze text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    <p className="text-stoner-haze/30 text-xs mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {roomStatus !== 'closed' ? (
            <form onSubmit={handleSend} className="border-t border-osrs-brownLight p-3 flex gap-2 bg-osrs-darker">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-osrs-dark border border-osrs-brownLight text-stoner-haze focus:border-osrs-gold focus:outline-none transition-colors text-sm"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          ) : (
            <div className="border-t border-osrs-brownLight p-4 bg-osrs-darker text-center">
              <Check className="w-5 h-5 text-stoner-greenBright mx-auto mb-1" />
              <p className="text-stoner-haze/50 text-sm">This order has been completed.</p>
            </div>
          )}
        </div>

        {buyerRsn && (
          <div className="card p-3 mt-4">
            <p className="text-stoner-haze/50 text-xs text-center">
              RSN: <span className="text-osrs-goldBright font-bold">{buyerRsn}</span>
              {' — '}Order ID: <span className="text-osrs-gold font-bold">{orderId}</span>
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-stoner-haze/30 text-xs flex items-center justify-center gap-1">
            {connected ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-stoner-greenBright inline-block" /> Connected</>
            ) : (
              <><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block animate-pulse" /> Connecting...</>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
