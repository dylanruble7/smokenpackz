export const products = [
  // ===== GOLD =====
  {
    id: 'gold-custom',
    category: 'gold',
    name: 'OSRS Gold - Choose Your Amount',
    price: 0.27,
    image: '🪙',
    tag: 'CUSTOM',
    tagColor: 'osrs-goldBright',
    description: 'Buy exactly as much gold as you need. Priced per million GP. Bulk discounts kick in automatically — the more you buy, the cheaper it gets per mil.',
    stats: {
      'Price per 1M': '$0.27',
      'Delivery': 'Fast',
      'Minimum': '5M GP',
    },
    badges: ['Fast Delivery', 'Safe Trade', 'Bulk Pricing'],
    stock: 999,
    customQuantity: true,
  },

  // ===== BONDS =====
  {
    id: 'bond-custom',
    category: 'bonds',
    name: 'OSRS Bonds - Choose Your Amount',
    price: 4.25,
    image: '🎯',
    tag: 'CUSTOM',
    tagColor: 'stoner-greenBright',
    description: 'Choose exactly how many bonds you want. 14 days of membership per bond. Bulk pricing kicks in automatically — the more you buy, the cheaper each bond gets.',
    stats: {
      'Price per Bond': '$4.25',
      'Membership': '14 days each',
      'Delivery': 'Fast',
    },
    badges: ['Fast Delivery', 'Safe Trade', 'Tradeable', 'Bulk Pricing'],
    stock: 999,
    customQuantity: true,
  },
]

export const cryptoOptions = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', address: 'bc1q5f6p9rf9qjw0xhzlmyv9zc0qatvlt9cyw98ng6', color: '#f7931a' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', icon: 'Ł', address: 'YOUR_LTC_WALLET_ADDRESS', color: '#345d9d' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', address: 'YOUR_ETH_WALLET_ADDRESS', color: '#627eea' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '₮', address: 'YOUR_USDT_WALLET_ADDRESS', color: '#26a17b' },
]

export const paymentMethods = [
  { id: 'crypto', name: 'Crypto', description: 'Bitcoin, Litecoin, Ethereum, USDT', icon: '₿' },
  { id: 'cashapp', name: 'CashApp', description: 'Send USD via CashApp', icon: '$' },
  { id: 'osrsgp', name: 'OSRS GP', description: 'Pay with in-game gold', icon: '🪙' },
]

export const discordUrls = [
  { url: 'https://discord.gg/wSdpKwhws', label: 'Discord Server 1' },
  { url: 'https://discord.gg/KDjVwqp2k', label: 'Discord Server 2' },
]

export const discordUrl = discordUrls[0].url
export const discordUrl2 = discordUrls[1].url

export const discordWebhookUrl = 'https://discord.com/api/webhooks/1535862753808621588/uC2j5cFL_lrr5mvZEbXFJedaiZendJTNcdMAleKAFHtN-rpMmSJ1MX5ZLtYWtd0sgme7'
