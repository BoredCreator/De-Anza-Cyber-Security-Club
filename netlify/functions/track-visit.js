const TRACKING_CHANNEL_ID = '1127840971053350925'

// In-memory store for today's unique IPs (resets on function cold start)
// For production, consider using a database or Redis
let todayIPs = new Set()
let lastResetDate = new Date().toISOString().split('T')[0]

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const botToken = process.env.DISCORD_BOT_TOKEN
  if (!botToken) {
    return { statusCode: 500, body: 'Bot token not configured' }
  }

  try {
    const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               event.headers['client-ip'] ||
               'unknown'

    const today = new Date().toISOString().split('T')[0]

    // Reset daily counter if it's a new day
    if (lastResetDate !== today) {
      todayIPs = new Set()
      lastResetDate = today
    }

    // Check if this is a unique visitor for today
    const isNewVisitor = !todayIPs.has(ip)

    if (isNewVisitor && ip !== 'unknown') {
      todayIPs.add(ip)
      await updateStats(botToken, today)
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, unique: isNewVisitor })
    }
  } catch (error) {
    console.error('Track visit error:', error)
    return { statusCode: 500, body: 'Failed to track visit' }
  }
}

async function updateStats(botToken, today) {
  const statsMessageId = process.env.DISCORD_STATS_MESSAGE_ID

  if (!statsMessageId) {
    return
  }

  try {
    const getResponse = await fetch(
      `https://discord.com/api/v10/channels/${TRACKING_CHANNEL_ID}/messages/${statsMessageId}`,
      {
        headers: { 'Authorization': `Bot ${botToken}` }
      }
    )

    if (!getResponse.ok) {
      console.error('Failed to fetch stats:', await getResponse.text())
      return
    }

    const message = await getResponse.json()
    const content = message.content

    const todayMatch = content.match(/Today:\*\* (\d+)/)
    const totalMatch = content.match(/Total:\*\* (\d+)/)
    const lastResetMatch = content.match(/Last Reset:\*\* (\d{4}-\d{2}-\d{2})/)

    let todayCount = todayMatch ? parseInt(todayMatch[1]) : 0
    let totalCount = totalMatch ? parseInt(totalMatch[1]) : 0
    const lastReset = lastResetMatch ? lastResetMatch[1] : null

    // Reset daily count if it's a new day
    if (lastReset !== today) {
      todayCount = 0
    }

    todayCount++
    totalCount++

    const updatedContent = buildStatsMessage(todayCount, totalCount, today)

    await fetch(
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
  } catch (error) {
    console.error('Failed to update stats:', error)
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
**Today:** ${today} unique visitors
**Total:** ${total} unique visitors
**Last Reset:** ${resetDate}
**Last Updated:** ${now} PST`
}
