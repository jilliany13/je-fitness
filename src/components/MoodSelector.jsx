const MoodSelector = ({ onMoodSelect, workoutType, onReturnHome }) => {
  const getWorkoutRecommendations = (mood, workoutType) => {
    const recommendations = {
      'Low Energy': {
        'Gym': '10 min treadmill walk, 3 sets of 10 bodyweight squats, 2 sets of 5 push-ups, 5 min stretching',
        'Running': '5-10 min walk, light jogging, gentle stretching',
        'Basketball': 'Light dribbling drills, shooting practice, gentle warm-up',
        'Volleyball': 'Light passing drills, gentle serving practice, warm-up stretches',
        'Bowling': 'Light practice throws, focus on form and grip, gentle wrist stretches, 2-3 games with breaks, practice spares, focus on accuracy over power'
      },
      'Meh': {
        'Gym': '15 min elliptical, 3x10 leg press, 3x8 lat pulldowns, 3x10 shoulder press, 2x10 bicep curls, 5 min stretching',
        'Running': '15 min steady pace run, interval walking',
        'Basketball': 'Shooting drills, light scrimmage, ball handling practice',
        'Volleyball': 'Passing drills, serving practice, light team drills',
        'Bowling': 'Practice spares and splits, focus on accuracy and consistency, 3-4 games, work on approach and release technique, practice different oil patterns, light stretching between games'
      },
      'Feeling Good': {
        'Gym': '20 min cardio, 4x8 bench press, 4x10 leg press, 3x10 lat pulldowns, 3x12 shoulder press, 3x15 bicep curls, 3x10 leg extensions',
        'Running': '20 min run with intervals, hill training',
        'Basketball': 'Full court drills, shooting practice, defensive work',
        'Volleyball': 'Full court drills, serving practice, blocking drills, team scrimmage',
        'Bowling': 'Full game practice, focus on strikes and spares, 4-5 games, work on hook shots and curve balls, practice spare conversions, focus on lane reading and oil pattern adjustment, moderate intensity with strategic breaks'
      },
      'Energized': {
        'Gym': '30 min intense cardio, 5x5 heavy bench press, 5x8 heavy leg press, 4x10 lat pulldowns, 4x12 shoulder press, 4x15 bicep curls, 4x12 leg extensions, 3x10 deadlifts',
        'Running': '30 min intense run, sprint intervals, hill repeats',
        'Basketball': 'Intense scrimmage, full court drills, competitive play',
        'Volleyball': 'Intense team scrimmage, advanced serving drills, competitive play',
        'Bowling': 'Competitive practice, focus on advanced techniques, 5 games maximum, work on power shots and strike conversions, practice difficult spare combinations, focus on mental game and pressure situations, high intensity with strategic rest periods'
      },
      'Fired Up': {
        'Gym': '45 min cardio (HIIT), 5x5 heavy bench press, 5x8 heavy leg press, 5x10 lat pulldowns, 5x12 shoulder press, 5x15 bicep curls, 4x8 deadlifts, 4x10 squats',
        'Running': '45 min long distance run, tempo training',
        'Basketball': 'Full game simulation, advanced drills, endurance training',
        'Volleyball': 'Full match simulation, advanced team drills, endurance training',
        'Bowling': 'Tournament-style practice, advanced techniques, 5 games maximum, focus on perfect games and high scores, practice under pressure, work on advanced hook techniques and ball selection, maximum intensity with proper recovery periods'
      }
    }
    return recommendations[mood]?.[workoutType] || 'Custom workout based on your mood'
  }

  const moods = [
    {
      emoji: '😩',
      label: 'Low Energy',
      description: 'Need a gentle boost',
      duration: 7,
      color: 'bg-blue-100 hover:bg-blue-200 border-blue-300'
    },
    {
      emoji: '😐',
      label: 'Meh',
      description: 'Could use some movement',
      duration: 15,
      color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300'
    },
    {
      emoji: '😊',
      label: 'Feeling Good',
      description: 'Ready for a solid workout',
      duration: 20,
      color: 'bg-green-100 hover:bg-green-200 border-green-300'
    },
    {
      emoji: '⚡',
      label: 'Energized',
      description: 'Feeling pumped up',
      duration: 30,
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-300'
    },
    {
      emoji: '🔥',
      label: 'Fired Up',
      description: 'Full power mode',
      duration: 45,
      color: 'bg-red-100 hover:bg-red-200 border-red-300'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Back button positioned above title */}
      <div className="flex justify-start">
        <button
          onClick={onReturnHome}
          className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-300 transition-all duration-200 text-sm font-medium"
          title="Return to Main Page"
        >
          <span className="text-sm">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Title section - full width, no interference */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          How are you feeling today?
        </h2>
        <p className="text-gray-600 mb-2">
          Choose your mood and we'll set the perfect {workoutType.toLowerCase()} workout
        </p>
        <div className="text-sm text-gray-500">
          Selected: <span className="font-semibold">{workoutType}</span>
        </div>
      </div>

      <div className="space-y-3">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => onMoodSelect(mood.label, mood.duration, getWorkoutRecommendations(mood.label, workoutType))}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${mood.color}`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{mood.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{mood.label}</div>
                <div className="text-sm text-gray-600">{mood.description}</div>
              </div>
              {(workoutType === 'Running') && (
                <div className="text-right">
                  <div className="font-bold text-gray-800">{mood.duration}m</div>
                  <div className="text-xs text-gray-500">workout</div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector 