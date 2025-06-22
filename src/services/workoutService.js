import { localAuthService } from './localAuthService';

export const saveWorkout = async (workoutData) => {
  try {
    const success = await localAuthService.saveWorkout(workoutData);
    return success;
  } catch (error) {
    console.error('Error saving workout:', error);
    return false;
  }
};

export const getUserStats = async () => {
  try {
    const stats = await localAuthService.getUserStats();
    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}; 