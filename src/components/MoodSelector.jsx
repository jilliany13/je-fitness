import { useHoverSupport } from './useHoverSupport';

const MoodSelector = ({ onMoodSelect, workoutType, onReturnHome }) => {
  const supportsHover = useHoverSupport();
  
  const getWorkoutRecommendations = (mood, workoutType) => {
    const recommendations = {
      'Meh': {
        'Gym': '10 min treadmill walk, 3 sets of 10 bodyweight squats, 2 sets of 5 push-ups, 5 min stretching',
        'Running': '5-10 min walk, light jogging, gentle stretching',
        'Basketball': 'Light dribbling drills, shooting practice, gentle warm-up',
        'Volleyball': 'Light passing drills, gentle serving practice, warm-up stretches',
        'Bowling': 'Light practice throws, focus on form and grip, gentle wrist stretches, 2-3 games with breaks, practice spares, focus on accuracy over power',
        'Soccer': 'Light dribbling drills, passing practice, gentle warm-up, 10-15 min light jogging',
        'Tennis': 'Light hitting drills, footwork practice, gentle warm-up, focus on form',
        'Table Tennis': 'Light rally practice, footwork drills, gentle warm-up, focus on control',
        'Badminton': 'Light hitting drills, footwork practice, gentle warm-up, focus on technique',
        'Swimming': '10-15 min light swimming, focus on form, gentle strokes, warm-up laps',
        'Cycling': '15-20 min light cycling, gentle pace, focus on form and breathing',
        'Yoga': 'Gentle stretching, basic poses, 15-20 min session, focus on breathing',
        'Boxing': 'Light shadow boxing, footwork drills, gentle warm-up, focus on form',
        'Walking': '20-30 min gentle walk, focus on posture and breathing',
        'CrossFit': 'Light bodyweight exercises, 10-15 min session, focus on form over intensity'
      },
      'Feeling Good': {
        'Gym': '15 min elliptical, 3x10 leg press, 3x8 lat pulldowns, 3x10 shoulder press, 2x10 bicep curls, 5 min stretching',
        'Running': '15 min steady pace run, interval walking',
        'Basketball': 'Shooting drills, light scrimmage, ball handling practice',
        'Volleyball': 'Passing drills, serving practice, light team drills',
        'Bowling': 'Practice spares and splits, focus on accuracy and consistency, 3-4 games, work on approach and release technique, practice different oil patterns, light stretching between games',
        'Soccer': 'Passing drills, shooting practice, light scrimmage, 20-25 min moderate play',
        'Tennis': 'Rally practice, serving drills, footwork training, moderate intensity',
        'Table Tennis': 'Rally practice, serving drills, footwork training, moderate intensity',
        'Badminton': 'Rally practice, serving drills, footwork training, moderate intensity',
        'Swimming': '20-25 min moderate swimming, different strokes, interval training',
        'Cycling': '25-30 min moderate cycling, hill training, interval sprints',
        'Yoga': 'Moderate flow, 25-30 min session, balance poses, strength building',
        'Boxing': 'Heavy bag work, mitt work, footwork drills, moderate intensity',
        'Walking': '30-40 min brisk walk, include some hills, focus on pace',
        'CrossFit': 'Moderate intensity WOD, 20-25 min session, mix of cardio and strength'
      },
      'Energized': {
        'Gym': '20 min cardio, 4x8 bench press, 4x10 leg press, 3x10 lat pulldowns, 3x12 shoulder press, 3x15 bicep curls, 3x10 leg extensions',
        'Running': '20 min run with intervals, hill training',
        'Basketball': 'Full court drills, shooting practice, defensive work',
        'Volleyball': 'Full court drills, serving practice, blocking drills, team scrimmage',
        'Bowling': 'Full game practice, focus on strikes and spares, 4-5 games, work on hook shots and curve balls, practice spare conversions, focus on lane reading and oil pattern adjustment, moderate intensity with strategic breaks',
        'Soccer': 'Full field drills, shooting practice, tactical training, 30-35 min intense play',
        'Tennis': 'Match play, advanced drills, tactical training, high intensity',
        'Table Tennis': 'Match play, advanced drills, tactical training, high intensity',
        'Badminton': 'Match play, advanced drills, tactical training, high intensity',
        'Swimming': '30-35 min intense swimming, interval training, different strokes',
        'Cycling': '35-40 min intense cycling, hill repeats, sprint intervals',
        'Yoga': 'Power yoga, 30-35 min session, advanced poses, strength building',
        'Boxing': 'Intense sparring, heavy bag work, mitt work, high intensity',
        'Walking': '40-50 min power walk, include hills and intervals',
        'CrossFit': 'High intensity WOD, 30-35 min session, complex movements'
      },
      'Fired Up': {
        'Gym': '45 min cardio (HIIT), 5x5 heavy bench press, 5x8 heavy leg press, 5x10 lat pulldowns, 5x12 shoulder press, 5x15 bicep curls, 4x8 deadlifts, 4x10 squats',
        'Running': '45 min long distance run, tempo training',
        'Basketball': 'Full game simulation, advanced drills, endurance training',
        'Volleyball': 'Full match simulation, advanced team drills, endurance training',
        'Bowling': 'Tournament-style practice, advanced techniques, 5 games maximum, focus on perfect games and high scores, practice under pressure, work on advanced hook techniques and ball selection, maximum intensity with proper recovery periods',
        'Soccer': 'Full match simulation, advanced tactical training, endurance work, 45-50 min intense play',
        'Tennis': 'Tournament-style play, advanced tactical training, endurance work',
        'Table Tennis': 'Tournament-style play, advanced tactical training, endurance work',
        'Badminton': 'Tournament-style play, advanced tactical training, endurance work',
        'Swimming': '45-50 min intense swimming, advanced interval training, all strokes',
        'Cycling': '50-60 min intense cycling, advanced hill training, sprint work',
        'Yoga': 'Advanced power yoga, 45-50 min session, complex sequences, maximum challenge',
        'Boxing': 'Full sparring session, advanced combinations, endurance training',
        'Walking': '60+ min power walk, challenging terrain, maximum pace',
        'CrossFit': 'Maximum intensity WOD, 45-50 min session, advanced movements'
      }
    }
    return recommendations[mood]?.[workoutType] || 'Custom workout based on your mood'
  }

  const moods = [
    {
      emoji: '😐',
      label: 'Meh',
      description: 'Could use some movement',
      baseColor: 'bg-yellow-100 border-yellow-300',
      hoverColor: 'hover:bg-yellow-200'
    },
    {
      emoji: '😊',
      label: 'Feeling Good',
      description: 'Ready for a solid workout',
      baseColor: 'bg-green-100 border-green-300',
      hoverColor: 'hover:bg-green-200'
    },
    {
      emoji: '⚡',
      label: 'Energized',
      description: 'Feeling pumped up',
      baseColor: 'bg-purple-100 border-purple-300',
      hoverColor: 'hover:bg-purple-200'
    },
    {
      emoji: '🔥',
      label: 'Fired Up',
      description: 'Full power mode',
      baseColor: 'bg-red-100 border-red-300',
      hoverColor: 'hover:bg-red-200'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Back button positioned above title */}
      <div className="flex justify-start">
        <button
          onClick={onReturnHome}
          className={`flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 transition-all duration-200 text-sm font-medium ${
            supportsHover ? 'hover:bg-gray-200 hover:text-gray-900' : ''
          }`}
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
        <div className="text-sm text-gray-500">
          Selected: <span className="font-semibold">{workoutType}</span>
        </div>
      </div>

      <div className="space-y-3">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => onMoodSelect(mood.label, getWorkoutRecommendations(mood.label, workoutType))}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform ${
              supportsHover ? 'hover:scale-105 ' + mood.hoverColor : ''
            } ${mood.baseColor}`}
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
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector 