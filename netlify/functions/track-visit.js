const TRACKING_CHANNEL_ID = '1127840971053350925'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!botToken) {
    return { statusCode: 500, body: 'Bot token not configured' }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { type, visitorData } = body

    const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               event.headers['client-ip'] ||
               'unknown'

    if (type === 'page_view') {
      await updateStats(botToken)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      }
    }

    if (type === 'chat_opened') {
      const embed = buildVisitorEmbed(ip, visitorData)
      await sendEmbed(botToken, embed)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      }
    }

    return { statusCode: 400, body: 'Invalid type' }
  } catch (error) {
    console.error('Track visit error:', error)
    return { statusCode: 500, body: 'Failed to track visit' }
  }
}

function buildVisitorEmbed(ip, data = {}) {
  const timestamp = new Date().toISOString()

  const fields = [
    { name: 'IP Address', value: ip || 'Unknown', inline: true },
    { name: 'Timezone', value: data.timezone || 'Unknown', inline: true },
    { name: 'Language', value: data.language || 'Unknown', inline: true },
    { name: 'Screen', value: data.screen || 'Unknown', inline: true },
    { name: 'Platform', value: data.platform || 'Unknown', inline: true },
    { name: 'Referrer', value: data.referrer || 'Direct', inline: true },
  ]

  if (data.userAgent) {
    const browser = parseUserAgent(data.userAgent)
    fields.push({ name: 'Browser', value: browser, inline: false })
  }

  return {
    title: 'New Chat Session Started',
    color: 0x10b981,
    fields,
    timestamp,
    footer: { text: 'DACC Website Tracker' }
  }
}

function parseUserAgent(ua) {
  if (!ua) return 'Unknown'

  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'

  return ua.length > 100 ? ua.substring(0, 100) + '...' : ua
}

async function sendEmbed(botToken, embed) {
  const response = await fetch(`https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ embeds: [embed] })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Discord API error: ${error}`)
  }
}

async function updateStats(botToken) {
  const statsMessageId = process.env.DISCORD_STATS_MESSAGE_ID

  if (!statsMessageId) {
    return
  }

  const getResponse = await fetch(
    `https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/messages/${statsMessageId}`,
    {
      headers: { 'Authorization': `Bot ${botToken}` }
    }
  )

  if (!getResponse.ok) {
    const errorText = await getResponse.text()
    throw new Error(`Failed to fetch stats: ${errorText}`)
  }

  const message = await getResponse.json()
  const content = message.content

  const todayMatch = content.match(/Today:\*\* (\d+)/)
  const totalMatch = content.match(/Total:\*\* (\d+)/)
  const lastResetMatch = content.match(/Last Reset:\*\* (\d{4}-\d{2}-\d{2})/)

  let todayCount = todayMatch ? parseInt(todayMatch[1]) : 0
  let totalCount = totalMatch ? parseInt(totalMatch[1]) : 0
  const lastReset = lastResetMatch ? lastResetMatch[1] : null

  const today = new Date().toISOString().split('T')[0]

  if (lastReset !== today) {
    todayCount = 0
  }

  todayCount++
  totalCount++

  const updatedContent = buildStatsMessage(todayCount, totalCount, today)

  const editResponse = await fetch(
    `https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/messages/${statsMessageId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: updatedContent })
    }
  )

  if (!editResponse.ok) {
    const errorText = await editResponse.text()
    throw new Error(`Failed to edit stats: ${errorText}`)
  }
}

function buildStatsMessage(today, total, resetDate) {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'short',
    timeStyle: 'short'
  })

  return `**DACC Website Stats**
---
**Today:** ${today} visitors
**Total:** ${total} visitors
**Last Reset:** ${resetDate}
**Last Updated:** ${now} PST`
}
