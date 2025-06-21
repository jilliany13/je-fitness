const PostRunReflection = ({ preRunMood, onComplete }) => {
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
      emoji: '🤩',
      label: 'Amazing',
      description: 'Fantastic!'
    },
    {
      emoji: '💪',
      label: 'Energized',
      description: 'Ready for more!'
    }
  ]

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

      <div className="space-y-3">
        {postRunMoods.map((mood, index) => (
          <button
            key={index}
            onClick={() => onComplete(mood.label)}
            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
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

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Your run has been logged! Keep up the great work! 💪
        </p>
      </div>
    </div>
  )
}

export default PostRunReflection 