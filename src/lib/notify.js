import { discordWebhookUrl } from '../data/products.js'

export async function sendOrderNotification({ orderId, paymentMethod, cartTotal, items, rsn, email, user }) {
  if (!discordWebhookUrl || discordWebhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
    console.warn('Discord webhook URL not configured — skipping notification')
    return
  }

  const methodLabels = {
    crypto: '₿ Crypto',
    cashapp: '$ CashApp',
    card: '💳 Credit/Debit Card',
    osrsgp: '🪙 OSRS GP',
  }

  const itemsText = items.map(item =>
    `• ${item.image} ${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n')

  const fields = [
    { name: '🛒 Items', value: itemsText || 'N/A', inline: false },
    { name: '💰 Total', value: `$${cartTotal}`, inline: true },
    { name: '💳 Payment', value: methodLabels[paymentMethod] || paymentMethod, inline: true },
  ]

  if (rsn) fields.push({ name: '🎮 RSN', value: rsn, inline: true })
  if (email) fields.push({ name: '📧 Email', value: email, inline: true })
  if (paymentMethod === 'osrsgp') {
    fields.push({ name: '💬 Chat', value: `[Join Chat](https://smokenpackz.com/chat/${orderId})`, inline: false })
  }

  const payload = {
    username: 'SmokenPackz Orders',
    avatar_url: 'https://smokenpackz.com/logo.png',
    content: `🔔 <@1227988354306412574> **NEW ORDER** — ${methodLabels[paymentMethod] || paymentMethod}`,
    embeds: [{
      title: `Order ${orderId}`,
      color: 0xc9a227,
      fields,
      footer: { text: 'SmokenPackz Order System' },
      timestamp: new Date().toISOString(),
    }],
  }

  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error('Failed to send Discord notification:', e)
  }
}
