export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const botToken = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_CHANNEL_ID

  if (!botToken || !channelId) {
    return { statusCode: 500, body: 'Bot not configured' }
  }

  // Get the 'after' timestamp from query params
  const params = new URLSearchParams(event.rawQuery || '')
  const afterTimestamp = params.get('after')

  if (!afterTimestamp) {
    return { statusCode: 400, body: 'Missing after timestamp' }
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Discord API error')
    }

    const messages = await response.json()
    const afterMs = parseInt(afterTimestamp, 10)

    // Filter to only messages after the provided timestamp
    const formatted = messages
      .filter((msg) => new Date(msg.timestamp).getTime() > afterMs)
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        author: msg.author.username,
        isBot: msg.author.bot || false,
        isWebhook: msg.webhook_id != null,
        timestamp: msg.timestamp
      }))
      .reverse()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(formatted)
    }
  } catch (error) {
    return { statusCode: 500, body: 'Failed to fetch messages' }
  }
}
