import { firebaseAuthService } from './firebaseAuthService';

export const saveWorkout = async (workoutData) => {
  try {
    const success = await firebaseAuthService.saveWorkout(workoutData);
    return success;
  } catch (error) {
    console.error('Error saving workout:', error);
    return false;
  }
};

export const getUserStats = async () => {
  try {
    const stats = await firebaseAuthService.getUserStats();
    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}; 