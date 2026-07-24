import React, { useEffect, useState } from 'react';

interface SpotlightProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}

export default function Spotlight({
  className = '',
  size = 600,
  color = 'rgba(99, 102, 241, 0.06)',
  opacity = 1,
}: SpotlightProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let animationFrameId: number;
    let targetPos = { x: 50, y: 50 };
    let currentPos = { x: 50, y: 50 };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      targetPos = { x, y };
    };

    const smoothFollow = () => {
      currentPos.x += (targetPos.x - currentPos.x) * 0.05;
      currentPos.y += (targetPos.y - currentPos.y) * 0.05;
      setPosition({ ...currentPos });
      animationFrameId = requestAnimationFrame(smoothFollow);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(smoothFollow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[1] pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <div
        className="absolute w-full h-full transition-[background] duration-75"
        style={{
          background: `radial-gradient(circle ${size}px at ${position.x}% ${position.y}%, ${color}, transparent 70%)`,
        }}
      />
      {/* Secondary spotlight with different color */}
      <div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(circle ${size * 0.6}px at ${100 - position.x}% ${100 - position.y}%, rgba(139, 92, 246, 0.03), transparent 70%)`,
        }}
      />
    </div>
  );
}
