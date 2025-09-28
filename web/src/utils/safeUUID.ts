// Safe UUID generator for environments where crypto.randomUUID may be unavailable
export const safeUUID = () => {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID()
  } catch (_) {}
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Generate Q1D5A-style player ID (5 characters, alphanumeric)
export const generatePlayerId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
