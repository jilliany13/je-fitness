const StreakTracker = ({ streak }) => {
  if (streak === 0) {
    return (
      <div className="text-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full">
          <span className="text-white text-sm font-medium">
            🚀 Start your running streak today!
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full">
        <span className="text-white text-sm font-medium">
          🔥 {streak} day{streak > 1 ? 's' : ''} streak!
        </span>
      </div>
    </div>
  )
}

export default StreakTracker 