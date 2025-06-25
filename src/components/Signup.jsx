import { useState } from 'react';
import { realtimeAuthService } from '../services/realtimeAuthService';
import { captchaService } from '../services/captchaService';

const Signup = ({ onSwitchToLogin, onSignupSuccess, onBackToWorkout }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(captchaService.generateSimpleCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate username length
    if (username.length < 6) {
      setError('Username must be at least 6 characters long.');
      return;
    }

    // Validate username contains no whitespace
    if (/\s/.test(username)) {
      setError('Username cannot contain any whitespace characters.');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Verify captcha
    if (captchaAnswer !== captcha.answer) {
      setError('Please solve the captcha correctly.');
      setCaptcha(captchaService.generateSimpleCaptcha());
      setCaptchaAnswer('');
      return;
    }

    setLoading(true);

    try {
      await realtimeAuthService.signUp(username, password);
      onSignupSuccess();
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this username already exists. Please sign in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid username.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Email/password accounts are not enabled. Please contact support.');
      } else if (error.message && error.message.includes('Username is already taken')) {
        setError('Username is already taken. Please choose a different one.');
      } else if (error.message && error.message.includes('Username must be at least 6 characters')) {
        setError('Username must be at least 6 characters long.');
      } else if (error.message && error.message.includes('Username cannot contain any whitespace')) {
        setError('Username cannot contain any whitespace characters.');
      } else if (error.message && error.message.includes('Failed to check username availability')) {
        setError('Unable to check username availability. Please try again.');
      } else {
        // Show the actual error message for debugging
        setError(`Signup failed: ${error.message || 'Unknown error occurred'}`);
      }
      
      // Generate new captcha on error
      setCaptcha(captchaService.generateSimpleCaptcha());
      setCaptchaAnswer('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join J&E Fitness! 🎉</h2>
        <p className="text-gray-600">Create your account to start tracking your workouts</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Choose a username (min 6 characters, no spaces)"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Create a password (min 6 characters)"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Captcha Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Check 🔒
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 font-medium">{captcha.question}</span>
            <button
              type="button"
              onClick={() => {
                setCaptcha(captchaService.generateSimpleCaptcha());
                setCaptchaAnswer('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ↻
            </button>
          </div>
          <input
            type="text"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your answer"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={onBackToWorkout}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
          >
            ← Back to Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup; 