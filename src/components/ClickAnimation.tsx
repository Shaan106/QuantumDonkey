import { useEffect, useState } from 'react';

interface ClickAnimationProps {
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  imageSrc: string;
  onComplete: () => void;
}

const TRAVEL_DURATION = 300; // ms (faster - like a throwing knife!)
const DISPLAY_DURATION = 1500; // ms
const IMAGE_SIZE = 48; // px

const ClickAnimation: React.FC<ClickAnimationProps> = ({
  startPos,
  endPos,
  imageSrc,
  onComplete,
}) => {
  const [position, setPosition] = useState(startPos);
  const [phase, setPhase] = useState<'traveling' | 'displaying'>('traveling');

  // Calculate angle from start to end position
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const angleInRadians = Math.atan2(dy, dx);
  const angleInDegrees = angleInRadians * (180 / Math.PI);
  // Add 90 degrees because the knife points down (0 degrees) but atan2 assumes right (0 degrees)
  const rotationAngle = angleInDegrees + 90;

  // Calculate offset so the bottom tip of the knife hits the cursor
  // When rotated, we need to offset by half the image height along the direction vector
  const distance = Math.sqrt(dx * dx + dy * dy);
  const normalizedDx = dx / distance;
  const normalizedDy = dy / distance;
  const offset = IMAGE_SIZE / 2;

  // Offset position back along the trajectory so the tip hits the target
  const adjustedEndPos = {
    x: endPos.x - normalizedDx * offset,
    y: endPos.y - normalizedDy * offset,
  };

  useEffect(() => {
    // Start travel animation immediately
    const travelTimer = setTimeout(() => {
      setPosition(adjustedEndPos);
    }, 50); // Small delay to ensure initial position is rendered

    // After travel completes, switch to display phase
    const displayTimer = setTimeout(() => {
      setPhase('displaying');
    }, TRAVEL_DURATION);

    // After display duration, remove the animation
    const removeTimer = setTimeout(() => {
      onComplete();
    }, TRAVEL_DURATION + DISPLAY_DURATION);

    return () => {
      clearTimeout(travelTimer);
      clearTimeout(displayTimer);
      clearTimeout(removeTimer);
    };
  }, [startPos, endPos, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: phase === 'traveling'
          ? `left ${TRAVEL_DURATION}ms linear, top ${TRAVEL_DURATION}ms linear`
          : 'none',
        pointerEvents: 'none',
        zIndex: 9998, // Behind cursor (cursor is at 9999)
      }}
    >
      <img
        src={imageSrc}
        alt=""
        style={{
          width: `${IMAGE_SIZE}px`,
          height: `${IMAGE_SIZE}px`,
          transform: `rotate(${rotationAngle}deg)`,
        }}
        draggable={false}
      />
    </div>
  );
};

export default ClickAnimation;
