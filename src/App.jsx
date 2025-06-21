import { useState, useEffect } from 'react'
import MoodSelector from './components/MoodSelector'
import RunTimer from './components/RunTimer'
import PostRunReflection from './components/PostRunReflection'
import StreakTracker from './components/StreakTracker'
import Confetti from './components/Confetti'

function App() {
  const [currentView, setCurrentView] = useState('mood-selector') // mood-selector, timer, reflection
  const [selectedMood, setSelectedMood] = useState(null)
  const [runDuration, setRunDuration] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load streak from localStorage on component mount
  useEffect(() => {
    const savedStreak = localStorage.getItem('moodRunStreak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }
  }, [])

  const handleMoodSelect = (mood, duration) => {
    setSelectedMood(mood)
    setRunDuration(duration)
    setCurrentView('timer')
  }

  const handleTimerComplete = () => {
    setCurrentView('reflection')
  }

  const handleReflectionComplete = (postRunMood) => {
    // Save run data to localStorage
    const today = new Date().toDateString()
    const runData = {
      date: today,
      preRunMood: selectedMood,
      postRunMood: postRunMood,
      duration: runDuration
    }
    
    const existingRuns = JSON.parse(localStorage.getItem('moodRunHistory') || '[]')
    existingRuns.push(runData)
    localStorage.setItem('moodRunHistory', JSON.stringify(existingRuns))

    // Update streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()
    
    const lastRunDate = localStorage.getItem('lastRunDate')
    let newStreak = streak
    
    if (lastRunDate === today) {
      // Already ran today, don't increment streak
    } else if (lastRunDate === yesterdayString) {
      // Ran yesterday, increment streak
      newStreak = streak + 1
    } else if (lastRunDate !== today) {
      // Didn't run yesterday, reset streak to 1
      newStreak = 1
    }
    
    setStreak(newStreak)
    localStorage.setItem('moodRunStreak', newStreak.toString())
    localStorage.setItem('lastRunDate', today)

    // Show confetti
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    // Reset to mood selector
    setTimeout(() => {
      setCurrentView('mood-selector')
      setSelectedMood(null)
      setRunDuration(0)
    }, 3000)
  }

  const handleStopRun = () => {
    setCurrentView('mood-selector')
    setSelectedMood(null)
    setRunDuration(0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showConfetti && <Confetti />}
      
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          👟 J&E Fitness 🤩
          {/* You can change this to:
          🏃‍♀️ J&E Fitness
          💪 Mood Workout
          ⚡ Energy Run
          🎯 Feel Good Run
          🌟 Wellness Run
          🚀 Mood Movement
          */}
        </h1>
        <p className="text-white text-center mb-8 opacity-90">
          Run based on how you feel
        </p>

        <StreakTracker streak={streak} />

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {currentView === 'mood-selector' && (
            <MoodSelector onMoodSelect={handleMoodSelect} />
          )}
          
          {currentView === 'timer' && (
            <RunTimer 
              duration={runDuration}
              mood={selectedMood}
              onComplete={handleTimerComplete}
              onStop={handleStopRun}
            />
          )}
          
          {currentView === 'reflection' && (
            <PostRunReflection 
              preRunMood={selectedMood}
              onComplete={handleReflectionComplete}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App 