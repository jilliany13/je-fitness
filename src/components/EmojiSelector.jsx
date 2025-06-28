import { useState } from 'react';

const EmojiSelector = ({ selectedEmoji, onEmojiSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 25 sport-related emojis
  const sportEmojis = [
    { emoji: '🏃‍♂️', name: 'Running' },
    { emoji: '🏃‍♀️', name: 'Running Woman' },
    { emoji: '🏋️‍♂️', name: 'Weight Lifting' },
    { emoji: '🏋️‍♀️', name: 'Weight Lifting Woman' },
    { emoji: '⚽', name: 'Soccer' },
    { emoji: '🏀', name: 'Basketball' },
    { emoji: '🏐', name: 'Volleyball' },
    { emoji: '🎾', name: 'Tennis' },
    { emoji: '🏓', name: 'Table Tennis' },
    { emoji: '🏸', name: 'Badminton' },
    { emoji: '🏊‍♂️', name: 'Swimming' },
    { emoji: '🏊‍♀️', name: 'Swimming Woman' },
    { emoji: '🚴‍♂️', name: 'Cycling' },
    { emoji: '🚴‍♀️', name: 'Cycling Woman' },
    { emoji: '🥊', name: 'Boxing' },
    { emoji: '🥋', name: 'Martial Arts' },
    { emoji: '🧘‍♂️', name: 'Yoga' },
    { emoji: '🧘‍♀️', name: 'Yoga Woman' },
    { emoji: '🎳', name: 'Bowling' },
    { emoji: '🏌️‍♂️', name: 'Golf' },
    { emoji: '🏌️‍♀️', name: 'Golf Woman' },
    { emoji: '🏂', name: 'Snowboarding' },
    { emoji: '⛷️', name: 'Skiing' },
    { emoji: '🏄‍♂️', name: 'Surfing' },
    { emoji: '🏄‍♀️', name: 'Surfing Woman' },
    { emoji: '🏇', name: 'Horse Racing' },
    { emoji: '🤸‍♂️', name: 'Gymnastics' },
    { emoji: '🤸‍♀️', name: 'Gymnastics Woman' },
    { emoji: '🤺', name: 'Fencing' },
    { emoji: '🏹', name: 'Archery' },
    { emoji: '🎯', name: 'Target' },
    { emoji: '🏆', name: 'Trophy' },
    { emoji: '💪', name: 'Flexed Biceps' }
  ];

  const filteredEmojis = sportEmojis.filter(emoji =>
    emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmojiClick = (emoji) => {
    console.log('EmojiSelector: Selected emoji:', emoji);
    
    // Validate that emoji is not undefined
    if (!emoji) {
      console.error('EmojiSelector: No emoji selected');
      return;
    }
    
    // If emoji is a string (emoji.emoji), use it directly
    // If emoji is an object, extract the emoji property
    const emojiValue = typeof emoji === 'string' ? emoji : emoji.emoji;
    
    console.log('EmojiSelector: Calling onEmojiSelect with:', emojiValue);
    onEmojiSelect(emojiValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Choose Your Avatar</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-5 gap-3">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className={`p-3 rounded-lg text-2xl hover:bg-gray-100 transition-all duration-200 ${
                  selectedEmoji === emoji.emoji ? 'bg-blue-100 border-2 border-blue-500' : 'border border-gray-200'
                }`}
                title={emoji.name}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>

          {filteredEmojis.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No emojis found matching "{searchTerm}"
            </div>
          )}

          {/* Current Selection */}
          {selectedEmoji && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Current Avatar:</h4>
              <div className="text-3xl">{selectedEmoji}</div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiSelector; 