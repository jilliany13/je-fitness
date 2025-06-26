import { useState, useEffect } from 'react'
import { useHoverSupport } from './useHoverSupport';

const RunTimer = ({ mood, workoutType, workoutRecommendation, onComplete, onStop, onStopAndReturnHome }) => {
  const supportsHover = useHoverSupport();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customWorkoutSteps, setCustomWorkoutSteps] = useState('');
  const [useCustomWorkout, setUseCustomWorkout] = useState(false);
  
  // Helper function to conditionally apply hover classes
  const getButtonClasses = (baseClasses, hoverClasses) => {
    return `${baseClasses} ${supportsHover ? hoverClasses : ''}`;
  };

  const getMotivationalMessage = (workoutType, mood) => {
    const messages = {
      'Gym': {
        'Meh': 'Small steps lead to big changes! 💪',
        'Good': 'Push through, you\'ll feel amazing after! 🔥',
        'Energized': 'You\'re in the zone, keep it up! ⚡',
        'Fired Up': 'Crushing it! Your future self thanks you! 💯'
      },
      'Running': {
        'Meh': 'Every step counts, you\'re doing great! 🏃‍♀️',
        'Good': 'Find your rhythm and keep moving! 🎵',
        'Energized': 'You\'re flying! Keep that pace! ✈️',
        'Fired Up': 'Speed demon! You\'re on fire! 🔥'
      },
      'Basketball': {
        'Meh': 'Dribble your way to energy! 🏀',
        'Good': 'Shoot for greatness! 🎯',
        'Energized': 'You\'re in the zone, nothing but net! 🏀',
        'Fired Up': 'Dunk on your doubts! 💪'
      },
      'Volleyball': {
        'Meh': 'Serve up some energy! 🏐',
        'Good': 'Spike your way to feeling great! 💥',
        'Energized': 'You\'re setting up for success! 🏐',
        'Fired Up': 'Block out negativity! 🛡️'
      },
      'Bowling': {
        'Meh': 'Roll your way to feeling better! 🎳',
        'Good': 'Strike out those bad vibes! ⚡',
        'Energized': 'You\'re on a roll! 🎳',
        'Fired Up': 'Spare no effort! 💪'
      },
      'Soccer': {
        'Meh': 'Kick your way to energy! ⚽',
        'Good': 'Score some goals and feel great! 🥅',
        'Energized': 'You\'re dribbling through life! ⚽',
        'Fired Up': 'Strike with power! 💥'
      },
      'Tennis': {
        'Meh': 'Serve your way to energy! 🎾',
        'Good': 'Rally for greatness! 🎾',
        'Energized': 'You\'re in the zone, ace it! 🎾',
        'Fired Up': 'Smash through barriers! 💪'
      },
      'Table Tennis': {
        'Meh': 'Ping your way to energy! 🏓',
        'Good': 'Pong for greatness! 🏓',
        'Energized': 'You\'re in the zone, spin it! 🏓',
        'Fired Up': 'Smash through limits! 💪'
      },
      'Badminton': {
        'Meh': 'Shuttle your way to energy! 🏸',
        'Good': 'Smash for greatness! 🏸',
        'Energized': 'You\'re in the zone, drop it! 🏸',
        'Fired Up': 'Clear through obstacles! 💪'
      },
      'Swimming': {
        'Meh': 'Swim your way to energy! 🏊‍♂️',
        'Good': 'Dive into greatness! 🏊‍♂️',
        'Energized': 'You\'re in the zone, stroke it! 🏊‍♂️',
        'Fired Up': 'Splash through limits! 💪'
      },
      'Cycling': {
        'Meh': 'Pedal your way to energy! 🚴‍♂️',
        'Good': 'Ride to greatness! 🚴‍♂️',
        'Energized': 'You\'re in the zone, spin it! 🚴‍♂️',
        'Fired Up': 'Race through life! 💨'
      },
      'Yoga': {
        'Meh': 'Flow your way to peace! 🧘‍♀️',
        'Good': 'Stretch into greatness! 🧘‍♀️',
        'Energized': 'You\'re in the zone, breathe! 🧘‍♀️',
        'Fired Up': 'Find your inner strength! 💪'
      },
      'Boxing': {
        'Meh': 'Jab your way to energy! 🥊',
        'Good': 'Punch for greatness! 🥊',
        'Energized': 'You\'re in the zone, hook it! 🥊',
        'Fired Up': 'Knock out your limits! 💥'
      },
      'Walking': {
        'Meh': 'Step your way to energy! 🚶‍♀️',
        'Good': 'Walk to greatness! 🚶‍♀️',
        'Energized': 'You\'re in the zone, stride it! 🚶‍♀️',
        'Fired Up': 'March through life! 💪'
      },
      'CrossFit': {
        'Meh': 'WOD your way to energy! 🏋️‍♀️',
        'Good': 'Lift for greatness! 🏋️‍♀️',
        'Energized': 'You\'re in the zone, crush it! 🏋️‍♀️',
        'Fired Up': 'Dominate your limits! 💪'
      }
    }
    return messages[workoutType]?.[mood] || 'Keep going! You\'ve got this! 💪'
  }

  const getWorkoutEmoji = (type) => {
    const emojis = {
      'Gym': '🏋️‍♂️',
      'Running': '🏃‍♂️',
      'Basketball': '🏀',
      'Swimming': '🏊‍♂️',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Boxing': '🥊',
      'Bowling': '🎳',
      'Yoga': '🧘‍♀️',
      'Soccer': '⚽',
      'Table Tennis': '🏓',
      'Cycling': '🚴‍♂️',
      'Badminton': '🏸',
      'Walking': '🚶‍♀️',
      'CrossFit': '🏋️‍♀️'
    };
    return emojis[type] || '💪';
  };

  const handleComplete = () => {
    const isCustomWorkoutType = !workoutRecommendation || workoutRecommendation === 'Custom workout based on your mood';
    const finalWorkoutData = {
      workoutRecommendation: workoutRecommendation,
      customWorkoutSteps: (isCustomWorkoutType || useCustomWorkout) ? customWorkoutSteps : null
    };
    onComplete(finalWorkoutData);
  };

  const handleUseCustomWorkout = () => {
    setUseCustomWorkout(true);
    setShowCustomInput(true);
  };

  const handleUseRecommendedWorkout = () => {
    setUseCustomWorkout(false);
    setShowCustomInput(false);
  };

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {workoutType} {getWorkoutEmoji(workoutType)}
        </h2>
        <p className="text-gray-600 mb-3">
          {getMotivationalMessage(workoutType, mood)}
        </p>
        
        {/* For custom workout types, show only custom input */}
        {!workoutRecommendation || workoutRecommendation === 'Custom workout based on your mood' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label htmlFor="customWorkout" className="block text-sm font-medium text-gray-700 mb-2">
              Your Custom Workout Steps:
            </label>
            <textarea
              id="customWorkout"
              value={customWorkoutSteps}
              onChange={(e) => setCustomWorkoutSteps(e.target.value)}
              placeholder="Enter your custom workout steps here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe the exercises, sets, reps, or activities you want to do
            </p>
          </div>
        ) : (
          <>
            {/* Workout Recommendation */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Recommended Workout:</p>
              <p className="text-base text-gray-600">{workoutRecommendation}</p>
            </div>

            {/* Custom Workout Options */}
            <div className="space-y-3">
              <button
                onClick={handleUseRecommendedWorkout}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  !useCustomWorkout 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
                }`}
              >
                ✅ Use Recommended Workout
              </button>
              
              <button
                onClick={handleUseCustomWorkout}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  useCustomWorkout 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
                }`}
              >
                ✏️ Create Custom Workout
              </button>
            </div>

            {/* Custom Workout Input */}
            {showCustomInput && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label htmlFor="customWorkout" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Custom Workout Steps:
                </label>
                <textarea
                  id="customWorkout"
                  value={customWorkoutSteps}
                  onChange={(e) => setCustomWorkoutSteps(e.target.value)}
                  placeholder="Enter your custom workout steps here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Describe the exercises, sets, reps, or activities you want to do
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="relative">
        <div className="w-48 h-48 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl animate-pulse mb-2">
              {getWorkoutEmoji(workoutType)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleComplete}
          disabled={(!workoutRecommendation || workoutRecommendation === 'Custom workout based on your mood') ? !customWorkoutSteps.trim() : (useCustomWorkout && !customWorkoutSteps.trim())}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 ${
            (!workoutRecommendation || workoutRecommendation === 'Custom workout based on your mood') ? !customWorkoutSteps.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
            : (useCustomWorkout && !customWorkoutSteps.trim())
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          ✅ Workout Completed
        </button>
        
        <button
          onClick={onStopAndReturnHome}
          className={getButtonClasses(
            "w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
            "hover:bg-red-600"
          )}
        >
          Stop Workout
        </button>
      </div>
    </div>
  );
};

export default RunTimer; 