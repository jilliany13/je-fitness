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
    }
  ]

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

      <div className="space-y-3">
        {workoutTypes.map((workout, index) => (
          <button
            key={index}
            onClick={() => onWorkoutTypeSelect(workout.label)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${workout.color}`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{workout.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{workout.label}</div>
                <div className="text-sm text-gray-600">{workout.description}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl">→</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WorkoutTypeSelector 