/**
 * Validation utilities for Starknet addresses and data
 */

/**
 * Validate Starknet wallet address format
 * @param {string} address - Address to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export function validateStarknetAddress(address) {
  // Check if address exists
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a wallet address',
    }
  }

  // Remove whitespace
  const trimmedAddress = address.trim()

  // Check if starts with 0x
  if (!trimmedAddress.startsWith('0x')) {
    return {
      isValid: false,
      error: 'Address must start with 0x',
    }
  }

  // Check length (Starknet addresses are typically 66 characters: 0x + 64 hex chars)
  // But can be shorter if they have leading zeros
  if (trimmedAddress.length < 3 || trimmedAddress.length > 66) {
    return {
      isValid: false,
      error: 'Invalid address length',
    }
  }

  // Check if contains only valid hex characters after 0x
  const hexPart = trimmedAddress.slice(2)
  const hexRegex = /^[0-9a-fA-F]+$/
  
  if (!hexRegex.test(hexPart)) {
    return {
      isValid: false,
      error: 'Address contains invalid characters (must be hexadecimal)',
    }
  }

  // All checks passed
  return {
    isValid: true,
    error: null,
  }
}

/**
 * Normalize Starknet address to standard format
 * Adds padding to make it 66 characters
 * @param {string} address - Address to normalize
 * @returns {string} Normalized address
 */
export function normalizeAddress(address) {
  if (!address) return ''
  
  // Remove 0x prefix
  let hex = address.toLowerCase().replace('0x', '')
  
  // Pad to 64 characters
  hex = hex.padStart(64, '0')
  
  // Add 0x prefix back
  return `0x${hex}`
}

/**
 * Check if two addresses are equal (case-insensitive, padding-insensitive)
 * @param {string} addr1 - First address
 * @param {string} addr2 - Second address
 * @returns {boolean} True if addresses are equal
 */
export function addressesEqual(addr1, addr2) {
  if (!addr1 || !addr2) return false
  return normalizeAddress(addr1) === normalizeAddress(addr2)
}

/**
 * Validate transaction hash format
 * @param {string} hash - Transaction hash
 * @returns {boolean} True if valid
 */
export function validateTransactionHash(hash) {
  if (!hash || !hash.startsWith('0x')) return false
  
  const hexPart = hash.slice(2)
  return /^[0-9a-fA-F]{1,64}$/.test(hexPart)
}

/**
 * Validate and sanitize user input
 * Prevents XSS and injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .slice(0, 1000) // Limit length
}