import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const FALLBACK_PRICES = [
  { competitor: 'Eldorado', price_per_mil: 0.27, url: 'https://eldorado.gg' },
  { competitor: 'ChicksGold', price_per_mil: 0.28, url: 'https://chicksgold.com' },
  { competitor: 'PieGP', price_per_mil: 0.26, url: 'https://piegp.com' },
  { competitor: 'SmokenPackz', price_per_mil: 0.25, url: 'https://smokenpackz.com', is_us: true },
]

export function useGpPrices() {
  const [prices, setPrices] = useState(FALLBACK_PRICES)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data, error } = await supabase
          .from('gp_prices')
          .select('*')
          .order('price_per_mil', { ascending: true })

        if (!error && data && data.length > 0) {
          setPrices(data)
          setUpdatedAt(new Date())
        }
      } catch (e) {
        console.log('Using fallback GP prices')
      } finally {
        setLoading(false)
      }
    }
    fetchPrices()
  }, [])

  const ourPrice = prices.find(p => p.is_us)?.price_per_mil || 0.25
  const avgPrice = prices.reduce((sum, p) => sum + p.price_per_mil, 0) / prices.length
  const lowestCompetitor = prices.filter(p => !p.is_us).sort((a, b) => a.price_per_mil - b.price_per_mil)[0]

  return { prices, loading, updatedAt, ourPrice, avgPrice, lowestCompetitor }
}
