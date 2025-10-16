
import { useState, useEffect } from 'react'
import { fetchWalletData } from '../utils/apiClient'
import { parseWalletData } from '../utils/dataParser'

/**
 * useWalletData Hook
 * Fetches and processes wallet data from Starknet
 * @param {string} address - Wallet address to fetch data for
 * @returns {Object} Data state and loading/error states
 */
export function useWalletData(address) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch wallet data when address changes
   */
  useEffect(() => {
    if (address) {
      fetchData()
    } else {
      setData(null)
      setError(null)
    }
  }, [address])

  /**
   * Fetch and process wallet data
   */
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch raw wallet data from API
      const rawData = await fetchWalletData(address)

      // Parse and structure the data for display
      const parsedData = parseWalletData(rawData)

      setData(parsedData)
    } catch (err) {
      console.error('Error fetching wallet data:', err)
      setError(err.message || 'Failed to fetch wallet data')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manually refetch data
   */
  const refetch = () => {
    if (address) {
      fetchData()
    }
  }

  return {
    data,
    loading,
    error,
    refetch,
  }
}