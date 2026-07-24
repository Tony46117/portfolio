import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const isVisible = useRef(true);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cursor position with spring physics for smooth following
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });

  // Trail positions
  const trailCount = 5;
  const trailX = useRef(Array(trailCount).fill(-100));
  const trailY = useRef(Array(trailCount).fill(-100));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // Update trail positions with delay
    for (let i = trailCount - 1; i > 0; i--) {
      trailX.current[i] = trailX.current[i - 1];
      trailY.current[i] = trailY.current[i - 1];
    }
    trailX.current[0] = e.clientX;
    trailY.current[0] = e.clientY;

    // Update trail elements
    trailRefs.current.forEach((el, idx) => {
      if (el) {
        el.style.transform = `translate(${trailX.current[idx]}px, ${trailY.current[idx]}px)`;
      }
    });
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    isVisible.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '0';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isVisible.current = true;
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '1';
    }
  }, []);

  // Detect hoverable elements
  const handleHoverStart = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isHoverable = target.closest('a, button, [data-cursor-hover], input, textarea, select');
    if (isHoverable) {
      isHoveringRef.current = true;
      if (cursorRef.current) {
        cursorRef.current.style.width = '48px';
        cursorRef.current.style.height = '48px';
        cursorRef.current.style.borderColor = 'rgba(99, 102, 241, 0.6)';
        cursorRef.current.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
        cursorRef.current.style.backdropFilter = 'blur(4px)';
      }
    } else {
      isHoveringRef.current = false;
      if (cursorRef.current) {
        cursorRef.current.style.width = '16px';
        cursorRef.current.style.height = '16px';
        cursorRef.current.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        cursorRef.current.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
        cursorRef.current.style.backdropFilter = 'blur(0px)';
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleHoverStart);

    // Only show custom cursor on non-touch devices
    const hasTouch = 'ontouchstart' in window;
    if (hasTouch && cursorRef.current) {
      cursorRef.current.style.display = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, handleHoverStart]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border border-indigo-400/40 bg-indigo-500/15 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 16,
          height: 16,
          translateX: '-50%',
          translateY: '-50%',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s, backdrop-filter 0.2s',
        }}
      >
        {/* Inner dot */}
        <div className="absolute inset-1 rounded-full bg-indigo-400/60" />
      </motion.div>

      {/* Cursor glow */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: 120,
          height: 120,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Trail dots */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full bg-indigo-400/10"
          style={{
            width: 4 + (trailCount - i) * 2,
            height: 4 + (trailCount - i) * 2,
            translateX: '-50%',
            translateY: '-50%',
            transition: 'opacity 0.3s',
            opacity: 0.3 - i * 0.05,
          }}
        />
      ))}
    </>
  );
}
