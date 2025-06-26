import { useState } from 'react';
import { useHoverSupport } from './useHoverSupport';

const CustomWorkoutInput = ({ onWorkoutCreate, onBack, isLoggedIn = false }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [saveWorkout, setSaveWorkout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supportsHover = useHoverSupport();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workoutName.trim()) return;
    
    setIsSubmitting(true);
    const customWorkout = {
      label: workoutName.trim(),
      description: workoutDescription.trim() || 'Custom workout',
      isCustom: true,
      shouldSave: saveWorkout
    };
    
    onWorkoutCreate(customWorkout);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create Custom Workout
        </h2>
        <p className="text-gray-600">
          Design your own workout routine
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-2">
            Workout Name *
          </label>
          <input
            type="text"
            id="workoutName"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Morning Circuit, HIIT Training, Core Focus"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="workoutDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="workoutDescription"
            value={workoutDescription}
            onChange={(e) => setWorkoutDescription(e.target.value)}
            placeholder="Describe your workout routine, exercises, or goals..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="3"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {workoutDescription.length}/200
          </div>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <input
              type="checkbox"
              id="saveWorkout"
              checked={saveWorkout}
              onChange={(e) => setSaveWorkout(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="saveWorkout" className="text-sm text-blue-800 font-medium">
              Save this workout for future use
            </label>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 <strong>Sign up or log in</strong> to save your custom workouts for future use!
            </p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className={`flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold transition-all duration-200 ${
              supportsHover ? 'hover:bg-gray-50 hover:border-gray-400' : ''
            }`}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!workoutName.trim() || isSubmitting}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
              workoutName.trim() && !isSubmitting
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomWorkoutInput; 