import { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import ClickAnimation from './components/ClickAnimation';

function App() {
  const [clickAnimations, setClickAnimations] = useState<
    Array<{ id: string; startPos: { x: number; y: number }; endPos: { x: number; y: number } }>
  >([]);

  const handleClickAnimation = (clickPos: { x: number; y: number }) => {
    // Determine corner (top-left or top-right based on x position)
    const screenWidth = window.innerWidth;
    const startPos = clickPos.x < screenWidth / 2
      ? { x: 0, y: 0 }              // Top-left corner
      : { x: screenWidth, y: 0 };   // Top-right corner

    // Create new animation instance
    const newAnimation = {
      id: `anim-${Date.now()}`,
      startPos,
      endPos: clickPos,
    };

    setClickAnimations(prev => [...prev, newAnimation]);
  };

  const removeAnimation = (id: string) => {
    setClickAnimations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      {/* Custom spinning cursor */}
      <CustomCursor imageSrc="/cursor.png" onClickAnimation={handleClickAnimation} />

      {/* Main content - minimal off-white page */}
      <div className="min-h-screen bg-off-white">
        {/* Render all active animations */}
        {clickAnimations.map(anim => (
          <ClickAnimation
            key={anim.id}
            startPos={anim.startPos}
            endPos={anim.endPos}
            imageSrc="/click-image.png"
            onComplete={() => removeAnimation(anim.id)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
