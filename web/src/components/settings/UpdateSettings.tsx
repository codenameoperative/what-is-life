import React from 'react'

export interface UpdateSettingsData {
  autoUpdate: {
    enabled: boolean
    wifiOnly: boolean
    checkInterval: number
    lastCheck: number
    currentVersion: string
  }
}

interface UpdateSettingsProps {
  settings: UpdateSettingsData['autoUpdate']
  onUpdateSettings: (settings: Partial<UpdateSettingsData['autoUpdate']>) => void
  onCheckForUpdates: () => void
  networkStatus?: string
}

export const UpdateSettings: React.FC<UpdateSettingsProps> = ({
  settings,
  onUpdateSettings,
  onCheckForUpdates,
  networkStatus = 'unknown'
}) => {
  const handleToggleAutoUpdate = () => {
    onUpdateSettings({ enabled: !settings.enabled })
  }

  const handleToggleWifiOnly = () => {
    onUpdateSettings({ wifiOnly: !settings.wifiOnly })
  }

  const handleIntervalChange = (hours: number) => {
    onUpdateSettings({ checkInterval: hours })
  }

  const getLastCheckText = () => {
    if (settings.lastCheck === 0) return 'Never'

    const now = Date.now()
    const hoursSince = (now - settings.lastCheck) / (1000 * 60 * 60)

    if (hoursSince < 1) return 'Less than 1 hour ago'
    if (hoursSince < 24) return `${Math.floor(hoursSince)} hours ago`

    const daysSince = Math.floor(hoursSince / 24)
    return `${daysSince} day${daysSince > 1 ? 's' : ''} ago`
  }

  return (
    <div className="discord-card p-4 space-y-6">
      <div className="border-b border-gray-700 pb-3">
        <h3 className="discord-card-header text-lg font-semibold mb-1">Auto-Update Settings</h3>
        <p className="text-sm text-gray-400">Configure automatic app updates</p>
      </div>

      {/* Master Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-white">Enable Auto-Updates</h4>
          <p className="text-sm text-gray-400">Automatically check for and install app updates</p>
        </div>
        <button
          onClick={handleToggleAutoUpdate}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            settings.enabled ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.enabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* WiFi Only Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-white">WiFi Only</h4>
          <p className="text-sm text-gray-400">Only update when connected to WiFi</p>
          <p className="text-xs text-gray-500 mt-1">
            Current: {networkStatus === 'wifi' ? '📶 WiFi' :
                     networkStatus === 'cellular' ? '📱 Cellular' :
                     '❓ Unknown'}
          </p>
        </div>
        <button
          onClick={handleToggleWifiOnly}
          disabled={!settings.enabled}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            settings.wifiOnly && settings.enabled ? 'bg-blue-600' : 'bg-gray-600'
          } ${!settings.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.wifiOnly && settings.enabled ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Check Interval */}
      <div>
        <h4 className="font-medium text-white mb-2">Check Interval</h4>
        <select
          value={settings.checkInterval}
          onChange={(e) => handleIntervalChange(Number(e.target.value))}
          disabled={!settings.enabled}
          className="discord-input w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value={6}>Every 6 hours</option>
          <option value={12}>Every 12 hours</option>
          <option value={24}>Daily</option>
          <option value={72}>Every 3 days</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Last checked: {getLastCheckText()}
        </p>
      </div>

      {/* Current Version */}
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="text-sm text-gray-400">Current Version</div>
        <div className="font-mono text-white">{settings.currentVersion || 'Unknown'}</div>
      </div>

      {/* Manual Actions */}
      <div className="space-y-3">
        <button
          onClick={onCheckForUpdates}
          disabled={!settings.enabled}
          className="discord-button w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔍 Check for Updates Now
        </button>

        <button
          onClick={() => window.open('https://play.google.com/store/apps/details?id=com.whatislife.app', '_blank')}
          className="discord-secondary w-full py-2"
        >
          🏪 Open Google Play Store
        </button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Updates will only occur when the app is running</p>
        <p>• WiFi-only mode saves mobile data</p>
        <p>• Flexible updates allow continued app usage</p>
        <p>• Immediate updates require app restart</p>
      </div>
    </div>
  )
}
