# Local Authentication System

## Overview

The Mood Run app now uses a local authentication system that stores user data in the browser's localStorage. This approach is perfect for:

- **Development and prototyping**
- **Demo purposes**
- **Offline-first applications**
- **Simple user management without external dependencies**

## How It Works

### User Data Storage
- User accounts are stored in `localStorage` under the key `moodRunUsers`
- Current user session is stored under `moodRunCurrentUser`
- All workout data is saved locally and persists between browser sessions

### Features
- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Workout history tracking
- ✅ Streak calculation
- ✅ Statistics dashboard
- ✅ Data persistence across sessions

### Security Notes
⚠️ **Important**: This is a development/demo system. Passwords are stored in plain text in localStorage, which is **NOT secure** for production use.

## Usage

1. **Create Account**: Users can sign up with email and password
2. **Sign In**: Existing users can log in with their credentials
3. **Workout Tracking**: All workouts are automatically saved to the user's account
4. **Dashboard**: View statistics, workout history, and streaks
5. **Sign Out**: Users can log out and return to the auth screen

## Data Structure

### User Object
```javascript
{
  id: "unique-user-id",
  email: "user@example.com",
  password: "user-password", // Plain text (not secure)
  createdAt: "2024-01-01T00:00:00.000Z",
  totalWorkouts: 5,
  workoutHistory: [...],
  streak: 3,
  lastWorkoutDate: "2024-01-01"
}
```

### Workout Entry
```javascript
{
  workoutType: "Running",
  preRunMood: "Feeling Good",
  postRunMood: "Energized",
  duration: 30,
  recommendation: "Go for a moderate 30-minute run",
  date: "2024-01-01",
  timestamp: "2024-01-01T10:00:00.000Z"
}
```

## Production Considerations

For a production app, consider these alternatives:

1. **Firebase Authentication** - Google's authentication service
2. **Auth0** - Enterprise-grade authentication
3. **Supabase** - Open-source Firebase alternative
4. **Custom Backend** - Your own authentication server
5. **NextAuth.js** - Authentication for Next.js applications

## Testing

To test the authentication system:

1. Run `npm run dev`
2. Create a new account
3. Complete a workout
4. Check the dashboard for statistics
5. Sign out and sign back in
6. Verify data persistence

## Browser Storage

You can inspect the stored data in your browser's developer tools:
- Open DevTools (F12)
- Go to Application/Storage tab
- Look for "Local Storage" → your domain
- Check the `moodRunUsers` and `moodRunCurrentUser` keys 