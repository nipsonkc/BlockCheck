
import { useState, useEffect } from 'react'
import { connect, disconnect } from 'get-starknet-core'

/**
 * useStarknet Hook
 * Manages Starknet wallet connection state and operations
 * @returns {Object} Wallet state and connection methods
 */
export function useStarknet() {
  const [wallet, setWallet] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Check for existing wallet connection on mount
   */
  useEffect(() => {
    checkConnection()
  }, [])

  /**
   * Check if wallet is already connected
   */
  const checkConnection = async () => {
    try {
      // Check if get-starknet is available
      if (typeof window !== 'undefined' && window.starknet) {
        const starknet = window.starknet
        
        if (starknet.isConnected) {
          setWallet(starknet)
          setIsConnected(true)
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
    }
  }

  /**
   * Connect to Starknet wallet
   * Supports ArgentX and Braavos wallets
   */
  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Attempt to connect using get-starknet
      const starknet = await connect({
        modalMode: 'alwaysAsk', // Show wallet selection modal
        modalTheme: 'light',
      })

      if (!starknet) {
        throw new Error('No wallet found. Please install ArgentX or Braavos.')
      }

      // Enable the wallet
      await starknet.enable()

      // Check if successfully connected
      if (starknet.isConnected) {
        setWallet(starknet)
        setIsConnected(true)
        
        // Store connection preference in memory
        console.log('Wallet connected:', starknet.account?.address)
      } else {
        throw new Error('Failed to connect wallet')
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError(err.message || 'Failed to connect wallet')
      setIsConnected(false)
      setWallet(null)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Disconnect wallet
   */
  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await disconnect()
      }
      
      setWallet(null)
      setIsConnected(false)
      setError(null)
      
      console.log('Wallet disconnected')
    } catch (err) {
      console.error('Disconnect error:', err)
      setError(err.message || 'Failed to disconnect wallet')
    }
  }

  /**
   * Get current wallet address
   * @returns {string|null} Wallet address or null
   */
  const getAddress = () => {
    return wallet?.account?.address || null
  }

  /**
   * Get wallet provider (ArgentX, Braavos, etc.)
   * @returns {string} Wallet provider name
   */
  const getProvider = () => {
    if (!wallet) return 'Unknown'
    return wallet.name || wallet.id || 'Starknet Wallet'
  }

  return {
    wallet,
    isConnected,
    isConnecting,
    error,
    connect: connectWallet,
    disconnect: disconnectWallet,
    getAddress,
    getProvider,
  }
}