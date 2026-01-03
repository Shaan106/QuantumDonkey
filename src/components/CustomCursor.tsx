import { useEffect, useState, useRef } from "react";

interface CustomCursorProps {
  imageSrc: string;
  onClickAnimation?: (clickPos: { x: number; y: number }) => void;
}

// Physics constants
const VELOCITY_TO_ROTATION_FACTOR = 10.0; // Sensitivity of movement to rotation (EXTREME spin!)
const FRICTION = 0.9999; // Very low friction (long momentum decay)
const MIN_ANGULAR_VELOCITY = 0.01; // Threshold to stop rotation completely
const SMOOTHING = 0.3; // Smoothing factor for velocity (0-1, lower = more smoothing)

const CustomCursor: React.FC<CustomCursorProps> = ({
  imageSrc,
  onClickAnimation,
}) => {
  // Position and visibility state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Physics state using refs for performance (avoid re-renders)
  const rotationRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  // Track velocity history for smoothing
  const velocityHistoryRef = useRef<
    Array<{ velocity: number; direction: number }>
  >([]);
  const maxHistoryLength = 5; // Track last 5 velocity samples

  // Force re-render when rotation changes (for visual updates)
  const [, forceUpdate] = useState(0);

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Update rotation based on current angular velocity
      rotationRef.current =
        (rotationRef.current + angularVelocityRef.current) % 360;

      // Apply friction
      angularVelocityRef.current *= FRICTION;

      // Stop completely when velocity is negligible
      if (Math.abs(angularVelocityRef.current) < MIN_ANGULAR_VELOCITY) {
        angularVelocityRef.current = 0;
      }

      // Force re-render to update visual rotation
      forceUpdate((prev) => prev + 1);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;

      const currentPos = { x: e.clientX, y: e.clientY };

      // Calculate velocity from movement
      if (deltaTime > 0 && deltaTime < 100) {
        // Ignore very large time gaps
        const dx = currentPos.x - prevPositionRef.current.x;
        const dy = currentPos.y - prevPositionRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate instantaneous velocity
        const velocity = distance / deltaTime; // pixels per millisecond
        const spinDirection = dx >= 0 ? 1 : -1;

        // Add to velocity history
        velocityHistoryRef.current.push({ velocity, direction: spinDirection });

        // Keep only recent history
        if (velocityHistoryRef.current.length > maxHistoryLength) {
          velocityHistoryRef.current.shift();
        }

        // Calculate average velocity and direction from history
        let avgVelocity = 0;
        let avgDirection = 0;

        if (velocityHistoryRef.current.length > 0) {
          const sum = velocityHistoryRef.current.reduce(
            (acc, curr) => {
              acc.velocity += curr.velocity;
              acc.direction += curr.direction;
              return acc;
            },
            { velocity: 0, direction: 0 }
          );

          avgVelocity = sum.velocity / velocityHistoryRef.current.length;
          avgDirection = sum.direction > 0 ? 1 : -1; // Majority direction
        }

        // Convert to angular velocity
        const targetAngularVelocity =
          avgVelocity * VELOCITY_TO_ROTATION_FACTOR * avgDirection;

        // Smooth transition to new velocity (blend with existing)
        angularVelocityRef.current =
          angularVelocityRef.current * (1 - SMOOTHING) +
          targetAngularVelocity * SMOOTHING;
      }

      // Update position tracking
      prevPositionRef.current = currentPos;
      setPosition(currentPos);
      lastTimeRef.current = currentTime;

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      const clickPos = { x: e.clientX, y: e.clientY };

      // Trigger animation
      if (onClickAnimation) {
        onClickAnimation(clickPos);
      }

      // Stop momentum after knife arrives (300ms travel time)
      setTimeout(() => {
        angularVelocityRef.current = 0;
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("click", handleClick);
    };
  }, [isVisible]);

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <img
        src={imageSrc}
        alt="cursor"
        style={{
          transform: `rotate(${rotationRef.current}deg)`,
        }}
        draggable={false}
      />
    </div>
  );
};

export default CustomCursor;
