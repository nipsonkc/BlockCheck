
import { useState } from 'react'
import { ExternalLink, ArrowUpRight, ArrowDownLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistance } from 'date-fns'

/**
 * TransactionHistory Component
 * Displays a list of wallet transactions with expand/collapse functionality
 * @param {Array} transactions - Array of transaction objects
 */
function TransactionHistory({ transactions = [] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)

  /**
   * Format timestamp to relative time
   * @param {number} timestamp - Unix timestamp
   */
  const formatTime = (timestamp) => {
    try {
      return formatDistance(new Date(timestamp * 1000), new Date(), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  /**
   * Format transaction hash for display
   * @param {string} hash - Transaction hash
   */
  const formatHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  /**
   * Determine transaction type (incoming/outgoing)
   * @param {Object} tx - Transaction object
   */
  const getTransactionType = (tx) => {
    return tx.type === 'received' ? 'incoming' : 'outgoing'
  }

  /**
   * Get transaction type styling
   */
  const getTypeStyle = (type) => {
    return type === 'incoming'
      ? {
          icon: ArrowDownLeft,
          color: 'text-success-600',
          bg: 'bg-success-50',
          badge: 'badge-success',
        }
      : {
          icon: ArrowUpRight,
          color: 'text-primary-600',
          bg: 'bg-primary-50',
          badge: 'badge-info',
        }
  }

  // Show "no transactions" message if empty
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-slate-500">No transactions found</p>
      </div>
    )
  }

  const displayedTransactions = isExpanded ? transactions : transactions.slice(0, visibleCount)

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Transaction History
        </h3>
        <span className="text-sm text-slate-500">
          {transactions.length} total transactions
        </span>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {displayedTransactions.map((tx, index) => {
          const txType = getTransactionType(tx)
          const style = getTypeStyle(txType)
          const TypeIcon = style.icon

          return (
            <div
              key={tx.hash || index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {/* Left: Icon and Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Transaction Type Icon */}
                <div className={`p-2 rounded-lg ${style.bg}`}>
                  <TypeIcon className={`w-5 h-5 ${style.color}`} />
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-sm font-medium text-slate-900">
                      {formatHash(tx.hash)}
                    </p>
                    <span className={`badge ${style.badge} text-xs`}>
                      {txType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatTime(tx.timestamp)} • {tx.status || 'Confirmed'}
                  </p>
                </div>
              </div>

              {/* Right: Amount and Link */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {txType === 'incoming' ? '+' : '-'}{tx.amount} ETH
                  </p>
                  {tx.usdValue && (
                    <p className="text-xs text-slate-500">
                      ≈ ${tx.usdValue.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* View on Explorer */}
                <button
                  onClick={() => window.open(`https://voyager.online/tx/${tx.hash}`, '_blank')}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  title="View on Voyager"
                >
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Show More/Less Button */}
      {transactions.length > visibleCount && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show {transactions.length - visibleCount} More
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default TransactionHistory