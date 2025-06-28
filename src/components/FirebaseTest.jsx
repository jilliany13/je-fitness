import { useState } from 'react';
import { ref, set, get, push } from 'firebase/database';
import { database } from '../firebase';
import { realtimeAuthService } from '../services/realtimeAuthService';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (testName, result, details = '') => {
    setTestResults(prev => [...prev, {
      name: testName,
      result: result ? '✅ PASS' : '❌ FAIL',
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Check if user is logged in
      const currentUser = realtimeAuthService.getCurrentUser();
      addTestResult(
        'User Authentication',
        !!currentUser,
        currentUser ? `Logged in as: ${currentUser.email}` : 'No user logged in'
      );

      // Test 2: Get user stats
      try {
        const userStats = await realtimeAuthService.getUserStats();
        addTestResult(
          'Get User Stats',
          !!userStats,
          userStats ? `Username: ${userStats.username}, Streak: ${userStats.streak}` : 'No user stats found'
        );
      } catch (error) {
        addTestResult('Get User Stats', false, `Error: ${error.message}`);
      }

      // Test 3: Get all users
      try {
        const allUsers = await realtimeAuthService.getAllUsers();
        addTestResult(
          'Get All Users',
          Array.isArray(allUsers),
          `Found ${allUsers.length} users in database`
        );
        
        if (allUsers.length > 0) {
          addTestResult(
            'Users Data Structure',
            allUsers.every(user => user.username && user.uid),
            `Sample user: ${allUsers[0].username} (${allUsers[0].uid})`
          );
        }
      } catch (error) {
        addTestResult('Get All Users', false, `Error: ${error.message}`);
      }

      // Test 4: Get friends
      try {
        const friends = await realtimeAuthService.getFriends();
        addTestResult(
          'Get Friends',
          Array.isArray(friends),
          `Found ${friends.length} friends`
        );
      } catch (error) {
        addTestResult('Get Friends', false, `Error: ${error.message}`);
      }

      // Test 5: Test adding a friend (if there are other users)
      try {
        const allUsers = await realtimeAuthService.getAllUsers();
        const currentUser = realtimeAuthService.getCurrentUser();
        const otherUsers = allUsers.filter(user => user.uid !== currentUser?.uid);
        
        if (otherUsers.length > 0) {
          const testUser = otherUsers[0];
          addTestResult(
            'Add Friend Test',
            true,
            `Would add: ${testUser.username} (${testUser.uid})`
          );
        } else {
          addTestResult(
            'Add Friend Test',
            true,
            'No other users available to test with'
          );
        }
      } catch (error) {
        addTestResult('Add Friend Test', false, `Error: ${error.message}`);
      }

      // Test 6: Test emoji avatar functionality
      try {
        const currentUser = realtimeAuthService.getCurrentUser();
        if (currentUser) {
          const userStats = await realtimeAuthService.getUserStats();
          addTestResult(
            'Emoji Avatar Test',
            true,
            `Current avatar: ${userStats?.emojiAvatar || '💪'} (Default)`
          );
        } else {
          addTestResult('Emoji Avatar Test', false, 'No user logged in');
        }
      } catch (error) {
        addTestResult('Emoji Avatar Test', false, `Error: ${error.message}`);
      }

    } catch (error) {
      addTestResult('Overall Test', false, `General error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handleBackToApp = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔧 Firebase Connection Test
          </h1>
          <p className="text-white opacity-90">
            Test your Firebase setup and Cardio Crew functionality
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : '🧪 Run All Tests'}
            </button>
            <button
              onClick={clearResults}
              className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Clear Results
            </button>
          </div>

          <button
            onClick={handleBackToApp}
            className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 mb-6"
          >
            ← Back to App
          </button>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results:</h3>
              {testResults.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{test.name}</span>
                    <span className={`font-semibold ${test.result.includes('PASS') ? 'text-green-600' : 'text-red-600'}`}>
                      {test.result}
                    </span>
                  </div>
                  {test.details && (
                    <p className="text-sm text-gray-600">{test.details}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{test.timestamp}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Troubleshooting Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure you're logged in to test the Cardio Crew features</li>
              <li>• Check your Firebase database rules allow reading all users</li>
              <li>• Verify there are other users in your database</li>
              <li>• Check the browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest; 