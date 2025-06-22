# Firebase Realtime Database Setup Guide

This guide will help you set up Firebase Realtime Database for your Mood Run app.

## Why Realtime Database?

Realtime Database is perfect for personal apps because:
- **Simpler setup** - No complex security rules needed
- **Better free tier** - 1GB storage and 10GB/month transfer
- **Real-time sync** - Data updates instantly across devices
- **Lower costs** - More affordable for small projects
- **Easier to understand** - JSON-like structure

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `je-fitness` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Create Realtime Database

1. In your Firebase project, click "Realtime Database" in the left sidebar
2. Click "Create database"
3. Choose a location (pick the closest to your users)
4. **IMPORTANT**: Start in **test mode** (we'll secure it later)
5. Click "Done"

## Step 3: Get Your Database URL

1. In the Realtime Database section, you'll see your database URL
2. It looks like: `https://your-project-id-default-rtdb.firebaseio.com`
3. Copy this URL - you'll need it for the next step

## Step 4: Update Your Firebase Config

1. Open `src/firebase.js` in your project
2. Replace the `databaseURL` with your actual database URL:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-ABC123",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com" // ← Update this!
};
```

## Step 5: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 6: Test Your Setup

1. Run your app: `npm run dev`
2. Click the "🔧 Test Firebase Connection" button
3. Click "Run Tests"
4. All tests should pass with green checkmarks ✅

## Step 7: Secure Your Database (Optional)

Once everything works, you can secure your database:

1. In Realtime Database, go to "Rules" tab
2. Replace the rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "test": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click "Publish"

## Troubleshooting

### "Permission denied" error
- Make sure you're in test mode
- Check that your database URL is correct
- Verify the rules allow read/write

### "Database not found" error
- Double-check your database URL
- Make sure you created a Realtime Database (not Firestore)
- Verify your project ID matches

### Connection timeout
- Check your internet connection
- Try refreshing the page
- Verify your Firebase project is active

## Database Structure

Your data will be stored like this:

```
your-database/
├── users/
│   └── [user-id]/
│       ├── email: "user@example.com"
│       ├── totalWorkouts: 5
│       ├── streak: 3
│       ├── lastWorkoutDate: "2024-01-15"
│       └── workoutHistory/
│           ├── [workout-id-1]/
│           │   ├── workoutType: "Running"
│           │   ├── preRunMood: "Feeling Good"
│           │   ├── postRunMood: "Much Better"
│           │   ├── energyLevel: "High"
│           │   ├── duration: 30
│           │   ├── notes: "Great run today!"
│           │   ├── date: "2024-01-15"
│           │   └── timestamp: "2024-01-15T10:30:00.000Z"
│           └── [workout-id-2]/
│               └── ...
└── test/ (for testing)
```

## Benefits of This Setup

✅ **Simple**: No complex queries or indexes needed
✅ **Real-time**: Data syncs instantly across devices  
✅ **Affordable**: Generous free tier for personal use
✅ **Scalable**: Can grow with your needs
✅ **Secure**: User data is protected by authentication

Your Mood Run app is now ready to save workout data to the cloud! 🎉 