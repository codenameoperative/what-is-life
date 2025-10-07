import { useState, useEffect } from 'react'

interface CharacterCreationProps {
  onComplete: (characterData: { spritesheetUrl: string; characterConfig: any }) => void
}

export default function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedBodyType, setSelectedBodyType] = useState('male')
  const [selectedHair, setSelectedHair] = useState('short')
  const [selectedOutfit, setSelectedOutfit] = useState('casual')
  const [characterConfig, setCharacterConfig] = useState<any>(null)

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const bodyTypes = [
    { id: 'male', name: 'Male', color: 'blue' },
    { id: 'female', name: 'Female', color: 'pink' },
    { id: 'child', name: 'Child', color: 'green' },
    { id: 'muscular', name: 'Muscular', color: 'red' }
  ]

  const hairStyles = [
    { id: 'short', name: 'Short Hair' },
    { id: 'long', name: 'Long Hair' },
    { id: 'bald', name: 'Bald' },
    { id: 'ponytail', name: 'Ponytail' }
  ]

  const outfits = [
    { id: 'casual', name: 'Casual Clothes' },
    { id: 'formal', name: 'Formal Wear' },
    { id: 'sporty', name: 'Sporty Outfit' },
    { id: 'adventurer', name: 'Adventurer Gear' }
  ]

  const generateCharacter = () => {
    // For now, create a simple config object
    // In a real implementation, this would generate an actual spritesheet
    const config = {
      bodyType: selectedBodyType,
      hair: selectedHair,
      outfit: selectedOutfit,
      timestamp: Date.now()
    }

    setCharacterConfig(config)

    // Create a simple placeholder spritesheet URL
    // In a real implementation, this would be generated from the LPC sprites
    const spritesheetUrl = `/assets/characters/${selectedBodyType}_${selectedHair}_${selectedOutfit}.png`

    onComplete({
      spritesheetUrl,
      characterConfig: config
    })
  }

  if (!isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-lg font-semibold">Loading Character Creator...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">Create Your Character</h1>
          <p className="text-gray-300">Choose your character's appearance</p>
        </div>

        {/* Character Preview */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 text-center">
          <div className="w-32 h-32 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">
              {selectedBodyType === 'male' ? '👨' :
               selectedBodyType === 'female' ? '👩' :
               selectedBodyType === 'child' ? '🧒' : '💪'}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            {bodyTypes.find(b => b.id === selectedBodyType)?.name} Character
          </h3>
          <p className="text-gray-400">
            {hairStyles.find(h => h.id === selectedHair)?.name} • {outfits.find(o => o.id === selectedOutfit)?.name}
          </p>
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Body Type */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Body Type</h3>
            <div className="space-y-3">
              {bodyTypes.map((body) => (
                <button
                  key={body.id}
                  onClick={() => setSelectedBodyType(body.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedBodyType === body.id
                      ? `bg-${body.color}-600 text-white`
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Hair Style</h3>
            <div className="space-y-3">
              {hairStyles.map((hair) => (
                <button
                  key={hair.id}
                  onClick={() => setSelectedHair(hair.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedHair === hair.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {hair.name}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Outfit</h3>
            <div className="space-y-3">
              {outfits.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => setSelectedOutfit(outfit.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedOutfit === outfit.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {outfit.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={generateCharacter}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Create Character
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          This is a simplified character creator. In the full version, you'll be able to use the LPC spritesheet generator for more detailed customization.
        </div>
      </div>
    </div>
  )
}
