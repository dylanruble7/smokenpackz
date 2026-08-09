import fetch from 'node-fetch'

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const apiKey = process.env.NOWPAYMENTS_API_KEY
    if (!apiKey || apiKey === 'YOUR_NOWPAYMENTS_API_KEY') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'NOWPayments API key not configured. Set NOWPAYMENTS_API_KEY in Netlify environment variables.' }),
      }
    }

    const body = JSON.parse(event.body)
    const { amount, order_id, order_description, customer_email } = body

    if (!amount || !order_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: amount, order_id' }),
      }
    }

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: parseFloat(amount),
        price_currency: 'usd',
        order_id,
        order_description: order_description || `SmokenPackz Order ${order_id}`,
        ipn_callback_url: `${process.env.URL || 'https://smokenpackz.com'}/.netlify/functions/webhook`,
        success_url: `${process.env.URL || 'https://smokenpackz.com'}/#/order/${order_id}`,
        cancel_url: `${process.env.URL || 'https://smokenpackz.com'}/#/checkout`,
        ...(customer_email ? { customer_email } : {}),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.message || 'Failed to create invoice', details: data }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: err.message }),
    }
  }
}
