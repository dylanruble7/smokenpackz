import crypto from 'crypto'

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
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
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET

    if (!ipnSecret || ipnSecret === 'YOUR_IPN_SECRET') {
      console.log('IPN secret not configured, accepting webhook without verification')
    } else {
      const signature = event.headers['x-nowpayments-sig'] || ''
      const body = event.body || ''

      const expectedSig = crypto
        .createHmac('sha512', ipnSecret)
        .update(body)
        .digest('hex')

      if (signature !== expectedSig) {
        console.error('Invalid IPN signature')
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid signature' }),
        }
      }
    }

    const payload = JSON.parse(event.body)

    console.log('NOWPayments IPN received:', JSON.stringify({
      payment_id: payload.payment_id,
      payment_status: payload.payment_status,
      order_id: payload.order_id,
      price_amount: payload.price_amount,
      pay_amount: payload.pay_amount,
      pay_currency: payload.pay_currency,
    }))

    const status = payload.payment_status

    if (status === 'finished' || status === 'confirmed') {
      console.log(`Payment CONFIRMED for order ${payload.order_id}`)
    } else if (status === 'failed' || status === 'expired') {
      console.log(`Payment FAILED for order ${payload.order_id}`)
    } else if (status === 'waiting' || status === 'confirming') {
      console.log(`Payment PENDING for order ${payload.order_id}`)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true, status }),
    }
  } catch (err) {
    console.error('Webhook error:', err.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', message: err.message }),
    }
  }
}
