import { useState, useEffect } from 'react'
import WorkoutTypeSelector from './components/WorkoutTypeSelector'
import MoodSelector from './components/MoodSelector'
import RunTimer from './components/RunTimer'
import PostRunReflection from './components/PostRunReflection'
// import StreakTracker from './components/StreakTracker'

function App() {
  const [currentView, setCurrentView] = useState('workout-selector') // workout-selector, mood-selector, timer, reflection
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [runDuration, setRunDuration] = useState(0)
  const [workoutRecommendation, setWorkoutRecommendation] = useState('')
  // const [streak, setStreak] = useState(0)

  // Load streak from localStorage on component mount
  // useEffect(() => {
  //   const savedStreak = localStorage.getItem('moodRunStreak')
  //   if (savedStreak) {
  //     setStreak(parseInt(savedStreak))
  //   }
  // }, [])

  const handleWorkoutTypeSelect = (workoutType) => {
    setSelectedWorkoutType(workoutType)
    setCurrentView('mood-selector')
  }

  const handleMoodSelect = (mood, duration, recommendation) => {
    setSelectedMood(mood)
    setRunDuration(duration)
    setWorkoutRecommendation(recommendation)
    setCurrentView('timer')
  }

  const handleTimerComplete = () => {
    setCurrentView('reflection')
  }

  const handleReflectionComplete = (postRunMood) => {
    // Save workout data to localStorage
    const today = new Date().toDateString()
    const workoutData = {
      date: today,
      workoutType: selectedWorkoutType,
      preRunMood: selectedMood,
      postRunMood: postRunMood,
      duration: runDuration,
      recommendation: workoutRecommendation
    }
    
    const existingWorkouts = JSON.parse(localStorage.getItem('moodRunHistory') || '[]')
    existingWorkouts.push(workoutData)
    localStorage.setItem('moodRunHistory', JSON.stringify(existingWorkouts))

    // Update streak - COMMENTED OUT FOR NOW
    // const yesterday = new Date()
    // yesterday.setDate(yesterday.getDate() - 1)
    // const yesterdayString = yesterday.toDateString()
    
    // const lastWorkoutDate = localStorage.getItem('lastWorkoutDate')
    // let newStreak = streak
    
    // if (lastWorkoutDate === today) {
    //   // Already worked out today, don't increment streak
    // } else if (lastWorkoutDate === yesterdayString) {
    //   // Worked out yesterday, increment streak
    //   newStreak = streak + 1
    // } else if (lastWorkoutDate !== today) {
    //   // Didn't workout yesterday, reset streak to 1
    //   newStreak = 1
    // }
    
    // setStreak(newStreak)
    // localStorage.setItem('moodRunStreak', newStreak.toString())
    // localStorage.setItem('lastWorkoutDate', today)

    // Reset to workout selector immediately
    setCurrentView('workout-selector')
    setSelectedWorkoutType(null)
    setSelectedMood(null)
    setRunDuration(0)
    setWorkoutRecommendation('')
  }

  const handleStopWorkout = () => {
    setCurrentView('mood-selector')
    setSelectedMood(null)
    setRunDuration(0)
    setWorkoutRecommendation('')
  }

  const handleStopAndReturnHome = () => {
    setCurrentView('workout-selector')
    setSelectedWorkoutType(null)
    setSelectedMood(null)
    setRunDuration(0)
    setWorkoutRecommendation('')
  }

  const handleReturnHome = () => {
    setCurrentView('workout-selector')
    setSelectedWorkoutType(null)
    setSelectedMood(null)
    setRunDuration(0)
    setWorkoutRecommendation('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2 mt-8">
            J&E Fitness 👟
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
          Workout based on how you feel
        </p>

        {/* StreakTracker commented out for now */}
        {/* <StreakTracker streak={streak} /> */}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {currentView === 'workout-selector' && (
            <WorkoutTypeSelector onWorkoutTypeSelect={handleWorkoutTypeSelect} />
          )}
          
          {currentView === 'mood-selector' && (
            <MoodSelector 
              onMoodSelect={handleMoodSelect}
              workoutType={selectedWorkoutType}
              onReturnHome={handleReturnHome}
            />
          )}
          
          {currentView === 'timer' && (
            <RunTimer 
              duration={runDuration}
              mood={selectedMood}
              workoutType={selectedWorkoutType}
              workoutRecommendation={workoutRecommendation}
              onComplete={handleTimerComplete}
              onStop={handleStopWorkout}
              onStopAndReturnHome={handleStopAndReturnHome}
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