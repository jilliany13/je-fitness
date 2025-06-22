import { useHoverSupport } from './useHoverSupport';

const WorkoutTypeSelector = ({ onWorkoutTypeSelect }) => {
  const supportsHover = useHoverSupport();
  
  const workoutTypes = [
    {
      emoji: '🏋️‍♂️',
      label: 'Gym',
      description: 'Strength training & machines',
      baseColor: 'bg-purple-100 border-purple-300',
      hoverColor: 'hover:bg-purple-200'
    },
    {
      emoji: '🏃‍♂️',
      label: 'Running',
      description: 'Cardio & outdoor running',
      baseColor: 'bg-green-100 border-green-300',
      hoverColor: 'hover:bg-green-200'
    },
    {
      emoji: '🏀',
      label: 'Basketball',
      description: 'Court sports & drills',
      baseColor: 'bg-orange-100 border-orange-300',
      hoverColor: 'hover:bg-orange-200'
    },
    {
      emoji: '🏊‍♂️',
      label: 'Swimming',
      description: 'Water sports & cardio',
      baseColor: 'bg-cyan-100 border-cyan-300',
      hoverColor: 'hover:bg-cyan-200'
    },
    {
      emoji: '🎾',
      label: 'Tennis',
      description: 'Racket sports & agility',
      baseColor: 'bg-yellow-100 border-yellow-300',
      hoverColor: 'hover:bg-yellow-200'
    },
    {
      emoji: '🏐',
      label: 'Volleyball',
      description: 'Court sports & team drills',
      baseColor: 'bg-blue-100 border-blue-300',
      hoverColor: 'hover:bg-blue-200'
    },
    {
      emoji: '🥊',
      label: 'Boxing',
      description: 'Combat sports & strength',
      baseColor: 'bg-red-100 border-red-300',
      hoverColor: 'hover:bg-red-200'
    },
    {
      emoji: '🎳',
      label: 'Bowling',
      description: 'Lane sports & precision',
      baseColor: 'bg-teal-100 border-teal-300',
      hoverColor: 'hover:bg-teal-200'
    },
    {
      emoji: '🧘‍♀️',
      label: 'Yoga',
      description: 'Mind-body wellness',
      baseColor: 'bg-rose-100 border-rose-300',
      hoverColor: 'hover:bg-rose-200'
    },
    {
      emoji: '⚽',
      label: 'Soccer',
      description: 'Field sports & team play',
      baseColor: 'bg-emerald-100 border-emerald-300',
      hoverColor: 'hover:bg-emerald-200'
    },
    {
      emoji: '🏓',
      label: 'Table Tennis',
      description: 'Indoor racket sports',
      baseColor: 'bg-pink-100 border-pink-300',
      hoverColor: 'hover:bg-pink-200'
    },
    {
      emoji: '🚴‍♂️',
      label: 'Cycling',
      description: 'Outdoor cardio & endurance',
      baseColor: 'bg-lime-100 border-lime-300',
      hoverColor: 'hover:bg-lime-200'
    },
    {
      emoji: '🏸',
      label: 'Badminton',
      description: 'Racket sports & reflexes',
      baseColor: 'bg-indigo-100 border-indigo-300',
      hoverColor: 'hover:bg-indigo-200'
    },
    {
      emoji: '🏃‍♀️',
      label: 'Walking',
      description: 'Low-impact cardio',
      baseColor: 'bg-slate-100 border-slate-300',
      hoverColor: 'hover:bg-slate-200'
    },
    {
      emoji: '🏋️‍♀️',
      label: 'CrossFit',
      description: 'High-intensity training',
      baseColor: 'bg-amber-100 border-amber-300',
      hoverColor: 'hover:bg-amber-200'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Workout Type
        </h2>
        <p className="text-gray-600">
          Select the type of workout you want to do today
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {workoutTypes.map((workout, index) => (
          <button
            key={index}
            onClick={() => onWorkoutTypeSelect(workout.label)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 transform ${
              supportsHover ? 'hover:scale-103 ' + workout.hoverColor : ''
            } ${workout.baseColor}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{workout.emoji}</span>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">{workout.label}</div>
                <div className="text-sm text-gray-600">{workout.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WorkoutTypeSelector 