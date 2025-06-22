import { useState } from 'react'
import { useHoverSupport } from './useHoverSupport';
import { realtimeAuthService } from '../services/realtimeAuthService';

const PostRunReflection = ({ 
  workoutType, 
  preRunMood, 
  onComplete, 
  onBackToMood,
  onBackToWorkoutType 
}) => {
  const [postRunMood, setPostRunMood] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const supportsHover = useHoverSupport();

  const moodOptions = [
    { value: 'Much Better', emoji: '😄', description: 'Feeling amazing!' },
    { value: 'Better', emoji: '😊', description: 'Good improvement' },
    { value: 'Same', emoji: '😐', description: 'No change' },
    { value: 'Worse', emoji: '😔', description: 'Feeling down' },
    { value: 'Much Worse', emoji: '😫', description: 'Really tired' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postRunMood) {
      setError('Please select your mood.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workoutData = {
        workoutType,
        preRunMood,
        postRunMood,
        notes: notes.trim(),
        timestamp: new Date().toISOString()
      };

      const success = await realtimeAuthService.saveWorkout(workoutData);
      
      if (success) {
        onComplete();
      } else {
        setError('Failed to save workout. Please try again.');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('An error occurred while saving your workout.');
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutTypeEmoji = (type) => {
    const emojis = {
      'Running': '🏃‍♀️',
      'Gym': '💪',
      'Basketball': '🏀',
      'Volleyball': '🏐',
      'Bowling': '🎳'
    };
    return emojis[type] || '🏃‍♀️';
  };

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
        {moodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setPostRunMood(option.value)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform ${
              postRunMood === option.value
                ? 'border-green-400 bg-green-50 scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
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
              <span className="text-3xl">{option.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{option.value}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
              {postRunMood === option.value && (
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-lg font-semibold text-gray-800 mb-2">
            Any notes about your workout? 📝
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="3"
            placeholder="How did it go? Any highlights or challenges?"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBackToMood}
            className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
          >
            Back to Mood
          </button>
          <button
            type="button"
            onClick={onBackToWorkoutType}
            className="flex-1 bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-500 transition-all duration-200"
          >
            New Workout
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !postRunMood}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Workout'}
        </button>
      </form>
    </div>
  )
}

export default PostRunReflection 