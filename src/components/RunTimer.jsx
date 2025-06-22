import { useState, useEffect } from 'react'
import { useHoverSupport } from './useHoverSupport';

const RunTimer = ({ duration, mood, workoutType, workoutRecommendation, onComplete, onStop, onStopAndReturnHome }) => {
  const supportsHover = useHoverSupport();
  
  // Helper function to conditionally apply hover classes
  const getButtonClasses = (baseClasses, hoverClasses) => {
    return `${baseClasses} ${supportsHover ? hoverClasses : ''}`;
  };

  const getMotivationalMessage = (workoutType, mood) => {
    const messages = {
      'Gym': {
        'Meh': 'Small steps lead to big changes! 💪',
        'Feeling Good': 'Push through, you\'ll feel amazing after! 🔥',
        'Energized': 'You\'re in the zone, keep it up! ⚡',
        'Fired Up': 'Crushing it! Your future self thanks you! 💯'
      },
      'Running': {
        'Meh': 'Every step counts, you\'re doing great! 🏃‍♀️',
        'Feeling Good': 'Find your rhythm and keep moving! 🎵',
        'Energized': 'You\'re flying! Keep that pace! ✈️',
        'Fired Up': 'Speed demon! You\'re on fire! 🔥'
      },
      'Basketball': {
        'Meh': 'Dribble your way to energy! 🏀',
        'Feeling Good': 'Shoot for greatness! 🎯',
        'Energized': 'You\'re in the zone, nothing but net! 🏀',
        'Fired Up': 'Dunk on your doubts! 💪'
      },
      'Volleyball': {
        'Meh': 'Serve up some energy! 🏐',
        'Feeling Good': 'Spike your way to feeling great! 💥',
        'Energized': 'You\'re setting up for success! 🏐',
        'Fired Up': 'Block out negativity! 🛡️'
      },
      'Bowling': {
        'Meh': 'Roll your way to feeling better! 🎳',
        'Feeling Good': 'Strike out those bad vibes! ⚡',
        'Energized': 'You\'re on a roll! 🎳',
        'Fired Up': 'Spare no effort! 💪'
      },
      'Soccer': {
        'Meh': 'Kick your way to energy! ⚽',
        'Feeling Good': 'Score some goals and feel great! 🥅',
        'Energized': 'You\'re dribbling through life! ⚽',
        'Fired Up': 'Strike with power! 💥'
      },
      'Tennis': {
        'Meh': 'Serve your way to energy! 🎾',
        'Feeling Good': 'Rally for greatness! 🎾',
        'Energized': 'You\'re in the zone, ace it! 🎾',
        'Fired Up': 'Smash through barriers! 💪'
      },
      'Table Tennis': {
        'Meh': 'Ping your way to energy! 🏓',
        'Feeling Good': 'Pong for greatness! 🏓',
        'Energized': 'You\'re in the zone, spin it! 🏓',
        'Fired Up': 'Smash through limits! 💪'
      },
      'Badminton': {
        'Meh': 'Shuttle your way to energy! 🏸',
        'Feeling Good': 'Smash for greatness! 🏸',
        'Energized': 'You\'re in the zone, drop it! 🏸',
        'Fired Up': 'Clear through obstacles! 💪'
      },
      'Swimming': {
        'Meh': 'Swim your way to energy! 🏊‍♂️',
        'Feeling Good': 'Dive into greatness! 🏊‍♂️',
        'Energized': 'You\'re in the zone, stroke it! 🏊‍♂️',
        'Fired Up': 'Splash through limits! 💪'
      },
      'Cycling': {
        'Meh': 'Pedal your way to energy! 🚴‍♂️',
        'Feeling Good': 'Ride to greatness! 🚴‍♂️',
        'Energized': 'You\'re in the zone, spin it! 🚴‍♂️',
        'Fired Up': 'Race through life! 💨'
      },
      'Yoga': {
        'Meh': 'Flow your way to peace! 🧘‍♀️',
        'Feeling Good': 'Stretch into greatness! 🧘‍♀️',
        'Energized': 'You\'re in the zone, breathe! 🧘‍♀️',
        'Fired Up': 'Find your inner strength! 💪'
      },
      'Boxing': {
        'Meh': 'Jab your way to energy! 🥊',
        'Feeling Good': 'Punch for greatness! 🥊',
        'Energized': 'You\'re in the zone, hook it! 🥊',
        'Fired Up': 'Knock out your limits! 💥'
      },
      'Walking': {
        'Meh': 'Step your way to energy! 🚶‍♀️',
        'Feeling Good': 'Walk to greatness! 🚶‍♀️',
        'Energized': 'You\'re in the zone, stride it! 🚶‍♀️',
        'Fired Up': 'March through life! 💪'
      },
      'CrossFit': {
        'Meh': 'WOD your way to energy! 🏋️‍♀️',
        'Feeling Good': 'Lift for greatness! 🏋️‍♀️',
        'Energized': 'You\'re in the zone, crush it! 🏋️‍♀️',
        'Fired Up': 'Dominate your limits! 💪'
      }
    }
    return messages[workoutType]?.[mood] || 'Keep going! You\'ve got this! 💪'
  }

  // Basketball workout display
  if (workoutType === 'Basketball') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Basketball Workout for {mood} 🏀
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-2">
                🏀
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Volleyball workout display
  if (workoutType === 'Volleyball') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Volleyball Workout for {mood} 🏐
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center relative">
              {/* Volleyball net */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gray-400 rounded"></div>
              {/* Volleyball going back and forth */}
              <div className="text-6xl animate-pulse">
                🏐
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Gym workout display
  if (workoutType === 'Gym') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Gym Workout for {mood} 🏋️‍♂️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🏋️‍♂️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Bowling workout display
  if (workoutType === 'Bowling') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bowling Workout for {mood} 🎳
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center relative">
              {/* Bowling lane */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-2 bg-amber-600 rounded"></div>
              {/* Bowling ball rolling */}
              <div className="text-6xl animate-bowling-roll">
                🎳
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Soccer workout display
  if (workoutType === 'Soccer') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Soccer Workout for {mood} ⚽
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-2">
                ⚽
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Tennis workout display
  if (workoutType === 'Tennis') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tennis Workout for {mood} 🎾
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-2">
                🎾
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Table Tennis workout display
  if (workoutType === 'Table Tennis') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Table Tennis Workout for {mood} 🏓
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🏓
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Badminton workout display
  if (workoutType === 'Badminton') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Badminton Workout for {mood} 🏸
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-2">
                🏸
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Swimming workout display
  if (workoutType === 'Swimming') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Swimming Workout for {mood} 🏊‍♂️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🏊‍♂️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Cycling workout display
  if (workoutType === 'Cycling') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cycling Workout for {mood} 🚴‍♂️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🚴‍♂️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Yoga workout display
  if (workoutType === 'Yoga') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Yoga Workout for {mood} 🧘‍♀️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🧘‍♀️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Boxing workout display
  if (workoutType === 'Boxing') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Boxing Workout for {mood} 🥊
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-2">
                🥊
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Walking workout display
  if (workoutType === 'Walking') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Walking Workout for {mood} 🚶‍♀️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🚶‍♀️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // CrossFit workout display
  if (workoutType === 'CrossFit') {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            CrossFit Workout for {mood} 🏋️‍♀️
          </h2>
          <p className="text-gray-600 mb-3">
            {getMotivationalMessage(workoutType, mood)}
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
            <p className="text-base text-gray-600">{workoutRecommendation}</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl animate-pulse mb-2">
                🏋️‍♀️
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onComplete}
            className={getButtonClasses(
              "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
              "hover:bg-green-600"
            )}
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
    )
  }

  // Running workout display (fallback)
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {workoutType} Workout for {mood} 💪
        </h2>
        <p className="text-gray-600 mb-3">
          {getMotivationalMessage(workoutType, mood)}
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 font-medium">Today's Workout:</p>
          <p className="text-base text-gray-600">{workoutRecommendation}</p>
        </div>
      </div>

      <div className="relative">
        <div className="w-48 h-48 mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl animate-pulse mb-2">
              💪
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onComplete}
          className={getButtonClasses(
            "w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200",
            "hover:bg-green-600"
          )}
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
  )
}

export default RunTimer 