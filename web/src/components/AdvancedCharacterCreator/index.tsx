import { useState } from 'react'

export interface AdvancedCharacterData {
  appearance: {
    skinTone: number
    hairStyle: number
    hairColor: number
    eyeColor: number
    bodyType: number
    age: number
  }
  clothing: {
    top: number
    bottom: number
    shoes: number
    accessories: number[]
  }
  traits: {
    personality: string
    background: string
    specialAbility: string
  }
}

interface AdvancedCharacterCreatorProps {
  onComplete: (characterData: AdvancedCharacterData) => void
  onCancel: () => void
}

const SKIN_TONES = ['#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524']
const HAIR_STYLES = ['Short', 'Medium', 'Long', 'Curly', 'Bald']
const HAIR_COLORS = ['#000000', '#8B4513', '#FFD700', '#FF6347', '#C0C0C0']
const EYE_COLORS = ['#0000FF', '#008000', '#8B4513', '#000000', '#FF0000']
const BODY_TYPES = ['Slim', 'Average', 'Athletic', 'Heavy', 'Muscular']

export default function AdvancedCharacterCreator({ onComplete, onCancel }: AdvancedCharacterCreatorProps) {
  const [characterData, setCharacterData] = useState<AdvancedCharacterData>({
    appearance: {
      skinTone: 0,
      hairStyle: 0,
      hairColor: 0,
      eyeColor: 0,
      bodyType: 0,
      age: 25
    },
    clothing: {
      top: 0,
      bottom: 0,
      shoes: 0,
      accessories: []
    },
    traits: {
      personality: 'Adventurous',
      background: 'Mysterious Wanderer',
      specialAbility: 'Quick Learner'
    }
  })

  const handleComplete = () => {
    onComplete(characterData)
  }

  const updateAppearance = (key: keyof AdvancedCharacterData['appearance'], value: number) => {
    setCharacterData(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }))
  }

  const updateTraits = (key: keyof AdvancedCharacterData['traits'], value: string) => {
    setCharacterData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [key]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-[min(95vw,900px)] max-h-[90vh] overflow-y-auto bg-neutral-950/90 border border-neutral-800 rounded-xl shadow-2xl">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-bold text-white text-center">Create Your Character</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Character Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center text-6xl border-4 border-neutral-600">
              👤
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skin Tone */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Skin Tone</label>
                <select
                  value={characterData.appearance.skinTone}
                  onChange={(e) => updateAppearance('skinTone', parseInt(e.target.value))}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  {SKIN_TONES.map((tone, index) => (
                    <option key={index} value={index}>Tone {index + 1}</option>
                  ))}
                </select>
              </div>

              {/* Hair Style */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Hair Style</label>
                <select
                  value={characterData.appearance.hairStyle}
                  onChange={(e) => updateAppearance('hairStyle', parseInt(e.target.value))}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  {HAIR_STYLES.map((style, index) => (
                    <option key={index} value={index}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Hair Color</label>
                <select
                  value={characterData.appearance.hairColor}
                  onChange={(e) => updateAppearance('hairColor', parseInt(e.target.value))}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  {HAIR_COLORS.map((color, index) => (
                    <option key={index} value={index}>Color {index + 1}</option>
                  ))}
                </select>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Eye Color</label>
                <select
                  value={characterData.appearance.eyeColor}
                  onChange={(e) => updateAppearance('eyeColor', parseInt(e.target.value))}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  {EYE_COLORS.map((color, index) => (
                    <option key={index} value={index}>Color {index + 1}</option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Body Type</label>
                <select
                  value={characterData.appearance.bodyType}
                  onChange={(e) => updateAppearance('bodyType', parseInt(e.target.value))}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  {BODY_TYPES.map((type, index) => (
                    <option key={index} value={index}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Age</label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={characterData.appearance.age}
                  onChange={(e) => updateAppearance('age', parseInt(e.target.value) || 25)}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Traits Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Character Traits</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Personality</label>
                <select
                  value={characterData.traits.personality}
                  onChange={(e) => updateTraits('personality', e.target.value)}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  <option>Adventurous</option>
                  <option>Analytical</option>
                  <option>Brave</option>
                  <option>Creative</option>
                  <option>Diplomatic</option>
                  <option>Energetic</option>
                  <option>Honest</option>
                  <option>Optimistic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Background</label>
                <select
                  value={characterData.traits.background}
                  onChange={(e) => updateTraits('background', e.target.value)}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  <option>Mysterious Wanderer</option>
                  <option>Street Smart Survivor</option>
                  <option>Former Adventurer</option>
                  <option>Tech-Savvy Innovator</option>
                  <option>Community Leader</option>
                  <option>Creative Artist</option>
                  <option>Hardened Veteran</option>
                  <option>Aspiring Entrepreneur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Special Ability</label>
                <select
                  value={characterData.traits.specialAbility}
                  onChange={(e) => updateTraits('specialAbility', e.target.value)}
                  className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-3 text-white"
                >
                  <option>Quick Learner</option>
                  <option>Lucky Charm</option>
                  <option>Night Vision</option>
                  <option>Enhanced Reflexes</option>
                  <option>Persuasive Speech</option>
                  <option>Resourceful Mind</option>
                  <option>Endurance Expert</option>
                  <option>Tech Proficiency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-3 px-4 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 shadow-lg"
            >
              Create Character
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
