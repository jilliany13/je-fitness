import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export const firebaseAuthService = {
  // Register a new user
  async signUp(email, password) {
    try {
      // Create user account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: [],
        streak: 0,
        lastWorkoutDate: null
      });

      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
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

  // Save workout data
  async saveWorkout(workoutData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      
      // Get current user data
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Create workout entry
      const workoutEntry = {
        ...workoutData,
        date: today,
        timestamp: new Date().toISOString()
      };

      // Calculate new streak
      let newStreak = userData.streak || 0;
      const lastWorkoutDate = userData.lastWorkoutDate;
      
      if (lastWorkoutDate === today) {
        // Already worked out today, don't increment streak
      } else if (lastWorkoutDate) {
        const lastDate = new Date(lastWorkoutDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Worked out yesterday, increment streak
          newStreak = (userData.streak || 0) + 1;
        } else if (diffDays > 1) {
          // Didn't workout yesterday, reset streak to 1
          newStreak = 1;
        } else {
          // Same day or future date (shouldn't happen), keep current streak
          newStreak = userData.streak || 0;
        }
      } else {
        // First workout ever, start streak at 1
        newStreak = 1;
      }

      // Update user document
      await updateDoc(userRef, {
        workoutHistory: arrayUnion(workoutEntry),
        totalWorkouts: (userData.totalWorkouts || 0) + 1,
        streak: newStreak,
        lastWorkoutDate: today
      });

      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  },

  // Get user stats
  async getUserStats() {
    try {
      console.log('getUserStats called');
      const currentUser = this.getCurrentUser();
      console.log('Current user:', currentUser);
      
      if (!currentUser) {
        console.log('No current user found');
        return null;
      }

      console.log('Fetching user document for UID:', currentUser.uid);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      console.log('User document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('User data:', data);
        return data;
      } else {
        console.log('User document does not exist - creating default user data');
        // Create default user data if document doesn't exist
        const defaultUserData = {
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          totalWorkouts: 0,
          workoutHistory: [],
          streak: 0,
          lastWorkoutDate: null
        };
        
        try {
          await setDoc(doc(db, 'users', currentUser.uid), defaultUserData);
          console.log('Created default user document');
          return defaultUserData;
        } catch (createError) {
          console.error('Error creating user document:', createError);
          // Return default data even if we can't save it
          return defaultUserData;
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
      // Handle offline/connection errors gracefully
      if (error.code === 'failed-precondition' || 
          error.code === 'unavailable' || 
          error.message.includes('offline')) {
        console.log('Firebase is offline - returning default data');
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          return {
            email: currentUser.email,
            createdAt: new Date().toISOString(),
            totalWorkouts: 0,
            workoutHistory: [],
            streak: 0,
            lastWorkoutDate: null
          };
        }
      }
      
      throw error;
    }
  },

  // Listen for auth state changes
  onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
  }
}; 