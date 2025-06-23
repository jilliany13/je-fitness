// Captcha service for Firebase authentication
export const captchaService = {
  // Initialize reCAPTCHA
  init() {
    if (typeof window.grecaptcha === 'undefined') {
      console.warn('reCAPTCHA not loaded. Make sure to add the script to your HTML.');
      return false;
    }
    return true;
  },

  // Execute reCAPTCHA and get token
  async execute(action = 'login') {
    try {
      if (!this.init()) {
        throw new Error('reCAPTCHA not available');
      }

      const token = await window.grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      throw error;
    }
  },

  // Verify token on your backend (you'll need a backend endpoint)
  async verifyToken(token) {
    try {
      // This would typically call your backend to verify the token
      // For now, we'll return true as a placeholder
      // In production, you'd make an API call to your backend
      console.log('Verifying reCAPTCHA token:', token);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },

  // Simple captcha challenge (fallback option)
  generateSimpleCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    
    return {
      question: `What is ${num1} + ${num2}?`,
      answer: answer.toString()
    };
  }
}; 