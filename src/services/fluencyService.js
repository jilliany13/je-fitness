// Fitness Fluency Service - Duolingo-style progress tracking
export const fluencyService = {
  // Skill levels for different workout types
  skillLevels: {
    'Gym': { name: 'Strength Master', emoji: '🏋️‍♂️', color: 'purple' },
    'Running': { name: 'Endurance Runner', emoji: '🏃‍♂️', color: 'green' },
    'Basketball': { name: 'Court Champion', emoji: '🏀', color: 'orange' },
    'Swimming': { name: 'Aqua Athlete', emoji: '🏊‍♂️', color: 'cyan' },
    'Tennis': { name: 'Racket Pro', emoji: '🎾', color: 'yellow' },
    'Volleyball': { name: 'Team Player', emoji: '🏐', color: 'blue' },
    'Boxing': { name: 'Combat Warrior', emoji: '🥊', color: 'red' },
    'Bowling': { name: 'Precision Master', emoji: '🎳', color: 'teal' },
    'Yoga': { name: 'Mind-Body Guru', emoji: '🧘‍♀️', color: 'rose' },
    'Soccer': { name: 'Field Legend', emoji: '⚽', color: 'emerald' },
    'Table Tennis': { name: 'Ping Pong Pro', emoji: '🏓', color: 'pink' },
    'Cycling': { name: 'Road Warrior', emoji: '🚴‍♂️', color: 'lime' },
    'Badminton': { name: 'Shuttle Master', emoji: '🏸', color: 'indigo' },
    'Walking': { name: 'Stroll Master', emoji: '🏃‍♀️', color: 'slate' },
    'CrossFit': { name: 'Elite Athlete', emoji: '🏋️‍♀️', color: 'amber' }
  },

  // Calculate overall fluency score (0-100)
  calculateFluencyScore(userData) {
    if (!userData || !userData.workoutHistory || userData.workoutHistory.length === 0) {
      return 0;
    }

    const workouts = userData.workoutHistory;
    const totalWorkouts = workouts.length;
    const streak = userData.streak || 0;
    
    // Calculate consistency score (0-30 points)
    const consistencyScore = Math.min(30, (streak / 7) * 30); // Max 30 points for 7+ day streak
    
    // Calculate variety score (0-25 points)
    const uniqueWorkoutTypes = new Set(workouts.map(w => w.workoutType)).size;
    const varietyScore = Math.min(25, (uniqueWorkoutTypes / 5) * 25); // Max 25 points for 5+ workout types
    
    // Calculate frequency score (0-25 points)
    const daysSinceFirstWorkout = this.getDaysSinceFirstWorkout(workouts);
    const frequencyScore = Math.min(25, (totalWorkouts / Math.max(1, daysSinceFirstWorkout)) * 25);
    
    // Calculate mood improvement score (0-20 points)
    const moodImprovementScore = this.calculateMoodImprovementScore(workouts);
    
    const totalScore = Math.round(consistencyScore + varietyScore + frequencyScore + moodImprovementScore);
    return Math.min(100, totalScore);
  },

  // Calculate skill level for a specific workout type (1-5)
  calculateSkillLevel(workoutType, userData) {
    if (!userData || !userData.workoutHistory) return 1;
    
    const workoutsOfType = userData.workoutHistory.filter(w => w.workoutType === workoutType);
    const count = workoutsOfType.length;
    
    // Level progression: 1-3 workouts = Level 1, 4-7 = Level 2, 8-12 = Level 3, 13-18 = Level 4, 19+ = Level 5
    if (count >= 19) return 5;
    if (count >= 13) return 4;
    if (count >= 8) return 3;
    if (count >= 4) return 2;
    return 1;
  },

  // Calculate progress percentage for a skill level (0-100)
  calculateSkillProgress(workoutType, userData) {
    if (!userData || !userData.workoutHistory) return 0;
    
    const workoutsOfType = userData.workoutHistory.filter(w => w.workoutType === workoutType);
    const count = workoutsOfType.length;
    
    // Progress within current level
    let progress;
    if (count < 4) progress = (count / 3) * 100; // Level 1: 0-3 workouts
    else if (count < 8) progress = ((count - 3) / 4) * 100; // Level 2: 4-7 workouts
    else if (count < 13) progress = ((count - 7) / 5) * 100; // Level 3: 8-12 workouts
    else if (count < 19) progress = ((count - 12) / 6) * 100; // Level 4: 13-18 workouts
    else progress = 100; // Level 5: 19+ workouts
    
    return Math.round(progress);
  },

  // Get skill level name and requirements
  getSkillLevelInfo(level) {
    const levelInfo = {
      1: { name: 'Beginner', requirement: '1-3 workouts', color: 'gray' },
      2: { name: 'Intermediate', requirement: '4-7 workouts', color: 'blue' },
      3: { name: 'Advanced', requirement: '8-12 workouts', color: 'green' },
      4: { name: 'Expert', requirement: '13-18 workouts', color: 'purple' },
      5: { name: 'Master', requirement: '19+ workouts', color: 'gold' }
    };
    return levelInfo[level] || levelInfo[1];
  },

  // Calculate mood improvement score
  calculateMoodImprovementScore(workouts) {
    if (!workouts || workouts.length === 0) return 0;
    
    let improvementCount = 0;
    let totalWithPostMood = 0;
    
    workouts.forEach(workout => {
      if (workout.postRunMood) {
        totalWithPostMood++;
        if (workout.postRunMood === 'Much Better' || workout.postRunMood === 'Better') {
          improvementCount++;
        }
      }
    });
    
    if (totalWithPostMood === 0) return 0;
    return Math.round((improvementCount / totalWithPostMood) * 20);
  },

  // Get days since first workout
  getDaysSinceFirstWorkout(workouts) {
    if (!workouts || workouts.length === 0) return 0;
    
    const firstWorkout = workouts.reduce((earliest, current) => {
      return new Date(current.date) < new Date(earliest.date) ? current : earliest;
    });
    
    const firstDate = new Date(firstWorkout.date);
    const today = new Date();
    const diffTime = today - firstDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Get weekly goal progress
  getWeeklyGoalProgress(userData) {
    if (!userData || !userData.workoutHistory) return { current: 0, goal: this.getWeeklyGoal(userData), percentage: 0 };
    
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyWorkouts = userData.workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo;
    }).length;
    
    const goal = this.getWeeklyGoal(userData);
    const percentage = Math.min(100, Math.round((weeklyWorkouts / goal) * 100));
    
    return { current: weeklyWorkouts, goal, percentage };
  },

  // Get user's weekly goal (default 3, or from userData)
  getWeeklyGoal(userData) {
    return userData?.weeklyGoal || 3;
  },

  // Set user's weekly goal
  async setWeeklyGoal(goal) {
    try {
      const { realtimeAuthService } = await import('./realtimeAuthService');
      const currentUser = realtimeAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const { update, ref } = await import('firebase/database');
      const { database } = await import('../firebase');

      await update(ref(database, `users/${currentUser.uid}`), {
        weeklyGoal: goal
      });

      return true;
    } catch (error) {
      console.error('Error setting weekly goal:', error);
      return false;
    }
  },

  // Get achievements based on user data
  getAchievements(userData) {
    if (!userData || !userData.workoutHistory) return [];
    
    const achievements = [];
    const workouts = userData.workoutHistory;
    const totalWorkouts = workouts.length;
    const streak = userData.streak || 0;
    const uniqueTypes = new Set(workouts.map(w => w.workoutType)).size;
    
    // Calculate mood improvement percentage
    let moodImprovementCount = 0;
    let totalWithPostMood = 0;
    workouts.forEach(workout => {
      if (workout.postRunMood) {
        totalWithPostMood++;
        if (workout.postRunMood === 'Much Better' || workout.postRunMood === 'Better') {
          moodImprovementCount++;
        }
      }
    });
    const moodImprovementPercentage = totalWithPostMood > 0 ? (moodImprovementCount / totalWithPostMood) * 100 : 0;

    // First workout achievement
    achievements.push({
      id: 'first-workout',
      name: 'First Steps',
      description: 'Complete your first workout',
      emoji: '🎉',
      unlocked: totalWorkouts >= 1,
      date: totalWorkouts >= 1 ? workouts[0]?.date : null,
      requirement: '1 workout'
    });
    
    // Streak achievements
    achievements.push({
      id: 'streak-3',
      name: 'Getting Started',
      description: 'Maintain a 3-day streak',
      emoji: '🔥',
      unlocked: streak >= 3,
      requirement: '3-day streak'
    });
    
    achievements.push({
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      emoji: '⚡',
      unlocked: streak >= 7,
      requirement: '7-day streak'
    });
    
    achievements.push({
      id: 'streak-14',
      name: 'Consistency Master',
      description: 'Maintain a 14-day streak',
      emoji: '💪',
      unlocked: streak >= 14,
      requirement: '14-day streak'
    });
    
    achievements.push({
      id: 'streak-30',
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      emoji: '👑',
      unlocked: streak >= 30,
      requirement: '30-day streak'
    });
    
    achievements.push({
      id: 'streak-100',
      name: 'Legendary',
      description: 'Maintain a 100-day streak',
      emoji: '🏆',
      unlocked: streak >= 100,
      requirement: '100-day streak'
    });
    
    // Workout count achievements
    achievements.push({
      id: 'workouts-5',
      name: 'Getting Active',
      description: 'Complete 5 workouts',
      emoji: '🚶‍♂️',
      unlocked: totalWorkouts >= 5,
      requirement: '5 workouts'
    });
    
    achievements.push({
      id: 'workouts-10',
      name: 'Dedicated',
      description: 'Complete 10 workouts',
      emoji: '💪',
      unlocked: totalWorkouts >= 10,
      requirement: '10 workouts'
    });
    
    achievements.push({
      id: 'workouts-25',
      name: 'Fitness Enthusiast',
      description: 'Complete 25 workouts',
      emoji: '🏃‍♂️',
      unlocked: totalWorkouts >= 25,
      requirement: '25 workouts'
    });
    
    achievements.push({
      id: 'workouts-50',
      name: 'Fitness Fanatic',
      description: 'Complete 50 workouts',
      emoji: '🏆',
      unlocked: totalWorkouts >= 50,
      requirement: '50 workouts'
    });
    
    achievements.push({
      id: 'workouts-100',
      name: 'Century Club',
      description: 'Complete 100 workouts',
      emoji: '💯',
      unlocked: totalWorkouts >= 100,
      requirement: '100 workouts'
    });
    
    // Variety achievements
    achievements.push({
      id: 'variety-3',
      name: 'Explorer',
      description: 'Try 3 different workout types',
      emoji: '🗺️',
      unlocked: uniqueTypes >= 3,
      requirement: '3 workout types'
    });
    
    achievements.push({
      id: 'variety-5',
      name: 'Well-Rounded',
      description: 'Try 5 different workout types',
      emoji: '🌟',
      unlocked: uniqueTypes >= 5,
      requirement: '5 workout types'
    });
    
    achievements.push({
      id: 'variety-10',
      name: 'Adventure Seeker',
      description: 'Try 10 different workout types',
      emoji: '🚀',
      unlocked: uniqueTypes >= 10,
      requirement: '10 workout types'
    });
    
    achievements.push({
      id: 'variety-15',
      name: 'Master of All',
      description: 'Try all 15 workout types',
      emoji: '🎯',
      unlocked: uniqueTypes >= 15,
      requirement: 'All 15 types'
    });
    
    // Mood improvement achievements
    achievements.push({
      id: 'mood-50',
      name: 'Mood Booster',
      description: 'Improve mood in 50% of workouts',
      emoji: '😊',
      unlocked: moodImprovementPercentage >= 50,
      requirement: '50% mood improvement'
    });
    
    achievements.push({
      id: 'mood-75',
      name: 'Happiness Guru',
      description: 'Improve mood in 75% of workouts',
      emoji: '😄',
      unlocked: moodImprovementPercentage >= 75,
      requirement: '75% mood improvement'
    });
    
    achievements.push({
      id: 'mood-90',
      name: 'Joy Master',
      description: 'Improve mood in 90% of workouts',
      emoji: '🌈',
      unlocked: moodImprovementPercentage >= 90,
      requirement: '90% mood improvement'
    });
    
    // Weekly goal achievements
    const weeklyGoal = this.getWeeklyGoal(userData);
    const weeklyProgress = this.getWeeklyGoalProgress(userData);
    
    achievements.push({
      id: 'weekly-goal-1',
      name: 'Goal Setter',
      description: 'Meet your weekly goal once',
      emoji: '🎯',
      unlocked: weeklyProgress.current >= weeklyGoal,
      requirement: 'Meet weekly goal'
    });
    
    // Special achievements
    achievements.push({
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete a workout before 8 AM',
      emoji: '🌅',
      unlocked: workouts.some(w => {
        const workoutTime = new Date(w.timestamp);
        return workoutTime.getHours() < 8;
      }),
      requirement: 'Workout before 8 AM'
    });
    
    achievements.push({
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete a workout after 10 PM',
      emoji: '🦉',
      unlocked: workouts.some(w => {
        const workoutTime = new Date(w.timestamp);
        return workoutTime.getHours() >= 22;
      }),
      requirement: 'Workout after 10 PM'
    });
    
    achievements.push({
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      description: 'Complete workouts on 3 consecutive weekends',
      emoji: '🏖️',
      unlocked: false, // Complex logic would be needed for this
      requirement: '3 weekend workouts'
    });
    
    return achievements;
  },

  // Get fluency level based on score
  getFluencyLevel(score) {
    if (score >= 90) return { level: 'Elite', color: 'gold', emoji: '👑' };
    if (score >= 75) return { level: 'Advanced', color: 'purple', emoji: '⭐' };
    if (score >= 50) return { level: 'Intermediate', color: 'blue', emoji: '🔥' };
    if (score >= 25) return { level: 'Beginner', color: 'green', emoji: '🌱' };
    return { level: 'Novice', color: 'gray', emoji: '🎯' };
  }
}; 