const WorkoutTypeSelector = ({ onWorkoutTypeSelect }) => {
  const workoutTypes = [
    {
      emoji: '🏋️‍♂️',
      label: 'Gym',
      description: 'Strength training & machines',
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-300'
    },
    {
      emoji: '🏃‍♂️',
      label: 'Running',
      description: 'Cardio & outdoor running',
      color: 'bg-green-100 hover:bg-green-200 border-green-300'
    },
    {
      emoji: '🏀',
      label: 'Basketball',
      description: 'Court sports & drills',
      color: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
    },
    {
      emoji: '🏊‍♂️',
      label: 'Swimming',
      description: 'Water sports & cardio',
      color: 'bg-cyan-100 hover:bg-cyan-200 border-cyan-300'
    },
    {
      emoji: '🎾',
      label: 'Tennis',
      description: 'Racket sports & agility',
      color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300'
    },
    {
      emoji: '🏐',
      label: 'Volleyball',
      description: 'Court sports & team drills',
      color: 'bg-blue-100 hover:bg-blue-200 border-blue-300'
    },
    {
      emoji: '🥊',
      label: 'Boxing',
      description: 'Combat sports & strength',
      color: 'bg-red-100 hover:bg-red-200 border-red-300'
    },
    {
      emoji: '🎳',
      label: 'Bowling',
      description: 'Lane sports & precision',
      color: 'bg-teal-100 hover:bg-teal-200 border-teal-300'
    },
    {
      emoji: '🧘‍♀️',
      label: 'Yoga',
      description: 'Mind-body wellness',
      color: 'bg-rose-100 hover:bg-rose-200 border-rose-300'
    },
    {
      emoji: '⚽',
      label: 'Soccer',
      description: 'Field sports & team play',
      color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300'
    },
    {
      emoji: '🏓',
      label: 'Table Tennis',
      description: 'Indoor racket sports',
      color: 'bg-pink-100 hover:bg-pink-200 border-pink-300'
    },
    {
      emoji: '🚴‍♂️',
      label: 'Cycling',
      description: 'Outdoor cardio & endurance',
      color: 'bg-lime-100 hover:bg-lime-200 border-lime-300'
    },
    {
      emoji: '🏸',
      label: 'Badminton',
      description: 'Racket sports & reflexes',
      color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300'
    },
    {
      emoji: '🏃‍♀️',
      label: 'Walking',
      description: 'Low-impact cardio',
      color: 'bg-slate-100 hover:bg-slate-200 border-slate-300'
    },
    {
      emoji: '🏋️‍♀️',
      label: 'CrossFit',
      description: 'High-intensity training',
      color: 'bg-amber-100 hover:bg-amber-200 border-amber-300'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Workout Type
        </h2>
        <p className="text-gray-600">
          Select the type of workout you want to do today
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {workoutTypes.map((workout, index) => (
          <button
            key={index}
            onClick={() => onWorkoutTypeSelect(workout.label)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-103 ${workout.color}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{workout.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{workout.label}</div>
                <div className="text-sm text-gray-600">{workout.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WorkoutTypeSelector 