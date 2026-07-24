import React, { useEffect, useRef } from 'react';

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.03, className = '' }: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const generateNoise = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const resize = () => {
      const size = 64; // Small resolution for performance
      canvas.width = size;
      canvas.height = size;
    };

    const animate = () => {
      generateNoise();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    // Throttle resize
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-[2] pointer-events-none select-none ${className}`}
      style={{
        opacity,
        imageRendering: 'pixelated',
        mixBlendMode: 'overlay' as const,
      }}
    />
  );
}
