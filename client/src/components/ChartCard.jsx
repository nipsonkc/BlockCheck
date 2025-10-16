
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

/**
 * ChartCard Component
 * Wrapper for different chart types with consistent styling
 * @param {string} title - Chart title
 * @param {string} type - Chart type ('line', 'bar', 'doughnut')
 * @param {Object} data - Chart data object
 * @param {Object} options - Additional chart options
 */
function ChartCard({ title, type = 'line', data, options = {} }) {
  /**
   * Default chart options with theme styling
   */
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type !== 'line',
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    } : undefined,
  }

  // Merge default options with custom options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
    },
  }

  /**
   * Render appropriate chart based on type
   */
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={mergedOptions} />
      case 'bar':
        return <Bar data={data} options={mergedOptions} />
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />
      default:
        return <Line data={data} options={mergedOptions} />
    }
  }

  return (
    <div className="card">
      {/* Chart Title */}
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {title}
      </h3>

      {/* Chart Container */}
      <div className="relative h-64">
        {data && data.labels && data.labels.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChartCard