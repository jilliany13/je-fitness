# Firebase Setup Guide for Mood Run

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name: `mood-run-app` (or any name you prefer)
4. Follow the setup wizard
5. You can disable Google Analytics if you don't need it

## Step 2: Enable Authentication

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## Step 3: Enable Firestore Database

1. In your Firebase project console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)

## Step 4: Get Your Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname: `mood-run-web`
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Step 5: Update Your Firebase Configuration

Replace the placeholder values in `src/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Step 6: Install Dependencies

Run this command in your project directory:

```bash
npm install
```

## Step 7: Test the App

1. Run `npm run dev`
2. Try creating an account
3. Check Firebase Console → Authentication → Users to see if user was created
4. Check Firestore Database to see if user document was created
5. Complete a workout and verify it's saved to the database

## Step 8: Security Rules (Optional but Recommended)

Later, you can secure your Firestore database by updating the rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only access their own data.

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Make sure you're not initializing Firebase multiple times
   - Check that you're only importing the firebase config once

2. **"Permission denied" errors**
   - Make sure Firestore is in test mode
   - Check that your security rules allow read/write operations

3. **Authentication errors**
   - Verify that Email/Password authentication is enabled
   - Check that your Firebase config is correct

4. **Database not found**
   - Make sure you've created the Firestore database
   - Check that you're using the correct project ID

### Testing Checklist:

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Workout data is saved to database
- [ ] Dashboard shows workout statistics
- [ ] Data persists between sessions

## Production Considerations

For production deployment:

1. **Update Security Rules** - Replace test mode with proper security rules
2. **Enable Additional Auth Methods** - Consider Google, Facebook, etc.
3. **Set up Custom Domain** - Configure your own domain for authentication
4. **Monitor Usage** - Set up billing alerts and monitor database usage
5. **Backup Strategy** - Consider regular database backups

## Firebase Pricing

Firebase has a generous free tier:
- **Authentication**: 10,000 users/month free
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day free
- **Hosting**: 10GB storage, 360MB/day transfer free

For most personal/small apps, the free tier is sufficient. 