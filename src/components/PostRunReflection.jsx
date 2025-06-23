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

  // Check if user is logged in
  const isLoggedIn = realtimeAuthService.getCurrentUser() !== null;

  const moodOptions = [
    { value: 'Much Better', emoji: '😄', description: 'Feeling amazing!', color: 'green' },
    { value: 'Better', emoji: '😊', description: 'Good improvement', color: 'blue' },
    { value: 'Same', emoji: '😐', description: 'No change', color: 'yellow' },
    { value: 'Worse', emoji: '😔', description: 'Feeling down', color: 'orange' }
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
        onComplete('dashboard');
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

  const handleCancel = () => {
    // Go back to workout type selection
    onBackToWorkoutType();
  };

  const getMoodButtonClasses = (mood, isSelected) => {
    const baseClasses = 'w-full p-4 rounded-xl border-2 transition-all duration-200 transform';
    
    if (isSelected) {
      const colorClasses = {
        'green': 'border-green-500 bg-green-100 scale-105 shadow-lg',
        'blue': 'border-blue-500 bg-blue-100 scale-105 shadow-lg',
        'yellow': 'border-yellow-500 bg-yellow-100 scale-105 shadow-lg',
        'orange': 'border-orange-500 bg-orange-100 scale-105 shadow-lg'
      };
      return `${baseClasses} ${colorClasses[mood.color]}`;
    } else {
      const defaultClasses = {
        'green': 'border-green-300 bg-green-50 hover:border-green-400 hover:bg-green-100',
        'blue': 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100',
        'yellow': 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100',
        'orange': 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
      };
      return `${baseClasses} ${defaultClasses[mood.color]}`;
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
            className={getMoodButtonClasses(option, postRunMood === option.value)}
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

        {/* Sign up message for non-logged in users */}
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-700">
              💡 Sign up to save your workout history and track your progress!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !postRunMood || !isLoggedIn}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostRunReflection 