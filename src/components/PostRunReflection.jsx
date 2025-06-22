import { useState } from 'react'
import { useHoverSupport } from './useHoverSupport';

const PostRunReflection = ({ preRunMood, onComplete }) => {
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const supportsHover = useHoverSupport();

  const postRunMoods = [
    {
      emoji: '😴',
      label: 'Tired',
      description: 'Need rest'
    },
    {
      emoji: '😐',
      label: 'Same',
      description: 'No change'
    },
    {
      emoji: '😊',
      label: 'Better',
      description: 'Feeling good'
    },
    {
      emoji: '💪',
      label: 'Energized',
      description: 'Ready for more!'
    }
  ]

  const handleMoodSelect = (moodLabel) => {
    setSelectedMood(moodLabel)
    setShowCelebration(true)
    
    // Show celebration for 1.5 seconds before completing
    setTimeout(() => {
      onComplete(moodLabel)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Great job! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          You started feeling "{preRunMood}" and completed your run.
        </p>
        <p className="text-lg font-semibold text-gray-800">
          How do you feel now?
        </p>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center space-y-4">
            <div className="text-8xl animate-bounce">🎉</div>
            <div className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</div>
            <div className="text-7xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>🏆</div>
            <div className="text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>💪</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {postRunMoods.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(mood.label)}
            disabled={showCelebration}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform ${
              selectedMood === mood.label 
                ? 'border-green-400 bg-green-50 scale-105' 
                : `border-gray-200 ${supportsHover ? 'hover:border-blue-300 hover:bg-blue-50 hover:scale-105' : ''}`
            } ${showCelebration ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              outline: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
            onTouchStart={(e) => e.preventDefault()}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{mood.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{mood.label}</div>
                <div className="text-sm text-gray-600">{mood.description}</div>
              </div>
              {selectedMood === mood.label && (
                <div className="text-2xl animate-pulse">✅</div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Your run has been logged! Keep up the great work! 💪
        </p>
      </div>
    </div>
  )
}

export default PostRunReflection 