
import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, AlertTriangle } from 'lucide-react'
import StatCard from './StatCard'
import ChartCard from './ChartCard'
import TransactionHistory from './TransactionHistory'
import TagModal from './TagModal'
import { useWalletData } from '../hooks/useWalletData'

/**
 * Dashboard Component
 * Main analysis dashboard displaying wallet metrics and insights
 * @param {string} address - Wallet address to analyze
 * @param {Function} onAddToWatchlist - Handler to add address to watchlist
 * @param {boolean} isInWatchlist - Whether address is already in watchlist
 */
function Dashboard({ address, onAddToWatchlist, isInWatchlist }) {
  const [showTagModal, setShowTagModal] = useState(false)
  const [label, setLabel] = useState('')

  // Fetch wallet data using custom hook
  const { data, loading, error, refetch } = useWalletData(address)

  /**
   * Handle adding to watchlist with optional label
   */
  const handleAddToWatchlist = () => {
    if (label.trim()) {
      onAddToWatchlist(address, label.trim())
      setLabel('')
    } else {
      onAddToWatchlist(address)
    }
  }

  /**
   * Calculate risk score based on wallet activity
   * @returns {Object} Risk assessment with score and level
   */
  const calculateRiskScore = () => {
    if (!data) return { score: 0, level: 'unknown', color: 'slate' }

    const { stats } = data
    let riskScore = 0

    // Factor 1: Very low transaction count (possible new/inactive wallet)
    if (stats.totalTransactions < 5) riskScore += 20
    
    // Factor 2: High value transactions relative to history
    if (stats.avgTransactionValue > stats.totalVolume * 0.3) riskScore += 15

    // Factor 3: Suspicious pattern detection (placeholder for future ML)
    if (stats.suspiciousActivityCount > 0) riskScore += 30

    // Factor 4: Recent activity surge
    if (stats.recentActivitySpike) riskScore += 10

    // Determine risk level
    if (riskScore < 20) return { score: riskScore, level: 'Low Risk', color: 'success' }
    if (riskScore < 40) return { score: riskScore, level: 'Medium Risk', color: 'warning' }
    return { score: riskScore, level: 'High Risk', color: 'danger' }
  }

  const risk = calculateRiskScore()

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="ml-4 text-slate-600">Analyzing wallet address...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="card bg-danger-50 border border-danger-200">
        <div className="flex items-center gap-3 text-danger-700">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm font-medium hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="card text-center py-8">
        <p className="text-slate-500">No data available for this address</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Address Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-slate-800">Wallet Analysis</h2>
              <span className={`badge badge-${risk.color}`}>
                {risk.level}
              </span>
            </div>
            <p className="font-mono text-sm text-slate-600 break-all">
              {address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`https://voyager.online/contract/${address}`, '_blank')}
              className="btn-secondary flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Voyager
            </button>
            
            {!isInWatchlist ? (
              <button
                onClick={() => setShowTagModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Add to Watchlist
              </button>
            ) : (
              <button
                disabled
                className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
              >
                <BookmarkCheck className="w-4 h-4" />
                In Watchlist
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={data.stats.totalTransactions}
          trend={data.stats.transactionTrend}
          icon="activity"
        />
        <StatCard
          title="Total Volume"
          value={`${data.stats.totalVolume.toFixed(2)} ETH`}
          trend={data.stats.volumeTrend}
          icon="coins"
        />
        <StatCard
          title="Unique Tokens"
          value={data.stats.uniqueTokens}
          icon="layers"
        />
        <StatCard
          title="Last Activity"
          value={data.stats.lastActivity}
          icon="clock"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Transaction Timeline"
          type="line"
          data={data.charts.transactionTimeline}
        />
        <ChartCard
          title="Token Distribution"
          type="doughnut"
          data={data.charts.tokenDistribution}
        />
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={data.transactions} />

      {/* Tag Modal */}
      {showTagModal && (
        <TagModal
          onClose={() => setShowTagModal(false)}
          onSave={handleAddToWatchlist}
          label={label}
          setLabel={setLabel}
        />
      )}
    </div>
  )
}

export default Dashboard