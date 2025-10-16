
import { TrendingUp, TrendingDown, Activity, Coins, Layers, Clock } from 'lucide-react'

/**
 * StatCard Component
 * Displays a single statistic with optional trend indicator
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {number} trend - Trend percentage (positive or negative)
 * @param {string} icon - Icon identifier
 */
function StatCard({ title, value, trend, icon = 'activity' }) {
  /**
   * Get icon component based on identifier
   */
  const getIcon = () => {
    const iconMap = {
      activity: Activity,
      coins: Coins,
      layers: Layers,
      clock: Clock,
    }
    const IconComponent = iconMap[icon] || Activity
    return <IconComponent className="w-5 h-5" />
  }

  /**
   * Determine trend styling and icon
   */
  const getTrendInfo = () => {
    if (trend === undefined || trend === null) return null
    
    const isPositive = trend > 0
    const isNegative = trend < 0
    const isNeutral = trend === 0

    return {
      color: isPositive ? 'text-success-600' : isNegative ? 'text-danger-600' : 'text-slate-500',
      bg: isPositive ? 'bg-success-50' : isNegative ? 'bg-danger-50' : 'bg-slate-50',
      icon: isPositive ? TrendingUp : isNegative ? TrendingDown : null,
      text: isNeutral ? 'No change' : `${isPositive ? '+' : ''}${trend}%`,
    }
  }

  const trendInfo = getTrendInfo()

  return (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Left side - Title and Value */}
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          
          {/* Trend Indicator */}
          {trendInfo && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendInfo.color}`}>
              {trendInfo.icon && <trendInfo.icon className="w-3 h-3" />}
              <span>{trendInfo.text}</span>
            </div>
          )}
        </div>

        {/* Right side - Icon */}
        <div className={`p-3 rounded-lg ${
          trendInfo ? trendInfo.bg : 'bg-primary-50'
        }`}>
          <div className={
            trendInfo ? trendInfo.color : 'text-primary-600'
          }>
            {getIcon()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard