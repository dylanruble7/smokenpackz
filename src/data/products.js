export const products = [
  // ===== OSRS ACCOUNTS =====
  {
    id: 'acc-001',
    category: 'accounts',
    name: 'Maxed Main - The Legend',
    price: 1800,
    image: '⚔️',
    tag: 'BEST SELLER',
    tagColor: 'osrs-goldBright',
    description: 'Fully maxed main, total 2277. All 99s. Quest cape. This account has seen things... mostly dragons and goblins, but still. Serious account for a serious player.',
    stats: {
      'Combat Level': '126',
      'Total Level': '2277',
      'Quest Points': '280',
      'GP Bank': '50M',
    },
    badges: ['No Recoveries', 'Original Owner', 'Hand-Trained', 'Quest Cape'],
    stock: 1,
  },
  {
    id: 'acc-002',
    category: 'accounts',
    name: '1 Def Pure - The Weed Whacker',
    price: 150,
    image: '🌿',
    tag: 'HOT',
    tagColor: 'stoner-greenBright',
    description: 'Clean 1 Defense pure with 99 Strength and 99 Ranged. Hits harder than your uncle after Thanksgiving dinner. Perfect for PKing and ruining someone\'s day. Build integrity intact — not a single def XP wasted.',
    stats: {
      'Combat Level': '55',
      'Attack': '60',
      'Strength': '99',
      'Defense': '1',
      'Ranged': '99',
      'HP': '99',
    },
    badges: ['No Recoveries', 'Hand-Trained', 'PK Ready', 'Clean Build'],
    stock: 2,
  },
  {
    id: 'acc-003',
    category: 'accounts',
    name: 'Skiller - The Chill Grinder',
    price: 120,
    image: '🎣',
    tag: '',
    tagColor: '',
    description: 'Maxed skiller, zero combat. For the player who just wants to fish and chill. Literally never killed anything. Total pacifist. Respect.',
    stats: {
      'Combat Level': '3',
      'Total Level': '1200',
      'Fishing': '99',
      'Woodcutting': '99',
      'Mining': '99',
      'Quest Points': '150',
    },
    badges: ['No Recoveries', 'Hand-Trained', '3 CB Forever'],
    stock: 1,
  },
  {
    id: 'acc-004',
    category: 'accounts',
    name: 'Mid-Level Ironman - The Solo Stoner',
    price: 80,
    image: '🛡️',
    tag: 'NEW',
    tagColor: 'stoner-purple',
    description: 'Ironman account, mid-level progress. No trading, no help, just vibes and self-reliance. Like growing your own if you catch my drift.',
    stats: {
      'Combat Level': '78',
      'Total Level': '900',
      'Quest Points': '120',
      'GP Bank': '5M',
    },
    badges: ['No Recoveries', 'Ironman', 'Hand-Trained'],
    stock: 1,
  },
  {
    id: 'acc-005',
    category: 'accounts',
    name: 'F2P Starter - The Beginner Pack',
    price: 15,
    image: '📦',
    tag: 'CHEAP',
    tagColor: 'stoner-greenBright',
    description: 'Solid F2P starter account. Some base stats, a little gold, and a dream. Perfect for someone who wants to start their journey without the early grind.',
    stats: {
      'Combat Level': '45',
      'Total Level': '400',
      'Quest Points': '30',
      'GP Bank': '500K',
    },
    badges: ['No Recoveries', 'F2P'],
    stock: 5,
  },

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
