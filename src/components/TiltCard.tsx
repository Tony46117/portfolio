import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltDeg?: number;
  glare?: boolean;
}

export default function TiltCard({ children, className = '', tiltDeg = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -tiltDeg;
      const rotateY = ((x - centerX) / centerX) * tiltDeg;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlareStyle({
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(99, 102, 241, 0.12), transparent 60%)`,
        });
      }
    },
    [tiltDeg, glare]
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({});
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        willChange: isHovered ? 'transform' : 'auto',
      }}
    >
      {children}
      {/* Glare overlay */}
      {glare && isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={glareStyle}
        />
      )}
      {/* Inner edge glow */}
      {isHovered && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 ring-1 ring-indigo-500/20" />
      )}
    </motion.div>
  );
}
