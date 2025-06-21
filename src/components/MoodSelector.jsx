const MoodSelector = ({ onMoodSelect }) => {
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
      description: 'Ready for a solid run',
      duration: 20,
      color: 'bg-green-100 hover:bg-green-200 border-green-300'
    },
    {
      emoji: '🔥',
      label: 'Fired Up',
      description: 'Let\'s crush this!',
      duration: 30,
      color: 'bg-red-100 hover:bg-red-200 border-red-300'
    },
    {
      emoji: '⚡',
      label: 'Energized',
      description: 'Full power mode',
      duration: 45,
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-300'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          How are you feeling today?
        </h2>
        <p className="text-gray-600">
          Choose your mood and we'll set the perfect run duration
        </p>
      </div>

      <div className="space-y-3">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => onMoodSelect(mood.label, mood.duration)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${mood.color}`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{mood.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{mood.label}</div>
                <div className="text-sm text-gray-600">{mood.description}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{mood.duration}m</div>
                <div className="text-xs text-gray-500">run</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector 