
import { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { validateStarknetAddress } from '../utils/validators'

/**
 * AddressInput Component
 * Allows users to input and validate Starknet wallet addresses
 * @param {Function} onSearch - Callback when valid address is submitted
 */
function AddressInput({ onSearch }) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handle form submission
   * Validates address before calling onSearch
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate address format
    const validation = validateStarknetAddress(address.trim())
    
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // Trigger search
    setIsLoading(true)
    try {
      await onSearch(address.trim())
    } catch (err) {
      setError('Failed to analyze address. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle input change and clear errors
   */
  const handleChange = (e) => {
    setAddress(e.target.value)
    if (error) setError('') // Clear error on new input
  }

  /**
   * Paste example address for testing
   */
  const pasteExample = () => {
    const exampleAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    setAddress(exampleAddress)
    setError('')
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          {/* Input Field */}
          <input
            type="text"
            value={address}
            onChange={handleChange}
            placeholder="Enter Starknet wallet address (0x...)"
            className={`input pr-12 font-mono text-sm ${
              error ? 'border-danger-500 focus:ring-danger-500' : ''
            }`}
            disabled={isLoading}
          />
          
          {/* Search Icon */}
          <button
            type="submit"
            disabled={!address || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-danger-600 text-sm bg-danger-50 p-3 rounded-lg animate-slide-up">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper Text and Example Button */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Enter a valid Starknet address to analyze
          </p>
          <button
            type="button"
            onClick={pasteExample}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Example
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h4 className="font-medium text-primary-900 mb-2">What we analyze:</h4>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Transaction history and frequency</li>
          <li>• Token types and distributions</li>
          <li>• Interaction patterns and counterparties</li>
          <li>• Risk indicators and anomalies</li>
          <li>• Activity timeline and trends</li>
        </ul>
      </div>
    </div>
  )
}

export default AddressInput