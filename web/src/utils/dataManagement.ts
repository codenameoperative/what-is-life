import { GameState } from '../contexts/GameContext'

export interface ExportData {
  gameState: GameState
  exportDate: string
  version: string
  checksum: string
}

export interface ImportResult {
  success: boolean
  error?: string
  data?: GameState
}

// Export game data
export const exportGameData = (gameState: GameState): string => {
  const exportData: ExportData = {
    gameState,
    exportDate: new Date().toISOString(),
    version: '0.1.1',
    checksum: generateChecksum(gameState)
  }

  return btoa(JSON.stringify(exportData, null, 2))
}

// Import game data
export const importGameData = (exportString: string): ImportResult => {
  try {
    const decoded = atob(exportString)
    const importData: ExportData = JSON.parse(decoded)

    // Validate data structure
    if (!importData.gameState || !importData.version) {
      return { success: false, error: 'Invalid save file format' }
    }

    // Validate checksum
    const expectedChecksum = generateChecksum(importData.gameState)
    if (expectedChecksum !== importData.checksum) {
      return { success: false, error: 'Save file corrupted or tampered with' }
    }

    // Validate version compatibility
    if (!isVersionCompatible(importData.version)) {
      return { success: false, error: `Incompatible save version: ${importData.version}. Current: 0.1.1` }
    }

    return { success: true, data: importData.gameState }
  } catch (error) {
    return { success: false, error: 'Failed to parse save file' }
  }
}

// Generate checksum for data integrity
const generateChecksum = (data: any): string => {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

// Check version compatibility
const isVersionCompatible = (version: string): boolean => {
  const currentVersion = '0.1.1'
  const [currentMajor, currentMinor] = currentVersion.split('.').map(Number)
  const [importMajor, importMinor] = version.split('.').map(Number)

  // Major version must match for compatibility
  return importMajor === currentMajor
}

// Download export file
export const downloadExportFile = (exportData: string, filename: string = 'what-is-life-save.txt') => {
  const blob = new Blob([exportData], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// Read file from input
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Performance optimization for large inventories
export const optimizeInventory = (inventory: any[]) => {
  // Group stackable items
  const grouped: { [key: string]: any } = {}

  inventory.forEach(item => {
    const key = `${item.id}-${item.durability || 0}`
    if (grouped[key]) {
      if (grouped[key].quantity && item.quantity) {
        grouped[key].quantity += item.quantity
      }
    } else {
      grouped[key] = { ...item }
    }
  })

  return Object.values(grouped)
}

// Compress game state for storage
export const compressGameState = (state: GameState): string => {
  // Remove unnecessary data and compress
  const compressed = {
    ...state,
    // Only keep essential profile data
    profile: {
      ...state.profile,
      // Remove large arrays that can be recalculated
      availableTitles: state.profile.availableTitles.slice(0, 50), // Limit titles
    },
    // Optimize inventory
    inventory: optimizeInventory(state.inventory),
    // Compress garden data
    garden: {
      ...state.garden,
      plots: state.garden.plots.map(plot => ({
        ...plot,
        // Round growth progress to reduce precision
        growthProgress: Math.round(plot.growthProgress * 100) / 100
      }))
    }
  }

  return JSON.stringify(compressed)
}

// Decompress game state
export const decompressGameState = (compressed: string): GameState => {
  return JSON.parse(compressed)
}
