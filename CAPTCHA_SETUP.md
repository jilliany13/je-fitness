# Captcha Setup Guide for Firebase Authentication

## Overview
This guide shows you how to implement captcha protection in your Firebase authentication system. We've implemented a simple math captcha as a starting point, with options to upgrade to Google reCAPTCHA.

## Current Implementation

### ✅ What's Already Implemented
- **Simple Math Captcha**: A basic addition problem that users must solve
- **Integrated in Login & Signup**: Both forms now require captcha verification
- **User-Friendly Design**: Clean UI with refresh button and clear instructions
- **Error Handling**: Proper validation and error messages

### 🔧 How It Works
1. User fills out login/signup form
2. User solves a simple math problem (e.g., "What is 5 + 3?")
3. Form validates the answer before proceeding with authentication
4. New captcha is generated on errors or refresh

## Free Upgrade Options

### Option 1: Google reCAPTCHA v3 (Recommended)
**Cost**: Completely FREE
**Features**: 
- Runs in background (no user interaction required)
- Scores user behavior automatically
- Most user-friendly option

#### Setup Steps:
1. **Get reCAPTCHA Keys**:
   - Go to https://www.google.com/recaptcha/admin
   - Create a new site
   - Choose reCAPTCHA v3
   - Add your domain (localhost for development)
   - Copy the Site Key and Secret Key

2. **Update HTML**:
   ```html
   <!-- Replace YOUR_RECAPTCHA_SITE_KEY in index.html -->
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_ACTUAL_SITE_KEY"></script>
   ```

3. **Update captchaService.js**:
   ```javascript
   // Replace YOUR_RECAPTCHA_SITE_KEY with your actual key
   const token = await window.grecaptcha.execute('YOUR_ACTUAL_SITE_KEY', { action });
   ```

4. **Backend Verification** (Optional):
   - Create a simple backend endpoint to verify tokens
   - Use the Secret Key to verify with Google's API

### Option 2: Google reCAPTCHA v2
**Cost**: Completely FREE
**Features**:
- Traditional "I'm not a robot" checkbox
- More visible security measure

### Option 3: Firebase App Check
**Cost**: Completely FREE
**Features**:
- Protects against abuse and bot attacks
- Works with Firebase services
- No user interaction required

## Advanced Implementation

### Custom Captcha Types
You can extend the `captchaService.js` to include different types:

```javascript
// Add to captchaService.js
generateImageCaptcha() {
  // Generate image-based captcha
},

generatePuzzleCaptcha() {
  // Generate puzzle-based captcha
},

generateTimeBasedCaptcha() {
  // Generate time-based challenges
}
```

### Rate Limiting
Add rate limiting to prevent brute force attacks:

```javascript
// Add to your auth service
const loginAttempts = new Map();

const checkRateLimit = (email) => {
  const attempts = loginAttempts.get(email) || 0;
  if (attempts >= 5) {
    throw new Error('Too many login attempts. Please try again later.');
  }
  loginAttempts.set(email, attempts + 1);
};
```

## Security Best Practices

### ✅ Implemented
- Client-side captcha validation
- Error handling and user feedback
- Clean UI/UX design

### 🔄 Recommended Additions
1. **Server-side verification** for reCAPTCHA tokens
2. **Rate limiting** for failed attempts
3. **IP-based blocking** for suspicious activity
4. **Logging** of failed authentication attempts

## Testing

### Current Captcha
- Test the math captcha by entering wrong answers
- Verify refresh button generates new problems
- Check error handling on failed attempts

### reCAPTCHA Testing
- Use test keys provided by Google
- Test in different browsers and devices
- Verify token generation and validation

## Troubleshooting

### Common Issues
1. **reCAPTCHA not loading**: Check script tag and site key
2. **Captcha not working**: Verify service integration
3. **Styling issues**: Check CSS classes and responsive design

### Debug Mode
Enable debug logging in `captchaService.js`:
```javascript
const DEBUG = true;
if (DEBUG) console.log('Captcha execution:', action);
```

## Next Steps

1. **Choose your captcha type** (current math captcha is working)
2. **Get reCAPTCHA keys** if upgrading to Google's service
3. **Test thoroughly** in your development environment
4. **Deploy and monitor** for any issues

## Support

- **Google reCAPTCHA**: https://developers.google.com/recaptcha
- **Firebase App Check**: https://firebase.google.com/docs/app-check
- **Current Implementation**: Check the code comments for details

---

**Note**: The current math captcha implementation is fully functional and provides basic protection against automated attacks. For production use, consider upgrading to reCAPTCHA v3 for better security and user experience. 