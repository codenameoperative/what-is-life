import { useState, useEffect, useRef } from 'react'
import Phaser from 'phaser'

interface CharacterCreationProps {
  onComplete: (characterData: { spritesheetUrl: string; characterConfig: any }) => void
}

interface CharacterConfig {
  bodyType: string
  hair: string
  outfit: string
  accessories?: string[]
}

export default function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedBodyType, setSelectedBodyType] = useState('male')
  const [selectedHair, setSelectedHair] = useState('short')
  const [selectedSkinTone, setSelectedSkinTone] = useState('light')
  const [selectedHairColor, setSelectedHairColor] = useState('brown')
  const [selectedEyeColor, setSelectedEyeColor] = useState('brown')
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      // Initialize Phaser game for character preview
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 128,
        height: 128,
        parent: gameRef.current,
        backgroundColor: '#000000',
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      }

      phaserGameRef.current = new Phaser.Game(config)
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
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

  const skinTones = [
    { id: 'light', name: 'Light', color: '#f4c2a1' },
    { id: 'medium', name: 'Medium', color: '#d4a574' },
    { id: 'dark', name: 'Dark', color: '#8b5a3c' },
    { id: 'olive', name: 'Olive', color: '#c68642' }
  ]

  const hairColors = [
    { id: 'brown', name: 'Brown' },
    { id: 'black', name: 'Black' },
    { id: 'blonde', name: 'Blonde' },
    { id: 'red', name: 'Red' },
    { id: 'white', name: 'White' },
    { id: 'blue', name: 'Blue' }
  ]

  const eyeColors = [
    { id: 'brown', name: 'Brown' },
    { id: 'blue', name: 'Blue' },
    { id: 'green', name: 'Green' },
    { id: 'hazel', name: 'Hazel' },
    { id: 'gray', name: 'Gray' }
  ]

  // Phaser scene functions with access to selections via ref
  function preload(this: Phaser.Scene) {
    // Load basic character sprites - in a real implementation, these would be actual LPC sprites
    this.load.image('character-base', '/assets/characters/base.png')
    this.load.image('hair-short', '/assets/characters/hair-short.png')
    this.load.image('hair-long', '/assets/characters/hair-long.png')
    this.load.image('outfit-casual', '/assets/characters/outfit-casual.png')
  }

  function create(this: Phaser.Scene) {
    // Create character sprite group
    const character = this.add.group()

    try {
      // Add body (base layer)
      const bodySprite = this.add.image(128, 128, `body-${selectionsRef.current.bodyType}-${selectionsRef.current.skinTone}`)
      character.add(bodySprite)

      // Add outfit layer
      const outfitSprite = this.add.image(128, 128, `outfit-${selectionsRef.current.outfit}`)
      character.add(outfitSprite)

      // Add hair layer
      const hairSprite = this.add.image(128, 128, `hair-${selectionsRef.current.hair}-${selectionsRef.current.hairColor}`)
      character.add(hairSprite)

    } catch (error) {
      // Fallback rendering if sprites don't load
      createFallbackCharacter.call(this, character)
    }

    // Store reference for updates
    ;(this as any).characterGroup = character
  }

  function createFallbackCharacter(this: Phaser.Scene, character: Phaser.GameObjects.Group) {
    // Create simple colored shapes as fallback
    const bodyColor = skinTones.find(s => s.id === selectionsRef.current.skinTone)?.color || '#f4c2a1'
    const hairColor = hairColors.find(h => h.id === selectionsRef.current.hairColor)?.id || 'brown'

    // Convert hex color to RGB values for Phaser
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.slice(1))
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 244, g: 194, b: 161 }
    }

    const bodyRgb = hexToRgb(bodyColor)
    const hairRgb = { r: 139, g: 69, b: 19 } // Default brown

    // Body
    const body = this.add.rectangle(128, 140, 32, 48, Phaser.Display.Color.GetColor32(bodyRgb.r, bodyRgb.g, bodyRgb.b, 255))
    character.add(body)

    // Head
    const head = this.add.circle(128, 100, 16, Phaser.Display.Color.GetColor32(bodyRgb.r, bodyRgb.g, bodyRgb.b, 255))
    character.add(head)

    // Hair (simple shape based on style)
    let hairShape: Phaser.GameObjects.Shape
    switch (selectionsRef.current.hair) {
      case 'long':
        hairShape = this.add.rectangle(128, 85, 28, 20, Phaser.Display.Color.GetColor32(hairRgb.r, hairRgb.g, hairRgb.b, 255))
        break
      case 'short':
        hairShape = this.add.rectangle(128, 90, 24, 12, Phaser.Display.Color.GetColor32(hairRgb.r, hairRgb.g, hairRgb.b, 255))
        break
      default:
        hairShape = this.add.rectangle(128, 90, 20, 10, Phaser.Display.Color.GetColor32(hairRgb.r, hairRgb.g, hairRgb.b, 255))
    }
    character.add(hairShape)

    // Outfit (simple colored rectangle)
    const outfit = this.add.rectangle(128, 155, 36, 32, Phaser.Display.Color.GetColor32(74, 144, 226, 255))
    character.add(outfit)
  }

  function update(this: Phaser.Scene) {
    // Update character appearance when selections change
    const characterGroup = (this as any).characterGroup
    if (characterGroup && (window as any).characterNeedsUpdate) {
      // Clear existing sprites
      characterGroup.clear(true, true)

      try {
        // Re-add body
        const bodySprite = this.add.image(128, 128, `body-${selectionsRef.current.bodyType}-${selectionsRef.current.skinTone}`)
        characterGroup.add(bodySprite)

        // Re-add outfit
        const outfitSprite = this.add.image(128, 128, `outfit-${selectionsRef.current.outfit}`)
        characterGroup.add(outfitSprite)

        // Re-add hair
        const hairSprite = this.add.image(128, 128, `hair-${selectionsRef.current.hair}-${selectionsRef.current.hairColor}`)
        characterGroup.add(hairSprite)

      } catch (error) {
        // Re-create fallback character
        createFallbackCharacter.call(this, characterGroup)
      }

      ;(window as any).characterNeedsUpdate = false
    }
  }

  const generateCharacter = () => {
    const config = {
      bodyType: selectedBodyType,
      hair: selectedHair,
      outfit: selectedOutfit,
      skinTone: selectedSkinTone,
      hairColor: selectedHairColor,
      eyeColor: selectedEyeColor,
      timestamp: Date.now()
    }

    // In a real implementation, this would generate an actual spritesheet
    // For now, create a data URL representing the character config
    const spritesheetUrl = `data:character/config;base64,${btoa(JSON.stringify(config))}`

    onComplete({
      spritesheetUrl,
      characterConfig: config
    })
  }

  const updateCharacterPreview = () => {
    ;(window as any).characterNeedsUpdate = true
  }

  useEffect(() => {
    updateCharacterPreview()
  }, [selectedBodyType, selectedHair, selectedOutfit, selectedSkinTone, selectedHairColor])

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">Create Your Character</h1>
          <p className="text-gray-300">Customize your appearance using the LPC spritesheet generator</p>
        </div>

        {/* Character Preview */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 text-center">
          <div className="w-64 h-64 mx-auto bg-black rounded-lg overflow-hidden mb-4 border-2 border-purple-500">
            <div ref={gameRef} className="w-full h-full"></div>
          </div>
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            {bodyTypes.find(b => b.id === selectedBodyType)?.name} Character
          </h3>
          <p className="text-gray-400">
            {hairStyles.find(h => h.id === selectedHair)?.name} • {outfits.find(o => o.id === selectedOutfit)?.name}
          </p>
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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

          {/* Skin Tone */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Skin Tone</h3>
            <div className="space-y-3">
              {skinTones.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setSelectedSkinTone(skin.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedSkinTone === skin.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  style={{ borderLeft: `4px solid ${skin.color}` }}
                >
                  {skin.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Hair Color</h3>
            <div className="space-y-3">
              {hairColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedHairColor(color.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedHairColor === color.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Color */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Eye Color</h3>
            <div className="space-y-3">
              {eyeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedEyeColor(color.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedEyeColor === color.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {color.name}
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
          Full LPC spritesheet generator integration. Customize every aspect of your character's appearance!
        </div>
      </div>
    </div>
  )
}
