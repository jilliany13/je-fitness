const Confetti = () => {
  const emojis = ['🎉', '🏃‍♂️', '💪', '🔥', '⭐', '🎊', '🏆', '✨']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {emojis.map((emoji, index) => (
        <div
          key={index}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            fontSize: `${2 + Math.random() * 2}rem`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}

export default Confetti 