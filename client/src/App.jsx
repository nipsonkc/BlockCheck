import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import AddressInput from './components/AddressInput'
import Dashboard from './components/Dashboard'
import Watchlist from './components/Watchlist'
import { useStarknet } from './hooks/useStarknet'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Shield } from 'lucide-react'

/**
 * Main Application Component
 * Manages the overall state and layout of BlockCheck
 */
function App() {
  // State management
  const [searchAddress, setSearchAddress] = useState('')
  const [analyzedAddress, setAnalyzedAddress] = useState(null)
  const [activeTab, setActiveTab] = useState('search') // 'search' or 'watchlist'
  
  // Custom hooks
  const { wallet, connect, disconnect, isConnected } = useStarknet()
  const [watchlist, setWatchlist] = useLocalStorage('blockcheck-watchlist', [])

  /**
   * Handle address search submission
   * @param {string} address - Starknet wallet address to analyze
   */
  const handleSearch = (address) => {
    setSearchAddress(address)
    setAnalyzedAddress(address)
    setActiveTab('search')
  }

  /**
   * Add address to watchlist
   * @param {string} address - Address to watch
   * @param {string} label - Optional label for the address
   */
  const addToWatchlist = (address, label = '') => {
    const newEntry = {
      id: Date.now(),
      address,
      label: label || `Wallet ${watchlist.length + 1}`,
      addedAt: new Date().toISOString(),
    }
    setWatchlist([...watchlist, newEntry])
  }

  /**
   * Remove address from watchlist
   * @param {number} id - ID of watchlist entry to remove
   */
  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-lg p-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  BlockCheck
                </h1>
                <p className="text-xs text-slate-500">Starknet Wallet Verification</p>
              </div>
            </div>

            {/* Wallet Connection */}
            <WalletConnect
              wallet={wallet}
              isConnected={isConnected}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Search & Analyze
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Watchlist ({watchlist.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' ? (
          <div className="space-y-6 animate-fade-in">
            {/* Search Section */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Verify Wallet Address
              </h2>
              <AddressInput onSearch={handleSearch} />
            </div>

            {/* Dashboard - Shows when address is analyzed */}
            {analyzedAddress && (
              <Dashboard
                address={analyzedAddress}
                onAddToWatchlist={addToWatchlist}
                isInWatchlist={watchlist.some(item => item.address === analyzedAddress)}
              />
            )}

            {/* Empty State */}
            {!analyzedAddress && (
              <div className="card text-center py-12">
                <Shield className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  No Address Analyzed Yet
                </h3>
                <p className="text-slate-500">
                  Enter a Starknet wallet address above to view its analysis
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <Watchlist
              watchlist={watchlist}
              onRemove={removeFromWatchlist}
              onAnalyze={handleSearch}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>Built with ❤️ on Starknet</p>
            <p className="mt-2">
              BlockCheck © 2025 - Making crypto transactions safer
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App