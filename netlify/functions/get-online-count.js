const GUILD_ID = '1127840971053350922'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/preview`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
      }
    })

    if (!response.ok) {
      const fallback = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`)
      if (fallback.ok) {
        const data = await fallback.json()
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ online: data.presence_count || 0 })
        }
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ online: 0 })
      }
    }

    const data = await response.json()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ online: data.approximate_presence_count || 0 })
    }
  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ online: 0 })
    }
  }
}
