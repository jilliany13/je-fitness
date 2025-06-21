import { useState, useEffect } from 'react'

const RunTimer = ({ duration, mood, onComplete, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert to seconds
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Running for {mood} 🏃‍♂️
        </h2>
        <p className="text-gray-600">
          Keep going! You've got this!
        </p>
      </div>

      <div className="relative">
        <div className="w-48 h-48 mx-auto rounded-full border-8 border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">
              remaining
            </div>
          </div>
        </div>
        
        {/* Progress ring */}
        <div className="absolute inset-0 w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onStop}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Stop Run
        </button>
        
        <div className="text-sm text-gray-500">
          {isRunning ? 'Timer is running...' : 'Run completed!'}
        </div>
      </div>
    </div>
  )
}

export default RunTimer 