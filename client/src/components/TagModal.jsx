import { X, Tag } from 'lucide-react'

/**
 * TagModal Component
 * Modal dialog for adding labels to wallet addresses
 * @param {Function} onClose - Handler to close modal
 * @param {Function} onSave - Handler to save label
 * @param {string} label - Current label value
 * @param {Function} setLabel - Label state setter
 */
function TagModal({ onClose, onSave, label, setLabel }) {
  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave()
    onClose()
  }

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Add to Watchlist
              </h3>
              <p className="text-sm text-slate-500">
                Give this address a memorable label
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Label Input */}
            <div>
              <label
                htmlFor="label"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Label (Optional)
              </label>
              <input
                type="text"
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., DEX Contract, Friend's Wallet, Savings..."
                className="input"
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-2">
                This label will help you identify this address in your watchlist
              </p>
            </div>

            {/* Quick Label Suggestions */}
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">
                Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Personal Wallet', 'Exchange', 'DEX Contract', 'NFT Marketplace', 'Friend'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setLabel(suggestion)}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Add to Watchlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TagModal