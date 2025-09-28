// Enhanced player ID generator - 5 random uppercase letters and numbers mixed
export const generatePlayerId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Check if player ID is unique (for database)
// Generate a unique player ID
export const generateUniquePlayerId = (): string => {
  // In the desktop build we don't have to coordinate across users, so a random ID is sufficient.
  return generatePlayerId()
}
