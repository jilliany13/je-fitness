import { useState, useEffect } from 'react';
import { realtimeAuthService } from '../services/realtimeAuthService';

const CardioCrew = ({ onReturnToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [addingFriend, setAddingFriend] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current user data
      const userStats = await realtimeAuthService.getUserStats();
      console.log('Current user stats:', userStats);
      if (!userStats) {
        throw new Error('Unable to load user data. Please try logging in again.');
      }
      setCurrentUser(userStats);
      
      // Get all users (excluding current user)
      try {
        const allUsers = await realtimeAuthService.getAllUsers();
        console.log('All users from database:', allUsers);
        console.log('Current user UID:', userStats.uid);
        console.log('Current user from getAllUsers:', allUsers.find(u => u.username === userStats.username));
        
        const filteredUsers = allUsers.filter(user => {
          const isCurrentUser = user.uid === userStats.uid || user.username === userStats.username;
          console.log(`User ${user.username} (${user.uid}) - isCurrentUser: ${isCurrentUser}`);
          return !isCurrentUser;
        });
        
        console.log('Filtered users (excluding current user):', filteredUsers);
        
        // Limit to 10 users and sort by streak (highest first)
        const sortedUsers = filteredUsers
          .sort((a, b) => (b.streak || 0) - (a.streak || 0))
          .slice(0, 10);
        console.log('Final sorted users to display:', sortedUsers);
        
        setUsers(sortedUsers);
      } catch (usersError) {
        console.error('Error fetching users:', usersError);
        if (usersError.message.includes('permission') || usersError.message.includes('PERMISSION_DENIED')) {
          setError('Database permission issue. Please check your Firebase database rules. You may need to update them to allow reading user data for the Cardio Crew feature.');
        } else {
          setError(`Failed to load users: ${usersError.message}`);
        }
        setUsers([]);
      }
      
      // Get current user's friends
      try {
        const userFriends = await realtimeAuthService.getFriends();
        console.log('Current user friends:', userFriends);
        setFriends(userFriends);
      } catch (friendsError) {
        console.error('Error fetching friends:', friendsError);
        setFriends([]);
        // Don't show error for friends since it's not critical
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userToAdd) => {
    try {
      // Safety check: prevent adding yourself
      if (userToAdd.uid === currentUser?.uid || userToAdd.username === currentUser?.username) {
        alert('You cannot add yourself to your own crew!');
        return;
      }
      
      setAddingFriend(userToAdd.uid);
      await realtimeAuthService.addFriend(userToAdd.uid);
      
      // Update local state
      setFriends(prev => [...prev, userToAdd]);
      
      // Show success message
      alert(`Added ${userToAdd.username} to your Cardio Crew! 💪`);
      
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to add friend. Please try again.');
    } finally {
      setAddingFriend(null);
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    try {
      await realtimeAuthService.removeFriend(friendUid);
      
      // Update local state
      setFriends(prev => prev.filter(friend => friend.uid !== friendUid));
      
      alert('Removed from your Cardio Crew');
      
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend. Please try again.');
    }
  };

  const isFriend = (userUid) => {
    return friends.some(friend => friend.uid === userUid);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💪 Cardio Crew
          </h1>
          <p className="text-white opacity-90">
            Connect with fellow fitness enthusiasts
          </p>
          
          <button
            onClick={fetchData}
            disabled={loading}
            className="mt-4 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Profile
            </h2>
            <button
              onClick={onReturnToDashboard}
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl">{currentUser?.emojiAvatar || '💪'}</div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">{currentUser?.username}</div>
                  <div className="text-sm text-gray-600">
                    {currentUser?.streak || 0} day streak
                  </div>
                </div>
              </div>
              <div className="text-blue-600 text-sm font-medium">
                You
              </div>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Crew ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No crew members yet. Add some friends below!
              </p>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.uid} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{friend.emojiAvatar || '💪'}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{friend.username}</div>
                        <div className="text-sm text-gray-600">
                          {friend.streak || 0} day streak
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.uid)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Discover Athletes
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No other users found.
              </p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{user.emojiAvatar || '💪'}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.username}</div>
                        <div className="text-sm text-gray-600">
                          {user.streak || 0} day streak
                        </div>
                      </div>
                    </div>
                    {isFriend(user.uid) ? (
                      <span className="text-green-600 text-sm font-medium">✓ Added</span>
                    ) : user.uid === currentUser?.uid || user.username === currentUser?.username ? (
                      <span className="text-gray-400 text-sm font-medium">You</span>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(user)}
                        disabled={addingFriend === user.uid}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm disabled:opacity-50"
                      >
                        {addingFriend === user.uid ? 'Adding...' : 'Add to Crew'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onReturnToDashboard}
            className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardioCrew; 