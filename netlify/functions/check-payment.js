import fetch from 'node-fetch'

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
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
        body: JSON.stringify({ error: 'NOWPayments API key not configured' }),
      }
    }

    const invoiceId = event.queryStringParameters?.invoiceId
    const paymentId = event.queryStringParameters?.paymentId

    if (!invoiceId && !paymentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing invoiceId or paymentId parameter' }),
      }
    }

    let url, response, data

    if (invoiceId) {
      url = `https://api.nowpayments.io/v1/invoice/${invoiceId}`
      response = await fetch(url, {
        headers: { 'x-api-key': apiKey },
      })
      data = await response.json()
    } else {
      url = `https://api.nowpayments.io/v1/payment/${paymentId}`
      response = await fetch(url, {
        headers: { 'x-api-key': apiKey },
      })
      data = await response.json()
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.message || 'Failed to check payment' }),
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
