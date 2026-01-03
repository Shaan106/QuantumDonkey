import { useEffect, useState } from 'react';

interface CustomCursorProps {
  imageSrc: string; // Path to cursor image
}

const CustomCursor: React.FC<CustomCursorProps> = ({ imageSrc }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update cursor position
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Show cursor when entering window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <img
        src={imageSrc}
        alt="cursor"
        className="animate-spin-slow"
        draggable={false}
      />
    </div>
  );
};

export default CustomCursor;
