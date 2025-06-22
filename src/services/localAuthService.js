// Local Authentication Service using localStorage
// This is for development/demo purposes only

const USERS_KEY = 'moodRunUsers';
const CURRENT_USER_KEY = 'moodRunCurrentUser';

export const localAuthService = {
  // Register a new user
  async signUp(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        totalWorkouts: 0,
        workoutHistory: [],
        streak: 0,
        lastWorkoutDate: null
      };

      users[email] = newUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Auto-login the user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return { user: newUser };
    } catch (error) {
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      const user = users[email];

      if (!user) {
        throw new Error('No account found with this email');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password');
      }

      // Set current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Save workout data
  async saveWorkout(workoutData) {
    try {
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      const user = users[currentUser.email];
      
      if (!user) {
        throw new Error('User not found');
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Create workout entry
      const workoutEntry = {
        ...workoutData,
        date: today,
        timestamp: new Date().toISOString()
      };

      // Calculate new streak
      let newStreak = user.streak || 0;
      const lastWorkoutDate = user.lastWorkoutDate;
      
      if (lastWorkoutDate === today) {
        // Already worked out today, don't increment streak
      } else if (lastWorkoutDate) {
        const lastDate = new Date(lastWorkoutDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Worked out yesterday, increment streak
          newStreak = (user.streak || 0) + 1;
        } else if (diffDays > 1) {
          // Didn't workout yesterday, reset streak to 1
          newStreak = 1;
        }
      } else {
        // First workout ever, start streak at 1
        newStreak = 1;
      }

      // Update user data
      user.workoutHistory.push(workoutEntry);
      user.totalWorkouts = (user.totalWorkouts || 0) + 1;
      user.streak = newStreak;
      user.lastWorkoutDate = today;

      // Update localStorage
      users[currentUser.email] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  },

  // Get user stats
  async getUserStats() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[currentUser.email];
    
    return user || null;
  },

  // Listen for auth state changes (simulated)
  onAuthStateChanged(callback) {
    // Check for existing user on load
    const currentUser = this.getCurrentUser();
    callback(currentUser);

    // Set up a simple listener (for demo purposes)
    const checkAuthState = () => {
      const user = this.getCurrentUser();
      callback(user);
    };

    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', checkAuthState);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', checkAuthState);
    };
  }
}; 