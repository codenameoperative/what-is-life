// Basic analytics system for user behavior tracking
import { useState, useEffect } from 'react'
interface AnalyticsEvent {
  event: string
  timestamp: number
  userId?: string
  data?: any
  sessionId: string
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private isEnabled: boolean = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadSettings()
    this.startHeartbeat()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadSettings() {
    try {
      const settings = localStorage.getItem('analytics_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        this.isEnabled = parsed.enabled || false
      }
    } catch (error) {
      console.warn('Failed to load analytics settings:', error)
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    try {
      localStorage.setItem('analytics_settings', JSON.stringify({ enabled }))
    } catch (error) {
      console.warn('Failed to save analytics settings:', error)
    }
  }

  trackEvent(event: string, data?: any, userId?: string) {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      userId,
      data,
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events.shift()
    }

    // Save to local storage (in a real app, this would be sent to a server)
    this.persistEvents()
  }

  private persistEvents() {
    try {
      // Only keep essential data for privacy
      const essentialEvents = this.events.map(event => ({
        event: event.event,
        timestamp: event.timestamp,
        // Don't store userId or sensitive data
      }))

      localStorage.setItem('analytics_events', JSON.stringify(essentialEvents.slice(-100)))
    } catch (error) {
      console.warn('Failed to persist analytics events:', error)
    }
  }

  private startHeartbeat() {
    // Send heartbeat every 5 minutes
    setInterval(() => {
      if (this.isEnabled) {
        this.trackEvent('heartbeat')
      }
    }, 5 * 60 * 1000)
  }

  getSessionStats() {
    if (!this.isEnabled) return null

    const sessionEvents = this.events.filter(e => e.sessionId === this.sessionId)
    const eventCounts = sessionEvents.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      sessionDuration: Date.now() - sessionEvents[0]?.timestamp,
      totalEvents: sessionEvents.length,
      eventBreakdown: eventCounts
    }
  }

  exportData(): AnalyticsEvent[] {
    return this.events.map(event => ({
      ...event,
      // Remove sensitive data
      userId: undefined,
      data: undefined
    }))
  }
}

// Singleton instance
const analyticsManager = new AnalyticsManager()

// React hook for analytics
export function useAnalytics(userId?: string) {
  const trackEvent = (event: string, data?: any) => {
    analyticsManager.trackEvent(event, data, userId)
  }

  const setAnalyticsEnabled = (enabled: boolean) => {
    analyticsManager.setEnabled(enabled)
  }

  const getSessionStats = () => {
    return analyticsManager.getSessionStats()
  }

  const exportAnalyticsData = () => {
    return analyticsManager.exportData()
  }

  return {
    trackEvent,
    setAnalyticsEnabled,
    getSessionStats,
    exportAnalyticsData,
    isEnabled: () => analyticsManager['isEnabled']
  }
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }))
        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    // Memory usage (if available)
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }))
      }
    }

    const memoryInterval = setInterval(measureMemory, 5000)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(memoryInterval)
    }
  }, [])

  return metrics
}

// A/B Testing framework
interface ABTest {
  id: string
  name: string
  variants: string[]
  weights?: number[]
  active: boolean
}

class ABTestManager {
  private tests: ABTest[] = []
  private userVariants: Map<string, string> = new Map()

  constructor() {
    this.loadTests()
  }

  private loadTests() {
    // Default A/B tests
    this.tests = [
      {
        id: 'loading_screen',
        name: 'Loading Screen Style',
        variants: ['classic', 'modern', 'minimal'],
        weights: [0.5, 0.3, 0.2],
        active: true
      },
      {
        id: 'ui_theme',
        name: 'UI Color Theme',
        variants: ['default', 'warm', 'cool', 'high_contrast'],
        weights: [0.4, 0.3, 0.2, 0.1],
        active: true
      },
      {
        id: 'activity_order',
        name: 'Activity Button Order',
        variants: ['alphabetical', 'popularity', 'random'],
        weights: [0.6, 0.3, 0.1],
        active: false
      }
    ]
  }

  getVariant(testId: string, userId: string): string {
    // Check if user already has a variant assigned
    const cached = this.userVariants.get(`${testId}_${userId}`)
    if (cached) return cached

    const test = this.tests.find(t => t.id === testId)
    if (!test || !test.active) return test?.variants[0] || 'default'

    // Simple hash-based assignment for consistency
    const hash = this.simpleHash(userId + testId)
    const totalWeight = test.weights?.reduce((sum, w) => sum + w, 0) || test.variants.length
    let cumulativeWeight = 0

    for (let i = 0; i < test.variants.length; i++) {
      const weight = test.weights?.[i] || 1
      cumulativeWeight += weight / totalWeight

      if (hash <= cumulativeWeight) {
        const variant = test.variants[i]
        this.userVariants.set(`${testId}_${userId}`, variant)
        return variant
      }
    }

    return test.variants[0]
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647 // Normalize to 0-1
  }

  trackConversion(testId: string, userId: string, event: string) {
    // In a real system, this would send conversion data to analytics
    console.log(`A/B Test Conversion: ${testId} - ${userId} - ${event}`)
  }
}

const abTestManager = new ABTestManager()

export function useABTesting(userId: string) {
  const getVariant = (testId: string) => {
    return abTestManager.getVariant(testId, userId)
  }

  const trackConversion = (testId: string, event: string) => {
    abTestManager.trackConversion(testId, userId, event)
  }

  return { getVariant, trackConversion }
}
