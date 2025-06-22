import { useState, useEffect } from 'react';
import { localAuthService } from '../services/localAuthService';

const UserDashboard = ({ onReturnToWorkout, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await localAuthService.getUserStats();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
      'Running': '🏃‍♀️',
      'Gym': '💪',
      'Basketball': '🏀',
      'Volleyball': '🏐',
      'Bowling': '🎳'
    };
    return emojis[type] || '🏃‍♀️';
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'Low Energy': '😴',
      'Meh': '😐',
      'Feeling Good': '😊',
      'Energized': '⚡',
      'Fired Up': '🔥'
    };
    return emojis[mood] || '😊';
  };

  const calculateStats = () => {
    if (!userData?.workoutHistory) return {};

    const stats = {
      totalWorkouts: userData.workoutHistory.length,
      workoutTypes: {},
      moods: {},
      recentWorkouts: userData.workoutHistory.slice(-5).reverse(),
      weeklyWorkouts: 0,
      monthlyWorkouts: 0
    };

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    userData.workoutHistory.forEach(workout => {
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

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Dashboard 📊</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchUserData}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            title="Refresh data"
          >
            🔄
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
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
        <div className="space-y-2">
          {Object.entries(stats.workoutTypes).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getWorkoutTypeEmoji(type)}</span>
                <span className="text-gray-700">{type}</span>
              </div>
              <span className="font-semibold text-gray-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Trends */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mood Trends</h3>
        <div className="space-y-2">
          {Object.entries(stats.moods).map(([mood, count]) => (
            <div key={mood} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getMoodEmoji(mood)}</span>
                <span className="text-gray-700">{mood}</span>
              </div>
              <span className="font-semibold text-gray-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Workouts</h3>
        <div className="space-y-3">
          {stats.recentWorkouts.length > 0 ? (
            stats.recentWorkouts.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  <div className="text-sm text-gray-600">{new Date(workout.date).toLocaleDateString()}</div>
                  {workout.duration && (
                    <div className="text-xs text-gray-500">{workout.duration} min</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No workouts yet. Start your fitness journey!
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onReturnToWorkout}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          Start New Workout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard; 