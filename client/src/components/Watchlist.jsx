
import { Trash2, Search, ExternalLink, Bookmark } from 'lucide-react'
import { formatDistance } from 'date-fns'

/**
 * Watchlist Component
 * Displays and manages saved wallet addresses
 * @param {Array} watchlist - Array of watched addresses
 * @param {Function} onRemove - Handler to remove address from watchlist
 * @param {Function} onAnalyze - Handler to analyze an address
 */
function Watchlist({ watchlist = [], onRemove, onAnalyze }) {
  /**
   * Format address for display
   * @param {string} address - Full wallet address
   */
  const formatAddress = (address) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  /**
   * Format date added
   * @param {string} dateString - ISO date string
   */
  const formatDate = (dateString) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  // Empty state
  if (watchlist.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
          <Bookmark className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No Addresses in Watchlist
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Search and analyze wallet addresses, then add them to your watchlist for quick access later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Your Watchlist</h2>
            <p className="text-sm text-slate-500 mt-1">
              {watchlist.length} {watchlist.length === 1 ? 'address' : 'addresses'} saved
            </p>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 gap-4">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="card hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Side - Address Info */}
              <div className="flex-1 min-w-0">
                {/* Label */}
                <h3 className="font-semibold text-slate-900 mb-1">
                  {item.label}
                </h3>

                {/* Address */}
                <p className="font-mono text-sm text-slate-600 mb-2 break-all">
                  {item.address}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Added {formatDate(item.addedAt)}</span>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* Analyze Button */}
                <button
                  onClick={() => onAnalyze(item.address)}
                  className="btn-primary flex items-center gap-2 text-sm"
                  title="Analyze this address"
                >
                  <Search className="w-4 h-4" />
                  Analyze
                </button>

                {/* View on Explorer */}
                <button
                  onClick={() => window.open(`https://voyager.online/contract/${item.address}`, '_blank')}
                  className="btn-secondary flex items-center gap-2 text-sm"
                  title="View on Voyager"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explorer
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    if (window.confirm('Remove this address from watchlist?')) {
                      onRemove(item.id)
                    }
                  }}
                  className="btn-secondary flex items-center gap-2 text-sm text-danger-600 hover:bg-danger-50"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Watchlist