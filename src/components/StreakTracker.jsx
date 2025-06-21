const StreakTracker = ({ streak }) => {
  if (streak === 0) {
    return (
      <div className="text-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full">
          <span className="text-white text-sm font-medium">
             Brought to you by the creators of J&E Bracelets!
            {/* You can change this to:
            🏃‍♂️ Ready to start running?
            💪 Begin your fitness journey!
            ⭐ First run of the day!
            🎯 Time to get moving!
            */}
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
          {/* You can change this to:
          🏆 {streak} day{streak > 1 ? 's' : ''} in a row!
          💪 {streak} day{streak > 1 ? 's' : ''} strong!
          ⭐ {streak} day{streak > 1 ? 's' : ''} streak!
          🎯 {streak} day{streak > 1 ? 's' : ''} running!
          */}
        </span>
      </div>
    </div>
  )
}

export default StreakTracker 