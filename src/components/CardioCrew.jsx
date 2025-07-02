import { useState, useEffect } from 'react';
import { realtimeAuthService } from '../services/realtimeAuthService';

const CardioCrew = ({ onReturnToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [peopleWhoAddedMe, setPeopleWhoAddedMe] = useState([]);
  const [addingFriend, setAddingFriend] = useState(null);
  const [activeTab, setActiveTab] = useState('my-crew'); // 'my-crew' or 'added-me'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'my-crew', 'added-me'
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);

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
        
        // Get recommended users based on crew's friends
        const recommended = await realtimeAuthService.getRecommendedUsers(friends);
        setRecommendedUsers(recommended.slice(0, 4)); // Limit to 4 recommended users
        
        // Set regular users (for search functionality)
        setUsers(filteredUsers);
      } catch (usersError) {
        console.error('Error fetching users:', usersError);
        if (usersError.message.includes('permission') || usersError.message.includes('PERMISSION_DENIED')) {
          setError('Database permission issue. Please check your Firebase database rules. You may need to update them to allow reading user data for the Cardio Crew feature.');
        } else {
          setError(`Failed to load users: ${usersError.message}`);
        }
        setUsers([]);
        setRecommendedUsers([]);
      }
      
      // Get current user's friends (people I added)
      try {
        const userFriends = await realtimeAuthService.getFriends();
        console.log('Current user friends:', userFriends);
        setFriends(userFriends);
      } catch (friendsError) {
        console.error('Error fetching friends:', friendsError);
        setFriends([]);
        // Don't show error for friends since it's not critical
      }

      // Get people who added me
      try {
        const peopleWhoAddedMe = await realtimeAuthService.getPeopleWhoAddedMe();
        console.log('People who added me:', peopleWhoAddedMe);
        setPeopleWhoAddedMe(peopleWhoAddedMe);
      } catch (addedMeError) {
        console.error('Error fetching people who added me:', addedMeError);
        setPeopleWhoAddedMe([]);
        // Don't show error since it's not critical
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
      
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend. Please try again.');
    }
  };

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    try {
      await realtimeAuthService.removeFriend(friendToRemove.uid);
      
      // Update local state
      setFriends(prev => prev.filter(friend => friend.uid !== friendToRemove.uid));
      
      // Close modal
      setShowRemoveModal(false);
      setFriendToRemove(null);
      
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend. Please try again.');
    }
  };

  const cancelRemoveFriend = () => {
    setShowRemoveModal(false);
    setFriendToRemove(null);
  };

  const isFriend = (userUid) => {
    return friends.some(friend => friend.uid === userUid);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 rounded-3xl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💪 Cardio Crew
          </h1>
          <p className="text-white opacity-90">
            Connect with fellow fitness enthusiasts
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={onReturnToDashboard}
            className="w-full bg-white bg-opacity-20 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-opacity-30 focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setCurrentView('my-crew')}
            className="bg-white bg-opacity-20 rounded-2xl p-3 text-center hover:bg-opacity-30 transition-all duration-200 active:scale-95"
          >
            <div className="text-2xl font-bold text-white">{friends.length}</div>
            <div className="text-sm text-white text-opacity-80">Your Crew</div>
          </button>
          <button 
            onClick={() => setCurrentView('added-me')}
            className="bg-white bg-opacity-20 rounded-2xl p-3 text-center hover:bg-opacity-30 transition-all duration-200 active:scale-95"
          >
            <div className="text-2xl font-bold text-white">{peopleWhoAddedMe.length}</div>
            <div className="text-sm text-white text-opacity-80">Added You</div>
          </button>
        </div>

        {currentView === 'main' && (
          <>
            {/* Search Bar */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="🔍 Search athletes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-4 pr-12 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 text-base"
              />
              {searchQuery.trim().length > 0 && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-4 text-white text-opacity-70 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Results */}
            {searchQuery.trim().length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Search Results ({searchResults.length})
                </h3>
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-white text-opacity-80">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white text-opacity-80">No users found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className={`space-y-3 ${searchResults.length > 3 ? 'max-h-48 overflow-y-auto search-scroll' : ''}`} style={searchResults.length > 3 ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                    <style>{`
                      .search-scroll::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {searchResults.map((user) => (
                      <div key={user.uid} className="flex items-center justify-between p-4 bg-white bg-opacity-25 rounded-2xl border border-white border-opacity-20 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{user.emojiAvatar || '💪'}</div>
                          <div>
                            <div className="font-semibold text-white">{user.username}</div>
                            <div className="text-sm text-white text-opacity-80">
                              {user.streak || 0} day streak
                            </div>
                          </div>
                        </div>
                        {isFriend(user.uid) ? (
                          <span className="text-green-300 text-sm font-medium ml-4">✓ Added</span>
                        ) : (
                          <button
                            onClick={() => handleAddFriend(user)}
                            disabled={addingFriend === user.uid}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm disabled:opacity-50 ml-4"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Discover Athletes */}
            {searchQuery.trim().length === 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Discover Athletes
                </h3>
                {(() => {
                  const availableUsers = users.filter(user => !isFriend(user.uid));
                  return availableUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white text-opacity-80">No athletes available to discover.</p>
                    </div>
                  ) : (
                    <div className={`space-y-3 ${availableUsers.length > 3 ? 'max-h-48 overflow-y-auto discover-scroll' : ''}`} style={availableUsers.length > 3 ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                      <style>{`
                        .discover-scroll::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      {availableUsers.map((user) => (
                        <div key={user.uid} className="flex items-center justify-between p-4 bg-white bg-opacity-25 rounded-2xl border border-white border-opacity-20 shadow-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{user.emojiAvatar || '💪'}</div>
                            <div>
                              <div className="font-semibold text-white">{user.username}</div>
                              <div className="text-sm text-white text-opacity-80">
                                {user.streak || 0} day streak
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddFriend(user)}
                            disabled={addingFriend === user.uid}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm disabled:opacity-50 ml-4"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {/* Your Crew View */}
        {currentView === 'my-crew' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Crew</h2>
              <button
                onClick={() => setCurrentView('main')}
                className="text-white text-opacity-80 hover:text-white transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white text-opacity-80">No crew members yet. Add some friends from the main page!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto crew-list-scroll">
                <style>{`
                  .crew-list-scroll::-webkit-scrollbar {
                    width: 4px;
                  }
                  .crew-list-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                  }
                  .crew-list-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                  }
                  .crew-list-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                  }
                `}</style>
                {friends.map((friend) => (
                  <div key={friend.uid} className="flex items-center justify-between p-4 bg-white bg-opacity-20 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{friend.emojiAvatar || '💪'}</div>
                      <div>
                        <div className="font-semibold text-white">{friend.username}</div>
                        <div className="text-sm text-white text-opacity-80">
                          {friend.streak || 0} day streak
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFriendToRemove(friend);
                        setShowRemoveModal(true);
                      }}
                      className="text-green-300 hover:text-green-200 text-sm font-medium ml-4"
                    >
                      Added
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Added You View */}
        {currentView === 'added-me' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Added You</h2>
              <button
                onClick={() => setCurrentView('main')}
                className="text-white text-opacity-80 hover:text-white transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
            {peopleWhoAddedMe.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white text-opacity-80">No one has added you to their crew yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto added-me-list-scroll">
                <style>{`
                  .added-me-list-scroll::-webkit-scrollbar {
                    width: 4px;
                  }
                  .added-me-list-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                  }
                  .added-me-list-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                  }
                  .added-me-list-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                  }
                `}</style>
                {peopleWhoAddedMe.map((person) => (
                  <div key={person.uid} className="flex items-center justify-between p-4 bg-white bg-opacity-20 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{person.emojiAvatar || '💪'}</div>
                      <div>
                        <div className="font-semibold text-white">{person.username}</div>
                        <div className="text-sm text-white text-opacity-80">
                          {person.streak || 0} day streak
                        </div>
                      </div>
                    </div>
                    {isFriend(person.uid) ? (
                      <span className="text-green-300 text-sm font-medium ml-4">✓ Added</span>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(person)}
                        disabled={addingFriend === person.uid}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm disabled:opacity-50 ml-4"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}



        {/* Remove Friend Confirmation Modal */}
        {showRemoveModal && friendToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Remove from Crew</h3>
                  <button
                    onClick={cancelRemoveFriend}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="text-center py-4">
                  <div className="text-4xl mb-3">{friendToRemove.emojiAvatar || '💪'}</div>
                  <p className="text-gray-700">
                    Remove <span className="font-semibold text-gray-800">{friendToRemove.username}</span> from your crew?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    They will no longer appear in your crew list.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={cancelRemoveFriend}
                    className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRemoveFriend}
                    className="flex-1 bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-all duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardioCrew; 