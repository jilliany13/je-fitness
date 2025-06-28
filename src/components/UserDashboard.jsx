import { useState, useEffect } from 'react';
import { realtimeAuthService } from '../services/realtimeAuthService';
import FluencyDashboard from './FluencyDashboard';
import EmojiSelector from './EmojiSelector';

const UserDashboard = ({ onReturnToWorkout, onLogout, onShowCardioCrew }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFluency, setShowFluency] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
      const data = await realtimeAuthService.getUserStats();
      console.log('User data received:', data);
      setUserData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showFluency) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFluency]);

  // Refresh data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getWorkoutTypeEmoji = (type) => {
    const emojis = {
      'Gym': '🏋️‍♂️',
      'Running': '🏃‍♂️',
      'Basketball': '🏀',
      'Swimming': '🏊‍♂️',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Boxing': '🥊',
      'Bowling': '🎳',
      'Yoga': '🧘‍♀️',
      'Soccer': '⚽',
      'Table Tennis': '🏓',
      'Cycling': '🚴‍♂️',
      'Badminton': '🏸',
      'Walking': '🏃‍♀️',
      'CrossFit': '🏋️‍♀️'
    };
    return emojis[type] || '💪'; // Default to 💪 if type not found
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'Low Energy': '😴',
      'Meh': '😐',
      'Good': '😊',
      'Energized': '⚡',
      'Fired Up': '🔥'
    };
    return emojis[mood] || '😊';
  };

  const getPostMoodEmoji = (mood) => {
    const emojis = {
      'Much Better': '😄',
      'Better': '😊',
      'Same': '😐',
      'Worse': '😔',
      'Much Worse': '😫'
    };
    return emojis[mood] || '😊';
  };

  const handleWorkoutClick = (workout) => {
    console.log('Workout data:', workout); // Debug log
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  const closeWorkoutModal = () => {
    setShowWorkoutModal(false);
    setSelectedWorkout(null);
  };

  const handleDeleteWorkout = (workout) => {
    setWorkoutToDelete(workout);
    setShowDeleteModal(true);
  };

  const confirmDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    try {
      // Always treat workoutHistory as an array
      let workoutArray = [];
      if (userData.workoutHistory) {
        if (Array.isArray(userData.workoutHistory)) {
          workoutArray = userData.workoutHistory;
        } else if (typeof userData.workoutHistory === 'object') {
          workoutArray = Object.values(userData.workoutHistory);
        }
      }

      // Filter out the workout to delete by timestamp
      const filteredWorkouts = workoutArray.filter(
        workout => workout.timestamp !== workoutToDelete.timestamp
      );

      // Update the user data
      const updatedUserData = {
        ...userData,
        workoutHistory: filteredWorkouts,
        totalWorkouts: Math.max(0, userData.totalWorkouts - 1)
      };

      // Save to Firebase
      await realtimeAuthService.updateUserData(updatedUserData);

      // Update local state
      setUserData(updatedUserData);
      setShowDeleteModal(false);
      setWorkoutToDelete(null);
      setShowWorkoutModal(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  const cancelDeleteWorkout = () => {
    setShowDeleteModal(false);
    setWorkoutToDelete(null);
  };

  const handleEmojiSelect = async (emoji) => {
    try {
      console.log('UserDashboard: Attempting to update emoji avatar to:', emoji);
      
      await realtimeAuthService.updateEmojiAvatar(emoji);
      
      // Update local state
      setUserData(prev => ({ ...prev, emojiAvatar: emoji }));
      
    } catch (error) {
      console.error('UserDashboard: Error updating emoji avatar:', error);
      
      // Show more specific error message
      if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        alert('Database permission error. Please check your Firebase database rules. You may need to update them to allow writing to user data.');
      } else if (error.message.includes('User profile not found')) {
        alert('User profile not found. Please try logging out and logging back in.');
      } else {
        alert(`Failed to update avatar: ${error.message}`);
      }
    }
  };

  const calculateStats = () => {
    // Normalize workoutHistory to always be an array
    let workoutArray = [];
    if (userData?.workoutHistory) {
      if (Array.isArray(userData.workoutHistory)) {
        workoutArray = userData.workoutHistory;
      } else if (typeof userData.workoutHistory === 'object') {
        workoutArray = Object.values(userData.workoutHistory);
      }
    }

    // Sort by timestamp descending (most recent first)
    if (workoutArray.length > 0) {
      workoutArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Initialize default stats for new users
    const stats = {
      totalWorkouts: userData?.totalWorkouts || 0,
      workoutTypes: {},
      moods: {},
      allWorkouts: [],
      weeklyWorkouts: 0,
      monthlyWorkouts: 0
    };

    if (workoutArray.length > 0) {
      stats.allWorkouts = workoutArray; // Already sorted
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      workoutArray.forEach(workout => {
        // Count workout types
        stats.workoutTypes[workout.workoutType] = (stats.workoutTypes[workout.workoutType] || 0) + 1;
        // Count moods
        stats.moods[workout.preRunMood] = (stats.moods[workout.preRunMood] || 0) + 1;
        // Count recent workouts
        const workoutDate = new Date(workout.date);
        if (workoutDate >= oneWeekAgo) {
          stats.weeklyWorkouts++;
        }
        if (workoutDate >= oneMonthAgo) {
          stats.monthlyWorkouts++;
        }
      });
    }

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button
          onClick={fetchUserData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${showFluency ? 'pointer-events-none select-none' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Your Dashboard</h2>
          <button
            onClick={() => setShowFluency(true)}
            className="flex-1 ml-8 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-base"
          >
            Skills
          </button>
        </div>
        
        {/* User Avatar Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{userData?.emojiAvatar || '💪'}</div>
              <div>
                <div className="font-semibold text-gray-800">{userData?.username}</div>
                <div className="text-sm text-gray-600">Your Avatar</div>
              </div>
            </div>
            <button
              onClick={() => setShowEmojiSelector(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
            >
              Change Avatar
            </button>
          </div>
        </div>
        
        {/* Start New Workout Button */}
        <button
          onClick={onReturnToWorkout}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          Start New Workout
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
          <div className="text-sm text-blue-700">Total Workouts</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-green-600">{userData?.streak || 0}</div>
          <div className="text-sm text-green-700">Current Streak</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{stats.weeklyWorkouts}</div>
          <div className="text-sm text-purple-700">This Week</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{stats.monthlyWorkouts}</div>
          <div className="text-sm text-orange-700">This Month</div>
        </div>
      </div>

      {/* Workout Types */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Workout Types</h3>
        <div className="max-h-36 overflow-y-auto space-y-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {Object.keys(stats.workoutTypes).length > 0 ? (
            Object.entries(stats.workoutTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getWorkoutTypeEmoji(type)}</span>
                  <span className="text-gray-700">{type}</span>
                </div>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <div className="text-2xl mb-2">🏃‍♀️</div>
              <p className="text-sm">No workouts logged yet</p>
              <p className="text-xs text-gray-400">Start your first workout to see your stats here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Trends */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mood Trends</h3>
        <div className="space-y-2">
          {Object.keys(stats.moods).length > 0 ? (
            Object.entries(stats.moods).map(([mood, count]) => (
              <div key={mood} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getMoodEmoji(mood)}</span>
                  <span className="text-gray-700">{mood}</span>
                </div>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <div className="text-2xl mb-2">😊</div>
              <p className="text-sm">No mood data yet</p>
              <p className="text-xs text-gray-400">Log your first workout to track your mood trends!</p>
            </div>
          )}
        </div>
      </div>

      {/* All Workouts */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">All Workouts</h3>
        <div className="max-h-96 overflow-y-auto space-y-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {stats.allWorkouts.length > 0 ? (
            stats.allWorkouts.map((workout, index) => (
              <button
                key={index}
                onClick={() => handleWorkoutClick(workout)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getWorkoutTypeEmoji(workout.workoutType)}</span>
                  <div>
                    <div className="font-medium text-gray-800">{workout.workoutType}</div>
                    <div className="text-sm text-gray-600">
                      {getMoodEmoji(workout.preRunMood)} {workout.preRunMood}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{new Date(workout.timestamp).toLocaleDateString()}</div>
                  <div className="text-xs text-blue-500 mt-1">Click to view details →</div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No workouts yet. Start your fitness journey!
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onShowCardioCrew}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          💪 Cardio Crew
        </button>
        <button
          onClick={onLogout}
          className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>

      {/* Workout Detail Modal */}
      {showWorkoutModal && selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Workout Details</h3>
                <button
                  onClick={closeWorkoutModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Workout Header */}
              <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="text-4xl mb-2">{getWorkoutTypeEmoji(selectedWorkout.workoutType)}</div>
                <h4 className="text-lg font-semibold text-gray-800">{selectedWorkout.workoutType}</h4>
                <p className="text-sm text-gray-600">{new Date(selectedWorkout.timestamp).toLocaleDateString()}</p>
              </div>

              {/* Workout Details */}
              <div className="space-y-4">
                {/* Pre-workout Mood */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Pre-Workout Mood</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(selectedWorkout.preRunMood)}</span>
                    <span className="text-gray-700">{selectedWorkout.preRunMood}</span>
                  </div>
                </div>

                {/* Workout Recommendation - Only show for standard workouts */}
                {selectedWorkout.workoutRecommendation && 
                 selectedWorkout.workoutRecommendation !== 'Custom workout based on your mood' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Workout Recommendation</h5>
                    <p className="text-gray-700 text-sm">{selectedWorkout.workoutRecommendation}</p>
                  </div>
                )}

                {/* Custom Workout Steps - Show for custom workouts or when user created custom steps */}
                {selectedWorkout.customWorkoutSteps && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Custom Workout</h5>
                    <p className="text-gray-700 text-sm">{selectedWorkout.customWorkoutSteps}</p>
                  </div>
                )}

                {/* For custom workout types, show the custom steps as the main workout details */}
                {(!selectedWorkout.workoutRecommendation || selectedWorkout.workoutRecommendation === 'Custom workout based on your mood') && 
                 !selectedWorkout.customWorkoutSteps && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Workout Details</h5>
                    <p className="text-gray-700 text-sm">
                      {selectedWorkout.customWorkoutSteps || 'Custom workout completed'}
                    </p>
                  </div>
                )}

                {/* Post-workout Mood */}
                {selectedWorkout.postRunMood && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Post-Workout Mood</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getPostMoodEmoji(selectedWorkout.postRunMood)}</span>
                      <span className="text-gray-700">{selectedWorkout.postRunMood}</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedWorkout.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Notes</h5>
                    <p className="text-gray-700 text-sm">{selectedWorkout.notes}</p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Logged At</h5>
                  <p className="text-gray-700 text-sm">
                    {new Date(selectedWorkout.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeWorkoutModal}
                className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
              >
                Close
              </button>

              {/* Delete Button - Show for all workouts */}
              <button
                onClick={() => handleDeleteWorkout(selectedWorkout)}
                className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-all duration-200"
              >
                Delete Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fluency Dashboard Modal */}
      {showFluency && (
        <>
          {/* Overlay that blocks all background interaction */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowFluency(false)}></div>
          
          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <FluencyDashboard userData={userData} onBack={() => setShowFluency(false)} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Workout Confirmation Modal */}
      {showDeleteModal && workoutToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">Are you sure you want to delete this workout?</p>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getWorkoutTypeEmoji(workoutToDelete.workoutType)}</span>
                  <div>
                    <div className="font-medium text-gray-800">{workoutToDelete.workoutType}</div>
                    <div className="text-sm text-gray-600">
                      {getMoodEmoji(workoutToDelete.preRunMood)} {workoutToDelete.preRunMood}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(workoutToDelete.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={confirmDeleteWorkout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDeleteWorkout}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Selector Modal */}
      {showEmojiSelector && (
        <EmojiSelector
          selectedEmoji={userData?.emojiAvatar || '💪'}
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiSelector(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard; 