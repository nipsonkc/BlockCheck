
import { Wallet, LogOut, ExternalLink } from 'lucide-react'

/**
 * WalletConnect Component
 * Handles wallet connection UI and user actions
 * @param {Object} wallet - Current wallet object
 * @param {boolean} isConnected - Connection status
 * @param {Function} onConnect - Connect wallet handler
 * @param {Function} onDisconnect - Disconnect wallet handler
 */
function WalletConnect({ wallet, isConnected, onConnect, onDisconnect }) {
  /**
   * Format address for display (show first 6 and last 4 characters)
   * @param {string} address - Full wallet address
   * @returns {string} Formatted address
   */
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  /**
   * Copy address to clipboard
   */
  const copyAddress = async () => {
    if (wallet?.account?.address) {
      await navigator.clipboard.writeText(wallet.account.address)
      // You could add a toast notification here
    }
  }

  /**
   * View address on Voyager explorer
   */
  const viewOnExplorer = () => {
    if (wallet?.account?.address) {
      window.open(
        `https://voyager.online/contract/${wallet.account.address}`,
        '_blank'
      )
    }
  }

  // Not connected state
  if (!isConnected) {
    return (
      <button
        onClick={onConnect}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    )
  }

  // Connected state
  return (
    <div className="flex items-center gap-3">
      {/* Wallet Info Card */}
      <div className="hidden sm:flex items-center gap-3 bg-slate-100 rounded-lg px-4 py-2">
        {/* Wallet Icon */}
        <div className="bg-primary-600 rounded-full p-1.5">
          <Wallet className="w-4 h-4 text-white" />
        </div>

        {/* Address Display */}
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Connected</span>
          <button
            onClick={copyAddress}
            className="font-mono text-sm font-medium text-slate-900 hover:text-primary-600 transition-colors"
            title="Click to copy full address"
          >
            {formatAddress(wallet?.account?.address)}
          </button>
        </div>

        {/* View on Explorer */}
        <button
          onClick={viewOnExplorer}
          className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          title="View on Voyager"
        >
          <ExternalLink className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={onDisconnect}
        className="btn-secondary flex items-center gap-2"
        title="Disconnect Wallet"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Disconnect</span>
      </button>
    </div>
  )
}

export default WalletConnect