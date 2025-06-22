import { useHoverSupport } from './useHoverSupport';

const AboutPage = ({ onReturnHome }) => {
  const supportsHover = useHoverSupport();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex justify-start">
        <button
          onClick={onReturnHome}
          className={`flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 transition-all duration-200 text-sm font-medium ${
            supportsHover ? 'hover:bg-gray-200 hover:text-gray-900' : ''
          }`}
          title="Return to Main Page"
        >
          <span className="text-sm">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Title and Image */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <img 
            src="/J-E-Caps.JPG" 
            alt="J&E Caps" 
            className="w-32 h-32 mx-auto rounded-lg shadow-md object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          About J&E Fitness
        </h2>
        <p className="text-gray-600">
          Your personal mood-based workout companion
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🎯 Our Mission</h3>
          <p>
            J&E Fitness helps you choose the perfect workout based on how you're feeling. 
            Whether you're tired and need a gentle session or fired up and ready to crush it, 
            we've got you covered.
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💪 How It Works</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Select your preferred workout type</li>
            <li>Tell us how you're feeling today</li>
            <li>Get personalized workout recommendations</li>
            <li>Track your mood before and after</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🏃‍♀️ Workout Types</h3>
          <p>
            From gym workouts to outdoor activities, we support 15 different workout types 
            including running, basketball, swimming, yoga, and many more.
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">😊 Mood-Based Approach</h3>
          <p>
            We understand that your energy levels and mood change daily. Our app adapts 
            to how you're feeling, ensuring every workout is perfectly suited to your current state.
          </p>
        </div>

        <div className="bg-rose-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">🌟 Features</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Personalized workout recommendations</li>
            <li>Mood tracking before and after workouts</li>
            <li>15 different workout types</li>
            <li>Beautiful, intuitive interface</li>
            <li>Mobile-friendly design</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-500">
          Made with ❤️ for your fitness journey
        </p>
      </div>
    </div>
  )
}

export default AboutPage 