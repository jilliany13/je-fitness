import { useState } from 'react';
import { fluencyService } from '../services/fluencyService';

const FluencyDashboard = ({ userData, onBack }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(fluencyService.getWeeklyGoal(userData));
  const [activeTab, setActiveTab] = useState('skills'); // 'achievements' or 'skills'

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-gray-500 text-center">
          <p className="font-semibold">No data available</p>
          <p className="text-sm mt-2">Complete some workouts to see your fluency progress!</p>
        </div>
      </div>
    );
  }

  const fluencyScore = fluencyService.calculateFluencyScore(userData);
  const fluencyLevel = fluencyService.getFluencyLevel(fluencyScore);
  const weeklyProgress = fluencyService.getWeeklyGoalProgress(userData);
  const achievements = fluencyService.getAchievements(userData);

  // Get all workout types that have been tried
  const triedWorkoutTypes = userData.workoutHistory 
    ? [...new Set(userData.workoutHistory.map(w => w.workoutType))]
    : [];

  // Get all available workout types
  const allWorkoutTypes = Object.keys(fluencyService.skillLevels);

  const handleSkillClick = (workoutType) => {
    setSelectedSkill(selectedSkill === workoutType ? null : workoutType);
  };

  const handleGoalChange = async () => {
    const success = await fluencyService.setWeeklyGoal(newGoal);
    if (success) {
      setShowGoalModal(false);
      // Update the userData with the new goal
      if (userData) {
        userData.weeklyGoal = newGoal;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Fitness Skills 🎯</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
        >
          Back
        </button>
      </div>

      {/* Overall Fluency Score */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">{fluencyLevel.emoji}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{fluencyLevel.level}</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">{fluencyScore}/100</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${fluencyScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {fluencyScore === 0 ? 'Start your fitness journey!' : 
           fluencyScore < 25 ? 'Keep going! Every workout counts.' :
           fluencyScore < 50 ? 'You\'re building great habits!' :
           fluencyScore < 75 ? 'Impressive consistency!' :
           'You\'re a fitness master!'}
        </p>
      </div>

      {/* Weekly Goal */}
      <button
        onClick={() => setShowGoalModal(true)}
        className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200 text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Goal</h3>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">This week's workouts</span>
          <span className="font-semibold text-gray-800">{weeklyProgress.current}/{weeklyProgress.goal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress.percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {weeklyProgress.current >= weeklyProgress.goal ? 'Goal achieved! 🎉' : 
           `${weeklyProgress.goal - weeklyProgress.current} more to go`}
        </p>
      </button>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'skills'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            💪 Your Skills
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-3 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'achievements'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.emoji}
                      </span>
                      <span className={`font-semibold text-sm ${
                        achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </span>
                      {achievement.unlocked && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mb-1 ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.date && (
                      <div className="text-xs text-gray-400">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Achievement Summary */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Progress: {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                  </span>
                  <span className="text-gray-500">
                    {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}% complete
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {allWorkoutTypes.map(workoutType => {
                  const skillLevel = fluencyService.calculateSkillLevel(workoutType, userData);
                  const skillProgress = fluencyService.calculateSkillProgress(workoutType, userData);
                  const levelInfo = fluencyService.getSkillLevelInfo(skillLevel);
                  const skillInfo = fluencyService.skillLevels[workoutType];
                  const isTried = triedWorkoutTypes.includes(workoutType);
                  const isSelected = selectedSkill === workoutType;

                  return (
                    <button
                      key={workoutType}
                      onClick={() => handleSkillClick(workoutType)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : isTried 
                            ? 'border-gray-300 bg-gray-50 hover:border-gray-400' 
                            : 'border-gray-200 bg-gray-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{skillInfo.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate">{workoutType}</div>
                          <div className="text-xs text-gray-600 truncate">{skillInfo.name}</div>
                        </div>
                      </div>
                      
                      {isTried && (
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                skillLevel === 5 ? 'bg-yellow-500' :
                                skillLevel === 4 ? 'bg-purple-500' :
                                skillLevel === 3 ? 'bg-green-500' :
                                skillLevel === 2 ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`}
                              style={{ width: `${skillProgress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">{levelInfo.name}</div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${
                              skillLevel === 5 ? 'bg-yellow-100 text-yellow-800' :
                              skillLevel === 4 ? 'bg-purple-100 text-purple-800' :
                              skillLevel === 3 ? 'bg-green-100 text-green-800' :
                              skillLevel === 2 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              L{skillLevel}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isTried && (
                        <div className="text-xs text-gray-500">Not tried yet</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Set Weekly Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workouts per week
                </label>
                <select
                  value={newGoal}
                  onChange={(e) => setNewGoal(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 workout</option>
                  <option value={2}>2 workouts</option>
                  <option value={3}>3 workouts</option>
                  <option value={4}>4 workouts</option>
                  <option value={5}>5 workouts</option>
                  <option value={6}>6 workouts</option>
                  <option value={7}>7 workouts</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGoalChange}
                  className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Details Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Skill Details</h3>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const skillLevel = fluencyService.calculateSkillLevel(selectedSkill, userData);
                const skillProgress = fluencyService.calculateSkillProgress(selectedSkill, userData);
                const levelInfo = fluencyService.getSkillLevelInfo(skillLevel);
                const skillInfo = fluencyService.skillLevels[selectedSkill];
                const workoutsOfType = userData.workoutHistory?.filter(w => w.workoutType === selectedSkill) || [];

                return (
                  <>
                    {/* Skill Header */}
                    <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="text-4xl mb-2">{skillInfo.emoji}</div>
                      <h4 className="text-lg font-semibold text-gray-800">{selectedSkill}</h4>
                      <p className="text-sm text-gray-600">{skillInfo.name}</p>
                    </div>

                    {/* Level Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">Current Level</h5>
                        <span className={`font-bold px-3 py-1 rounded text-sm ${
                          skillLevel === 5 ? 'bg-yellow-100 text-yellow-800' :
                          skillLevel === 4 ? 'bg-purple-100 text-purple-800' :
                          skillLevel === 3 ? 'bg-green-100 text-green-800' :
                          skillLevel === 2 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          Level {skillLevel} - {levelInfo.name}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            skillLevel === 5 ? 'bg-yellow-500' :
                            skillLevel === 4 ? 'bg-purple-500' :
                            skillLevel === 3 ? 'bg-green-500' :
                            skillLevel === 2 ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${skillProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {skillProgress}% complete • {workoutsOfType.length} workouts
                      </p>
                    </div>

                    {/* Next Level Requirements */}
                    {skillLevel < 5 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Next Level</h5>
                        <p className="text-sm text-gray-600">
                          Complete {skillLevel === 1 ? '4' : skillLevel === 2 ? '8' : skillLevel === 3 ? '13' : '19'} total {selectedSkill} workouts to reach Level {skillLevel + 1}
                        </p>
                      </div>
                    )}

                    {/* Recent Workouts */}
                    {workoutsOfType.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Recent {selectedSkill} Workouts</h5>
                        <div className="space-y-2">
                          {workoutsOfType.slice(-3).reverse().map((workout, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{new Date(workout.date).toLocaleDateString()}</span>
                              <span className="text-gray-800">{workout.preRunMood}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluencyDashboard; 