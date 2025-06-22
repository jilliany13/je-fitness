import { useState } from 'react';
import { ref, set, get, push } from 'firebase/database';
import { database } from '../firebase';
import { realtimeAuthService } from '../services/realtimeAuthService';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Basic connection
      addTestResult('Connection Test', 'running', 'Testing basic connection...');
      try {
        const testRef = ref(database, 'test');
        await get(testRef);
        addTestResult('Connection Test', 'success', 'Successfully connected to Realtime Database');
      } catch (error) {
        addTestResult('Connection Test', 'error', `Connection failed: ${error.message}`);
        return;
      }

      // Test 2: Write data
      addTestResult('Write Test', 'running', 'Testing write operation...');
      try {
        const testDataRef = ref(database, 'testData');
        await set(testDataRef, {
          message: 'Hello from Mood Run!',
          timestamp: new Date().toISOString(),
          test: true
        });
        addTestResult('Write Test', 'success', 'Successfully wrote test data');
      } catch (error) {
        addTestResult('Write Test', 'error', `Write failed: ${error.message}`);
      }

      // Test 3: Read data
      addTestResult('Read Test', 'running', 'Testing read operation...');
      try {
        const testDataRef = ref(database, 'testData');
        const snapshot = await get(testDataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          addTestResult('Read Test', 'success', `Successfully read data: ${data.message}`);
        } else {
          addTestResult('Read Test', 'error', 'No data found');
        }
      } catch (error) {
        addTestResult('Read Test', 'error', `Read failed: ${error.message}`);
      }

      // Test 4: Push data (for workout history)
      addTestResult('Push Test', 'running', 'Testing push operation...');
      try {
        const testHistoryRef = ref(database, 'testHistory');
        const newRef = push(testHistoryRef);
        await set(newRef, {
          workoutType: 'Test Workout',
          mood: 'Test Mood',
          timestamp: new Date().toISOString()
        });
        addTestResult('Push Test', 'success', 'Successfully pushed test workout data');
      } catch (error) {
        addTestResult('Push Test', 'error', `Push failed: ${error.message}`);
      }

      // Test 5: Clean up test data
      addTestResult('Cleanup Test', 'running', 'Cleaning up test data...');
      try {
        const testDataRef = ref(database, 'testData');
        const testHistoryRef = ref(database, 'testHistory');
        await set(testDataRef, null);
        await set(testHistoryRef, null);
        addTestResult('Cleanup Test', 'success', 'Successfully cleaned up test data');
      } catch (error) {
        addTestResult('Cleanup Test', 'error', `Cleanup failed: ${error.message}`);
      }

    } catch (error) {
      addTestResult('General Error', 'error', `Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createUserDocument = async () => {
    setLoading(true);
    try {
      const success = await realtimeAuthService.createUserDocumentManually();
      if (success) {
        addTestResult('User Document', 'success', 'User document created successfully');
      } else {
        addTestResult('User Document', 'error', 'Failed to create user document');
      }
    } catch (error) {
      addTestResult('User Document', 'error', `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Firebase Realtime Database Tests</h3>
        <div className="flex space-x-2">
          <button
            onClick={createUserDocument}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create User Doc
          </button>
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-600 text-sm">No tests run yet. Click "Run Tests" to start.</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span>{getStatusIcon(result.status)}</span>
                <span className={`font-medium ${getStatusColor(result.status)}`}>
                  {result.test}:
                </span>
                <span className="text-gray-700">{result.message}</span>
                <span className="text-gray-500 text-xs">({result.timestamp})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">What these tests check:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Connection:</strong> Can connect to your Firebase Realtime Database</li>
          <li>• <strong>Write:</strong> Can save data to the database</li>
          <li>• <strong>Read:</strong> Can retrieve data from the database</li>
          <li>• <strong>Push:</strong> Can add new entries (like workout history)</li>
          <li>• <strong>Cleanup:</strong> Can remove test data</li>
          <li>• <strong>User Document:</strong> Can create user profile (if logged in)</li>
        </ul>
      </div>

      {testResults.some(r => r.status === 'error') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Troubleshooting Tips:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Make sure you created a <strong>Realtime Database</strong> (not Firestore)</li>
            <li>• Check that your database URL is correct in firebase.js</li>
            <li>• Verify your database rules allow read/write operations</li>
            <li>• Ensure you have an active internet connection</li>
            <li>• Check the browser console for detailed error messages</li>
            <li>• If you get "User document not found", click "Create User Doc" (when logged in)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest; 