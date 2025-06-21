# Mood Run 🏃‍♂️

A simple wellness app that helps you choose the perfect run duration based on your current mood. Built with React, Tailwind CSS, and localStorage for a lightweight, offline-first experience.

## Features

### 🎯 Mood Selector
- Choose from 5 different moods: Low Energy, Meh, Feeling Good, Fired Up, and Energized
- Each mood is linked to a specific run duration (7, 15, 20, 30, or 45 minutes)
- Beautiful emoji-based UI with color-coded mood options

### ⏱️ Run Timer
- Countdown timer with MM:SS format display
- Visual progress ring showing run completion
- Stop button to end run early
- Motivational messages during the run

### 📝 Post-Run Reflection
- Rate how you feel after completing your run
- Choose from 5 post-run moods: Tired, Same, Better, Amazing, or Energized
- Automatic logging of your run data

### 🔥 Streak Tracker
- Tracks consecutive days of running
- Displays current streak count
- Persists data using localStorage
- Motivational streak messages

### 🎉 Celebratory Features
- Confetti animation when completing a run
- Fun emoji-based celebrations
- Smooth transitions between app states

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **localStorage** - Client-side data persistence
- **CSS Animations** - Custom keyframe animations

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mood-run
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select Your Mood**: Choose how you're feeling from the mood options
2. **Start Running**: The timer will automatically start with the duration based on your mood
3. **Complete Your Run**: Let the timer finish or stop early if needed
4. **Reflect**: Rate how you feel after your run
5. **Track Progress**: Watch your streak grow as you run consistently

## Data Storage

The app uses localStorage to store:
- Current streak count
- Last run date
- Complete run history with pre/post mood data

All data is stored locally in your browser - no backend required!

## Customization

### Adding New Moods
Edit the `moods` array in `src/components/MoodSelector.jsx` to add new mood options.

### Changing Run Durations
Modify the `duration` values in the mood objects to adjust run lengths.

### Styling
The app uses Tailwind CSS classes. Customize colors, spacing, and animations in `tailwind.config.js`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Running! 🏃‍♂️💨**
