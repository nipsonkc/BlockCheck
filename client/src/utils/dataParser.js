import { formatDistance } from 'date-fns'

/**
 * Data parsing and transformation utilities
 * Converts raw blockchain data into structured format for UI display
 */

/**
 * Parse raw wallet data into structured format
 * @param {Object} rawData - Raw data from API
 * @returns {Object} Parsed and structured data
 */
export function parseWalletData(rawData) {
  if (!rawData || !rawData.transactions) {
    return null
  }

  const { address, transactions, balance } = rawData

  // Calculate statistics
  const stats = calculateStatistics(transactions)

  // Prepare chart data
  const charts = {
    transactionTimeline: prepareTimelineData(transactions),
    tokenDistribution: prepareTokenDistribution(transactions),
  }

  return {
    address,
    balance,
    stats,
    charts,
    transactions: transactions.slice(0, 20), // Limit to 20 most recent
  }
}

/**
 * Calculate wallet statistics from transactions
 * @param {Array} transactions - Transaction array
 * @returns {Object} Calculated statistics
 */
function calculateStatistics(transactions) {
  const now = Date.now() / 1000
  const oneDay = 24 * 60 * 60
  const oneWeek = 7 * oneDay
  const oneMonth = 30 * oneDay

  // Total transactions
  const totalTransactions = transactions.length

  // Calculate total volume
  const totalVolume = transactions.reduce((sum, tx) => {
    return sum + parseFloat(tx.amount || 0)
  }, 0)

  // Average transaction value
  const avgTransactionValue = totalTransactions > 0 ? totalVolume / totalTransactions : 0

  // Count unique tokens
  const tokens = new Set()
  transactions.forEach(tx => {
    if (tx.token) tokens.add(tx.token)
  })
  const uniqueTokens = tokens.size || 3 // Default to 3 for mock data

  // Last activity
  const lastActivity = transactions.length > 0
    ? formatDistance(new Date(transactions[0].timestamp * 1000), new Date(), { addSuffix: true })
    : 'No activity'

  // Recent activity analysis
  const recentTxns = transactions.filter(tx => tx.timestamp > now - oneWeek)
  const olderTxns = transactions.filter(tx => 
    tx.timestamp <= now - oneWeek && tx.timestamp > now - oneMonth
  )

  // Transaction trend (comparing last week to previous week)
  const transactionTrend = olderTxns.length > 0
    ? Math.round(((recentTxns.length - olderTxns.length) / olderTxns.length) * 100)
    : 0

  // Volume trend
  const recentVolume = recentTxns.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0)
  const olderVolume = olderTxns.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0)
  const volumeTrend = olderVolume > 0
    ? Math.round(((recentVolume - olderVolume) / olderVolume) * 100)
    : 0

  // Suspicious activity detection (placeholder)
  const suspiciousActivityCount = 0
  const recentActivitySpike = recentTxns.length > (totalTransactions / 4)

  return {
    totalTransactions,
    totalVolume: parseFloat(totalVolume.toFixed(4)),
    avgTransactionValue: parseFloat(avgTransactionValue.toFixed(4)),
    uniqueTokens,
    lastActivity,
    transactionTrend,
    volumeTrend,
    suspiciousActivityCount,
    recentActivitySpike,
  }
}

/**
 * Prepare transaction timeline chart data
 * @param {Array} transactions - Transaction array
 * @returns {Object} Chart.js compatible data
 */
function prepareTimelineData(transactions) {
  // Group transactions by day
  const dailyData = {}
  
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp * 1000)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { count: 0, volume: 0 }
    }
    
    dailyData[dateKey].count += 1
    dailyData[dateKey].volume += parseFloat(tx.amount || 0)
  })

  // Sort dates and take last 30 days
  const sortedDates = Object.keys(dailyData).sort().slice(-30)
  
  // Prepare chart data
  const labels = sortedDates.map(date => {
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  
  const counts = sortedDates.map(date => dailyData[date].count)
  const volumes = sortedDates.map(date => dailyData[date].volume.toFixed(2))

  return {
    labels,
    datasets: [
      {
        label: 'Transaction Count',
        data: counts,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
}

/**
 * Prepare token distribution chart data
 * @param {Array} transactions - Transaction array
 * @returns {Object} Chart.js compatible data
 */
function prepareTokenDistribution(transactions) {
  // For mock data, create a simple distribution
  const tokens = {
    'ETH': 0,
    'USDC': 0,
    'DAI': 0,
    'Other': 0,
  }

  // Count token usage (in real implementation, would parse actual token data)
  transactions.forEach(tx => {
    const token = tx.token || 'ETH'
    if (tokens[token] !== undefined) {
      tokens[token] += 1
    } else {
      tokens['Other'] += 1
    }
  })

  return {
    labels: Object.keys(tokens),
    datasets: [
      {
        label: 'Token Usage',
        data: Object.values(tokens),
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(148, 163, 184, 0.8)',
        ],
        borderColor: [
          'rgb(14, 165, 233)',
          'rgb(34, 197, 94)',
          'rgb(245, 158, 11)',
          'rgb(148, 163, 184)',
        ],
        borderWidth: 2,
      },
    ],
  }
}

/**
 * Format large numbers with K/M/B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatLargeNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format ETH amount with proper decimals
 * @param {string|number} amount - Amount in ETH
 * @returns {string} Formatted amount
 */
export function formatEthAmount(amount) {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  if (num < 0.0001) return num.toExponential(2)
  if (num < 1) return num.toFixed(6)
  return num.toFixed(4)
}