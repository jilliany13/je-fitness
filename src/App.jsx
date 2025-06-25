import { useState, useEffect } from 'react'
import { realtimeAuthService } from './services/realtimeAuthService'
import { useHoverSupport } from './components/useHoverSupport'
import WorkoutTypeSelector from './components/WorkoutTypeSelector'
import MoodSelector from './components/MoodSelector'
import RunTimer from './components/RunTimer'
import PostRunReflection from './components/PostRunReflection'
import AboutPage from './components/AboutPage'
import Login from './components/Login'
import Signup from './components/Signup'
import UserDashboard from './components/UserDashboard'
// import StreakTracker from './components/StreakTracker'

function App() {
  const [currentView, setCurrentView] = useState('workout-selector') // workout-selector, login, signup, dashboard, mood-selector, timer, reflection, about
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [workoutRecommendation, setWorkoutRecommendation] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supportsHover = useHoverSupport()
  // const [streak, setStreak] = useState(0)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = realtimeAuthService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
      
      // Don't change view automatically - let user stay where they are
    })

    return () => unsubscribe()
  }, [])

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  // Load streak from localStorage on component mount
  // useEffect(() => {
  //   const savedStreak = localStorage.getItem('moodRunStreak')
  //   if (savedStreak) {
  //     setStreak(parseInt(savedStreak))
  //   }
  // }, [])

  // Listen for custom events from PostRunReflection
  useEffect(() => {
    const handleTriggerSignup = () => {
      setCurrentView('signup')
    }

    const handleTriggerLogin = () => {
      setCurrentView('login')
    }

    window.addEventListener('trigger-signup', handleTriggerSignup)
    window.addEventListener('trigger-login', handleTriggerLogin)

    return () => {
      window.removeEventListener('trigger-signup', handleTriggerSignup)
      window.removeEventListener('trigger-login', handleTriggerLogin)
    }
  }, [])

  // After login/signup, if pendingWorkout exists, go to reflection page and restore state
  useEffect(() => {
    if ((currentView === 'dashboard' || currentView === 'workout-selector') && localStorage.getItem('pendingWorkout')) {
      setCurrentView('reflection');
    }
  }, [currentView]);

  const handleLoginSuccess = async () => {
    // If there is a pending workout, save it and go to dashboard
    const pending = localStorage.getItem('pendingWorkout');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        // Save workout using the service
        if (data && data.workoutType && data.preRunMood) {
          await realtimeAuthService.saveWorkout({
            workoutType: data.workoutType,
            preRunMood: data.preRunMood,
            postRunMood: data.postRunMood,
            notes: data.notes,
            timestamp: new Date().toISOString()
          });
        }
      } catch {}
      localStorage.removeItem('pendingWorkout');
    }
    setCurrentView('dashboard');
  }

  const handleSignupSuccess = async () => {
    // If there is a pending workout, save it and go to dashboard
    const pending = localStorage.getItem('pendingWorkout');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        if (data && data.workoutType && data.preRunMood) {
          await realtimeAuthService.saveWorkout({
            workoutType: data.workoutType,
            preRunMood: data.preRunMood,
            postRunMood: data.postRunMood,
            notes: data.notes,
            timestamp: new Date().toISOString()
          });
        }
      } catch {}
      localStorage.removeItem('pendingWorkout');
    }
    setCurrentView('dashboard');
  }

  const handleLogout = async () => {
    try {
      await realtimeAuthService.signOut()
      setCurrentView('workout-selector')
      setSelectedWorkoutType(null)
      setSelectedMood(null)
      setWorkoutRecommendation('')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSwitchToSignup = () => {
    setCurrentView('signup')
  }

  const handleSwitchToLogin = () => {
    setCurrentView('login')
  }

  const handleWorkoutTypeSelect = (workoutType) => {
    setSelectedWorkoutType(workoutType)
    setCurrentView('mood-selector')
  }

  const handleMoodSelect = (mood, recommendation) => {
    setSelectedMood(mood)
    setWorkoutRecommendation(recommendation)
    setCurrentView('timer')
  }

  const handleTimerComplete = () => {
    setCurrentView('reflection')
  }

  const handleReflectionComplete = async (destination = 'workout-selector') => {
    // Navigate based on destination parameter
    if (destination === 'dashboard') {
      setCurrentView('dashboard')
    } else {
      // Reset to workout selector (default behavior)
      setTimeout(() => {
        setCurrentView('workout-selector')
        setSelectedWorkoutType(null)
        setSelectedMood(null)
        setWorkoutRecommendation('')
      }, 100)
    }
  }

  const handleStopWorkout = () => {
    setCurrentView('mood-selector')
    setSelectedMood(null)
    setWorkoutRecommendation('')
  }

  const handleStopAndReturnHome = () => {
    setCurrentView('workout-selector')
    setSelectedWorkoutType(null)
    setSelectedMood(null)
    setWorkoutRecommendation('')
  }

  const handleReturnHome = () => {
    setCurrentView('workout-selector')
    setSelectedWorkoutType(null)
    setSelectedMood(null)
    setWorkoutRecommendation('')
  }

  const handleAboutClick = () => {
    setCurrentView('about')
  }

  const handleStartWorkout = () => {
    setCurrentView('workout-selector')
  }

  const handleShowLogin = () => {
    setCurrentView('login')
  }

  const handleShowSignup = () => {
    setCurrentView('signup')
  }

  const handleShowDashboard = () => {
    setCurrentView('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mt-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          J&E Fitness
          {/* You can change this to:
          🏃‍♀️ J&E Fitness
          💪 Mood Workout
          ⚡ Energy Run
          🎯 Feel Good Run
          🌟 Wellness Run
          🚀 Mood Movement
          */}
        </h1>
        <div className="flex items-center justify-center space-x-2 mb-8">
          <p className="text-white opacity-90">
            Workout based on how you feel
          </p>
          <button
            onClick={handleAboutClick}
            className="text-white opacity-70 hover:opacity-100 transition-opacity duration-200 text-sm"
            title="About J&E Fitness"
          >
            ⓘ
          </button>
        </div>

        {/* StreakTracker commented out for now */}
        {/* <StreakTracker streak={streak} /> */}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {currentView === 'workout-selector' && (
            <div className="space-y-6">
              {/* Auth buttons at the top */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {user ? `Welcome, ${user.email}!` : 'Guest mode'}
                </div>
                <div className="flex items-center space-x-2">
                  {user ? (
                    <button
                      onClick={handleShowDashboard}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                    >
                      Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={handleShowLogin}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                    >
                      Log In
                    </button>
                  )}
                </div>
              </div>

              {/* Workout type selector */}
              <WorkoutTypeSelector onWorkoutTypeSelect={handleWorkoutTypeSelect} />

              {/* Info for guest users */}
              {!user && (
                <button
                  onClick={handleShowSignup}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 text-center hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                >
                  <p className="text-sm text-blue-700">
                    💡 Sign up to save your workout history and track your progress!
                  </p>
                </button>
              )}

              {/* Sign Out button at the bottom for logged in users */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Sign Out
                </button>
              )}
            </div>
          )}

          {currentView === 'login' && (
            <Login 
              onSwitchToSignup={handleSwitchToSignup} 
              onLoginSuccess={handleLoginSuccess}
              onBackToWorkout={handleReturnHome}
            />
          )}

          {currentView === 'signup' && (
            <Signup 
              onSwitchToLogin={handleSwitchToLogin} 
              onSignupSuccess={handleSignupSuccess}
              onBackToWorkout={handleReturnHome}
            />
          )}

          {currentView === 'dashboard' && (
            <UserDashboard onReturnToWorkout={handleStartWorkout} onLogout={handleLogout} />
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
              workoutType={selectedWorkoutType}
              preRunMood={selectedMood}
              onComplete={handleReflectionComplete}
              onBackToMood={handleStopWorkout}
              onBackToWorkoutType={handleStopAndReturnHome}
            />
          )}

          {currentView === 'about' && (
            <AboutPage onReturnHome={handleReturnHome} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App 