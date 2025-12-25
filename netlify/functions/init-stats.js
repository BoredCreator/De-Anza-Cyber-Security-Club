const TRACKING_CHANNEL_ID = '1127840971053350925'

export async function handler(event) {
  // Only allow GET for easy browser access, or POST
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!botToken) {
    return { statusCode: 500, body: 'Bot token not configured' }
  }

  try {
    const now = new Date().toISOString().split('T')[0]
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'short',
      timeStyle: 'short'
    })

    const statsContent = `📊 **DACC Website Stats**
━━━━━━━━━━━━━━━━━━━━━━━━
📅 **Today:** 0 visitors
📈 **Total:** 0 visitors
🗓️ **Last Reset:** ${now}
⏰ **Last Updated:** ${timestamp} PST`

    // Create the stats message
    const response = await fetch(`https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: statsContent })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Discord API error: ${error}`)
    }

    const message = await response.json()

    // Try to pin the message
    await fetch(`https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/pins/${message.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bot ${botToken}` }
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        messageId: message.id,
        instructions: `Add this to your .env file: DISCORD_STATS_MESSAGE_ID=${message.id}`
      })
    }
  } catch (error) {
    console.error('Init stats error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to initialize stats', details: error.message })
    }
  }
}
