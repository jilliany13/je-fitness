import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { 
  ref, 
  set, 
  get, 
  push, 
  update,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import { auth, database } from '../firebase';

export const realtimeAuthService = {
  // Validate username format
  validateUsername(username) {
    if (!username || username.length < 6) {
      throw new Error('Username must be at least 6 characters long.');
    }
    if (/\s/.test(username)) {
      throw new Error('Username cannot contain any whitespace characters.');
    }
    return true;
  },

  // Check if username is unique
  async isUsernameUnique(username) {
    try {
      console.log('Checking if username is unique:', username);
      const usernameQuery = query(
        ref(database, 'usernames'),
        orderByChild('username'),
        equalTo(username)
      );
      console.log('Executing username query...');
      const snapshot = await get(usernameQuery);
      console.log('Username query result:', snapshot.exists());
      console.log('Username query data:', snapshot.val());
      return !snapshot.exists();
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Log the error type and constructor
      console.error('Error constructor:', error.constructor.name);
      console.error('Error prototype:', Object.getPrototypeOf(error));
      
      // If it's a permission error, we'll assume the username is available
      // and let the signup proceed. The Firebase Auth will handle duplicates.
      if (error.code === 'PERMISSION_DENIED' || 
          error.message.includes('permission') ||
          error.message.includes('Permission') ||
          error.code === 'permission-denied') {
        console.log('Permission denied for username check, proceeding with signup...');
        return true; // Assume username is available
      }
      
      // For any other error, also assume username is available to allow signup to proceed
      console.log('Unknown error during username check, proceeding with signup...');
      return true;
    }
  },

  // Register a new user
  async signUp(username, password) {
    try {
      console.log('Starting signup process for username:', username);
      
      // Validate username
      console.log('Validating username...');
      this.validateUsername(username);
      console.log('Username validation passed');
      
      // Check if username is unique (with fallback for permission issues)
      console.log('Checking username uniqueness...');
      try {
        const isUnique = await this.isUsernameUnique(username);
        console.log('Username uniqueness check result:', isUnique);
        
        if (!isUnique) {
          throw new Error('Username is already taken. Please choose a different one.');
        }
      } catch (uniquenessError) {
        console.warn('Username uniqueness check failed:', uniquenessError);
        console.log('Proceeding with signup - Firebase Auth will handle duplicates if needed.');
        // Continue with signup even if uniqueness check fails
      }

      // Create a unique email for Firebase Auth (since Firebase requires email)
      const uniqueEmail = `${username}@jefitness.local`;
      console.log('Generated unique email:', uniqueEmail);
      
      // Create user account in Firebase Auth
      console.log('Creating user account in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, uniqueEmail, password);
      const user = userCredential.user;
      
      console.log('User created in Auth with UID:', user.uid);

      // Create user document in Realtime Database
      const userData = {
        username: username,
        email: uniqueEmail, // Store the generated email for reference
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: {},
        streak: 0,
        lastWorkoutDate: null,
        emojiAvatar: '💪' // Default emoji avatar
      };

      console.log('Creating user document in database:', userData);
      
      // Create user document
      await set(ref(database, `users/${user.uid}`), userData);
      console.log('User document created successfully');
      
      // Create username mapping for uniqueness checking
      console.log('Creating username mapping...');
      try {
        await set(ref(database, `usernames/${user.uid}`), {
          username: username,
          uid: user.uid
        });
        console.log('Username mapping created successfully');
      } catch (mappingError) {
        console.warn('Failed to create username mapping:', mappingError);
        console.warn('User account created but username mapping failed. This is not critical.');
        // Don't throw error here - the user account is still created successfully
      }
      
      console.log('User document and username mapping created successfully');

      return { user };
    } catch (error) {
      console.error('Signup error in realtimeAuthService:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  },

  // Sign in existing user
  async signIn(username, password) {
    try {
      // Try to find user by username mapping first
      let userEmail = `${username}@jefitness.local`;
      
      try {
        const usernameQuery = query(
          ref(database, 'usernames'),
          orderByChild('username'),
          equalTo(username)
        );
        const snapshot = await get(usernameQuery);
        
        if (snapshot.exists()) {
          // Username mapping exists, use it
          const usernameData = Object.values(snapshot.val())[0];
          userEmail = `${username}@jefitness.local`;
        } else {
          // Username mapping doesn't exist, try direct signin with generated email
          console.log('Username mapping not found, trying direct signin...');
        }
      } catch (mappingError) {
        console.warn('Error checking username mapping:', mappingError);
        console.log('Falling back to direct signin with generated email...');
        // Continue with generated email
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;
      
      // Ensure user document exists in database
      await this.ensureUserDocument(user.uid, username);
      
      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Create or ensure user document exists
  async ensureUserDocument(userId, username) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        console.log('User document not found, creating it now for:', username);
        const userData = {
          username: username,
          createdAt: new Date().toISOString(),
          totalWorkouts: 0,
          workoutHistory: {},
          streak: 0,
          lastWorkoutDate: null,
          emojiAvatar: '💪' // Default emoji avatar
        };
        
        await set(userRef, userData);
        console.log('User document created successfully');
        return userData;
      }
      
      return userSnapshot.val();
    } catch (error) {
      console.error('Error ensuring user document:', error);
      throw error;
    }
  },

  // Save workout data
  async saveWorkout(workoutData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Get user document to access username
      const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
      if (!userSnapshot.exists()) {
        throw new Error('User document not found');
      }
      
      const userData = userSnapshot.val();
      console.log('Saving workout for user:', userData.username);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Create workout entry with unique key
      const workoutKey = push(ref(database, `users/${currentUser.uid}/workoutHistory`)).key;
      const workoutEntry = {
        ...workoutData,
        date: today,
        timestamp: new Date().toISOString()
      };

      console.log('Workout entry to save:', workoutEntry);

      // Calculate new streak
      let newStreak = userData.streak || 0;
      const lastWorkoutDate = userData.lastWorkoutDate;
      
      if (lastWorkoutDate === today) {
        // Already worked out today, don't increment streak
        console.log('Already worked out today, keeping streak at:', newStreak);
      } else if (lastWorkoutDate) {
        const lastDate = new Date(lastWorkoutDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Worked out yesterday, increment streak
          newStreak = (userData.streak || 0) + 1;
          console.log('Worked out yesterday, incrementing streak to:', newStreak);
        } else if (diffDays > 1) {
          // Didn't workout yesterday, reset streak to 1
          newStreak = 1;
          console.log('Missed yesterday, resetting streak to:', newStreak);
        } else {
          // Same day or future date (shouldn't happen), keep current streak
          newStreak = userData.streak || 0;
          console.log('Keeping current streak:', newStreak);
        }
      } else {
        // First workout ever, start streak at 1
        newStreak = 1;
        console.log('First workout ever, starting streak at:', newStreak);
      }

      // Update user data
      const updates = {};
      updates[`users/${currentUser.uid}/workoutHistory/${workoutKey}`] = workoutEntry;
      updates[`users/${currentUser.uid}/totalWorkouts`] = (userData.totalWorkouts || 0) + 1;
      updates[`users/${currentUser.uid}/streak`] = newStreak;
      updates[`users/${currentUser.uid}/lastWorkoutDate`] = today;

      console.log('Updating database with:', updates);

      await update(ref(database), updates);

      console.log('Workout saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  },

  // Get user stats
  async getUserStats() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      const userSnapshot = await get(ref(database, `users/${currentUser.uid}`));
      if (userSnapshot.exists()) {
        const data = userSnapshot.val();
        // Convert workoutHistory object to array for compatibility
        if (data.workoutHistory && typeof data.workoutHistory === 'object') {
          data.workoutHistory = Object.values(data.workoutHistory);
        }
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Listen for auth state changes
  onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
  },

  // Utility function to manually create user document (for debugging)
  async createUserDocumentManually() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Extract username from the generated email
      const username = currentUser.email.replace('@jefitness.local', '');
      console.log('Manually creating user document for username:', username);
      
      const userData = {
        username: username,
        email: currentUser.email,
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: {},
        streak: 0,
        lastWorkoutDate: null,
        emojiAvatar: '💪' // Default emoji avatar
      };

      await set(ref(database, `users/${currentUser.uid}`), userData);
      console.log('User document created manually');
      return true;
    } catch (error) {
      console.error('Error creating user document manually:', error);
      return false;
    }
  },

  // Save custom workout template
  async saveCustomWorkout(customWorkout) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const customWorkoutKey = push(ref(database, `users/${currentUser.uid}/customWorkouts`)).key;
      const customWorkoutEntry = {
        ...customWorkout,
        createdAt: new Date().toISOString(),
        id: customWorkoutKey
      };

      await set(ref(database, `users/${currentUser.uid}/customWorkouts/${customWorkoutKey}`), customWorkoutEntry);
      console.log('Custom workout saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving custom workout:', error);
      return false;
    }
  },

  // Get user's custom workouts
  async getCustomWorkouts() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const customWorkoutsSnapshot = await get(ref(database, `users/${currentUser.uid}/customWorkouts`));
      if (customWorkoutsSnapshot.exists()) {
        const customWorkouts = customWorkoutsSnapshot.val();
        return Object.values(customWorkouts);
      }
      return [];
    } catch (error) {
      console.error('Error fetching custom workouts:', error);
      return [];
    }
  },

  // Update user data (for deleting workouts, etc.)
  async updateUserData(updatedUserData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Convert workoutHistory array back to object format for Firebase
      const workoutHistoryObject = {};
      if (updatedUserData.workoutHistory && Array.isArray(updatedUserData.workoutHistory)) {
        updatedUserData.workoutHistory.forEach((workout, index) => {
          workoutHistoryObject[`workout_${index}`] = workout;
        });
      }

      const userDataToUpdate = {
        ...updatedUserData,
        workoutHistory: workoutHistoryObject
      };

      await set(ref(database, `users/${currentUser.uid}`), userDataToUpdate);
      console.log('User data updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  },

  // Get all users (for Cardio Crew feature)
  async getAllUsers() {
    try {
      console.log('Fetching all users from database...');
      
      // Check if user is authenticated
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.error('No authenticated user found');
        throw new Error('User must be logged in to view other users');
      }
      
      const usersSnapshot = await get(ref(database, 'users'));
      console.log('Users snapshot exists:', usersSnapshot.exists());
      console.log('Users snapshot value:', usersSnapshot.val());
      
      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        console.log('Raw users data:', users);
        
        // Convert to array and add uid to each user object
        const usersArray = Object.entries(users).map(([uid, userData]) => ({
          uid,
          username: userData.username || 'Unknown User',
          streak: userData.streak || 0,
          totalWorkouts: userData.totalWorkouts || 0,
          createdAt: userData.createdAt || null,
          emojiAvatar: userData.emojiAvatar || '💪'
        }));
        
        console.log('Processed users array:', usersArray);
        return usersArray;
      }
      console.log('No users found in database');
      return [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Database permission denied. Please check your Firebase database rules.');
      } else if (error.message.includes('permission')) {
        throw new Error('Permission error. Make sure your database rules allow reading user data.');
      } else {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    }
  },

  // Get current user's friends
  async getFriends() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const friendsSnapshot = await get(ref(database, `users/${currentUser.uid}/friends`));
      if (friendsSnapshot.exists()) {
        const friends = friendsSnapshot.val();
        // Convert to array and add uid to each friend object
        return Object.entries(friends).map(([uid, friendData]) => ({
          uid,
          ...friendData
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching friends:', error);
      return [];
    }
  },

  // Add a friend to current user's Cardio Crew
  async addFriend(friendUid) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Get friend's user data
      const friendSnapshot = await get(ref(database, `users/${friendUid}`));
      if (!friendSnapshot.exists()) {
        throw new Error('User not found');
      }

      const friendData = friendSnapshot.val();
      
      // Add friend to current user's friends list
      await set(ref(database, `users/${currentUser.uid}/friends/${friendUid}`), {
        username: friendData.username,
        streak: friendData.streak || 0,
        emojiAvatar: friendData.emojiAvatar || '💪',
        addedAt: new Date().toISOString()
      });

      console.log('Friend added successfully');
      return true;
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  },

  // Remove a friend from current user's Cardio Crew
  async removeFriend(friendUid) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Remove friend from current user's friends list
      await set(ref(database, `users/${currentUser.uid}/friends/${friendUid}`), null);

      console.log('Friend removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  // Update user's emoji avatar
  async updateEmojiAvatar(emoji) {
    try {
      console.log('Updating emoji avatar to:', emoji);
      
      // Validate emoji parameter
      if (!emoji || emoji.trim() === '') {
        throw new Error('Invalid emoji: emoji cannot be empty or undefined');
      }
      
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      console.log('Current user UID:', currentUser.uid);

      // First, check if the user document exists
      const userRef = ref(database, `users/${currentUser.uid}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        console.error('User document does not exist');
        throw new Error('User profile not found. Please try logging in again.');
      }

      console.log('User document exists, updating emoji avatar...');

      // Update the emoji avatar
      await set(ref(database, `users/${currentUser.uid}/emojiAvatar`), emoji);

      console.log('Emoji avatar updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating emoji avatar:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Database permission denied. Please check your Firebase database rules.');
      } else if (error.message.includes('permission')) {
        throw new Error('Permission error. Make sure your database rules allow writing to user data.');
      } else if (error.message.includes('User profile not found')) {
        throw new Error('User profile not found. Please try logging in again.');
      } else if (error.message.includes('Invalid emoji')) {
        throw new Error('Invalid emoji selected. Please try again.');
      } else {
        throw new Error(`Failed to update avatar: ${error.message}`);
      }
    }
  }
}; 