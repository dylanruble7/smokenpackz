import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, MessageCircle, Clock, Leaf, AlertCircle, Check } from 'lucide-react'
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
  const [waitingTime, setWaitingTime] = useState(0)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create or join chat room, then subscribe to messages
  useEffect(() => {
    async function setupChat() {
      try {
        // Check if room exists
        const { data: existingRoom } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (existingRoom) {
          setRoomStatus(existingRoom.status)
          setBuyerRsn(existingRoom.buyer_rsn || '')
        } else {
          // Create room
          const { error: insertError } = await supabase
            .from('chat_rooms')
            .insert({
              order_id: orderId,
              buyer_email: user?.email || null,
              buyer_rsn: null,
              status: 'waiting',
            })

          if (insertError) {
            console.error('Error creating chat room:', insertError)
            setError('Could not create chat room. Please join our Discord instead.')
            return
          }
        }

        // Load existing messages
        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true })

        if (existingMessages) {
          setMessages(existingMessages)
        }

        setConnected(true)

        // Subscribe to new messages in real-time
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
        setError('Connection failed. Please join our Discord for assistance.')
      }
    }

    setupChat()
  }, [orderId, user])

  // Waiting timer
  useEffect(() => {
    if (roomStatus !== 'active') {
      const interval = setInterval(() => {
        setWaitingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [roomStatus])

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
          sender: 'buyer',
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

  const showDiscordFallback = waitingTime > 120 // 2 minutes

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
              </p>
            </div>
            {/* Status indicator */}
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
        </div>

        {error && (
          <div className="card p-4 mb-4 border-red-500/30">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Waiting banner */}
        {roomStatus === 'waiting' && (
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
                  {' — '}We're notifying our team. Hang tight! 🌿
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
                  No messages yet. Say hi to get started! 👋
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  msg.sender === 'buyer'
                    ? 'bg-osrs-gold/20 border border-osrs-gold/30'
                    : 'bg-stoner-greenDeep/20 border border-stoner-green/30'
                }`}>
                  <p className={`text-xs font-bold mb-0.5 ${
                    msg.sender === 'buyer' ? 'text-osrs-goldBright' : 'text-stoner-greenBright'
                  }`}>
                    {msg.sender === 'buyer' ? 'You' : 'SmokenPackz Staff'}
                  </p>
                  <p className="text-stoner-haze text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className="text-stoner-haze/30 text-xs mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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
        </div>

        {/* Order info reminder */}
        {buyerRsn && (
          <div className="card p-3 mt-4">
            <p className="text-stoner-haze/50 text-xs text-center">
              Your RSN: <span className="text-osrs-goldBright font-bold">{buyerRsn}</span>
              {' — '}Order ID: <span className="text-osrs-gold font-bold">{orderId}</span>
            </p>
          </div>
        )}

        {/* Connection status */}
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
