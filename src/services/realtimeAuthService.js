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
  update 
} from 'firebase/database';
import { auth, database } from '../firebase';

export const realtimeAuthService = {
  // Register a new user
  async signUp(email, password) {
    try {
      console.log('Starting signup process for:', email);
      
      // Create user account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('User created in Auth with UID:', user.uid);

      // Create user document in Realtime Database
      const userData = {
        email: user.email,
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: {},
        streak: 0,
        lastWorkoutDate: null
      };

      console.log('Creating user document in database:', userData);
      
      await set(ref(database, `users/${user.uid}`), userData);
      
      console.log('User document created successfully');

      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Ensure user document exists in database
      await this.ensureUserDocument(user.uid, user.email);
      
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
  async ensureUserDocument(userId, email) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        console.log('User document not found, creating it now for:', email);
        const userData = {
          email: email,
          createdAt: new Date().toISOString(),
          totalWorkouts: 0,
          workoutHistory: {},
          streak: 0,
          lastWorkoutDate: null
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

      console.log('Saving workout for user:', currentUser.email);

      // Ensure user document exists
      const userData = await this.ensureUserDocument(currentUser.uid, currentUser.email);
      
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

      console.log('Manually creating user document for:', currentUser.email);
      
      const userData = {
        email: currentUser.email,
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: {},
        streak: 0,
        lastWorkoutDate: null
      };

      await set(ref(database, `users/${currentUser.uid}`), userData);
      console.log('User document created manually');
      return true;
    } catch (error) {
      console.error('Error creating user document manually:', error);
      return false;
    }
  }
}; 